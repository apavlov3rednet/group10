import { MongoClient } from 'mongodb';

export default class MongoDB 
{
    static #DBNAME = 'group10'; // Имя базы данных
    static #LOCATION = 'mongodb://localhost'; //Адрес === 127.0.0.1
    static #PORT = 27017; //Порт
    static #LOGIN;
    static #PSSWD;

    constructor(collectionName) {
        console.info('start DB connect');
        const url = [MongoDB.#LOCATION, MongoDB.#PORT].join(':') + '/';
        this.client = new MongoClient(url);
        this.db = this.client.db(MongoDB.#DBNAME);
        this.collection = this.db.collection(collectionName);
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

    async set(collectionName, props = {}) {
        if(collectionName == "" || Object.keys(props).length === 0) {
            this.mongoClient.close();
            return false;
        }

        let collection = this.db.collection(collectionName);

        let result = await collection.insertOne(props); //db.collectionName

        return result;
    }

    /**
     * 
     * @param {*} collectionName 
     * @param {*} _id 
     */
    async remove(_id = ObjectId) {
        if(_id instanceof ObjectId) {

            if(confirm('Удалить?')) {            
                await this.collection.dropOne({_id: _id});
                return true;
            }
        }

        return false;
    }

    /**
     * 
     * @param {*} filter 
     * @param {*} select 
     * @param {*} limit 
     * @param {*} pageCount 
     * @returns 
     */
    async get(filter = {}, select = [], limit = 0, pageCount = 0) {
        let query = [];
        let options = {};
        let arResult = [];

        if(select.length > 0) {
            let arSelect = {};
            for( let key of select) {
                arSelect[key] = 1;
            }
            query.push(arSelect); // request = [filter, arSelect];
        }

        if(limit > 0)
            options.limit = limit;

        if(pageCount > 0)
            options.skip = pageCount;

        /**
         * todo: переписать
        this.db.runCommand({
            find: collectionName,
            filter: {},
            sort: {},
            limit: int,
            skip: int,
            returnKey: Boolean,
            awaitData: Boolean,
            let: <document>
        });
        */

        console.log(filter, {query, ...options});

        let result = await this.collection.find(filter, { query, ...options }).toArray();

        // while(result.hasNext()) {
        //     arResult.push(result.next());
        // }

        //.limit(limit).skip(pageCount); // ...find(filter, select) ...
        return result;
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
}
