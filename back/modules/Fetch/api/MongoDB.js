import { MongoClient, ObjectId } from 'mongodb';
import Schema from '../schema/index.js';
import Controll from './Controll.js';

export default class MongoDB 
{
    static #DBNAME = 'group10'; // Имя базы данных
    static #LOCATION = 'mongodb://localhost'; //Адрес === 127.0.0.1
    static #PORT = 27017; //Порт
    static #LOGIN;
    static #PSSWD;

    constructor(collectionName = '') {
        console.info('start DB connect');
        const url = [MongoDB.#LOCATION, MongoDB.#PORT].join(':') + '/';
        this.client = new MongoClient(url);
        this.db = this.client.db(MongoDB.#DBNAME);

        if(collectionName != '') {
            this.collection = this.db.collection(collectionName);
            this.schema = Schema[collectionName];
            this.controll = new Controll(collectionName);
        }
        
        console.info('DB connect success');
    }

    async count() {
        try {
            const count = await this.collection.countDocuments();
            return count;
        }
        catch(e) {
            console.log(e);
        }
    }

    issetCollection(collectionName) {
        let result = false;
        if(collectionName != "") {
            result = (this.db[collectionName]);
        }
        return result;
    }

    createCollection(collectionName, props = {}) {
        if(collectionName === "")
            return false;

        let isset = this.issetCollection(collectionName);

        if(!isset) {
            this.Init();

            let collection = this.db.createCollection(collectionName, props);
            this.mongoClient.close();
            return collection; // {ok: 1}
        }

        return false;
    }

    async set(props = {}) {
        if(!this.collection)
            return {};

        let id = 0;
        let controllData = this.controll.preparePost(props);

        if(controllData._id) {
            //UPDATE
            let result = await this.collection.updateOne(
                { _id : controllData._id },
                { $set : controllData }
            );
            id = result;
        }
        else {
            //ADD
            id = await this.collection.insertOne(controllData);
        }

        return id;
    }

    /**
     * 
     * @param {*} collectionName 
     * @param {*} _id 
     */
    async remove(_id) {  
        if(!this.collection)
            return {};       
        await this.collection.deleteOne({_id: new ObjectId(_id)});
        return true;
    }

    /**
     * 
     * @param {*} filter 
     * @param {*} select 
     * @param {*} limit 
     * @param {*} pageCount 
     * @returns 
     */
    async get(options = {}) {
        if(!this.collection)
            return {};

        //Дефолтный фильтр по идентификатору
        let filter = options.filter ? options.filter : {};
        let unPrepResult;

        //Поисковый запрос
        if(options.search && options.search.length > 1) {
            let arLine = options.search.split(' ').join('|');

            let query = new RegExp(arLine);
            let xor = [];
            
            for(let index in this.schema) {
                let item = this.schema[index];

                if(item.searchable) {
                    let el = {};
                    el[index] = { $regex : query, $options: 'i'};
                    xor.push(el)
                }
            }

            filter = {
                $or: [...xor]
            }
        }

        //min & max
        //this.collection.find().sort( {KEY:  -1}).limit(1).toArray();
        if(options.sort) {
            if(options.sort.max) {
                options.sort.key = -1;
                options.sort.name = options.sort.max;
            }

            if(options.sort.min) {
                options.sort.key = 1;
                options.sort.name = options.sort.min;
            }
        }

        if(options.sort && options.sort.key) {
            let sort = {};
            sort[options.sort.name] = options.sort.key;
            unPrepResult = await this.collection.find().sort(sort).limit(1).toArray();
        }
        else {
            unPrepResult = await this.collection.find(filter).toArray();
        }

        let data = Controll.prepareData(unPrepResult, this.schema);
        let simId = {};
        let sim = {};

        data.forEach(item => {
            for(let i in item) {
                let keyElement =item[i];

                if(keyElement.ref) {
                    if(!simId[keyElement.collectionName])
                        simId[keyElement.collectionName] = [];

                    simId[keyElement.collectionName].push(new ObjectId(keyElement._id));
                }
            }
        });

        if(Object.keys(simId).length > 0) {
            for(let collection in simId) {
                let mdb = new MongoDB(collection);
                let ids = simId[collection];

                sim[collection] = await mdb.collection.find({
                    _id: { $in: ids }
                }).toArray();
            }
        }

        return {
            schema: this.schema,
            data: data,
            sim: sim
        };
    }

    async findSimilar(data = []) {
        if(!this.collection)
            return {};

        let newData = data;

        data.forEach(async (item, i) => {
            for(let index in item) {
                if(item[index].collectionName) {
                    let el = await this.getSimilar(item[index]);
                    console.log(index, newData[i], el);
                    newData[i][index]['TITLE'] = el.TITLE;
                }
            }
        });

        return await newData;
    }

    static isJson(str) {
        try {
            JSON.parse(str);
        }
        catch(error) {
            //console.error(error);
            return false;
        }

        return true;
    }

    async getCollectionsStats() {
        let result = [];
        let sources = await this.db.listCollections().toArray();

        for(const source of sources) {
            const mdb = new MongoDB(source.name);
            const data = await mdb.getCollectionInfo();
            result.push(data);
        }

        return result;
    }

    async getCollectionInfo() {
        let _this = this;

        return new Promise(async resolve => {
            resolve({
                TITLE: _this.collection.namespace,
                INDEXES: (await _this.collection.indexes()).length,
                DOCUMENTS: await _this.collection.countDocuments()
            });
        });

    } 
}
