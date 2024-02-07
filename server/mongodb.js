const MongoClient = require('mongodb').MongoClient;

class MongoDB 
{
    static #DBNAME = 'group10'; // Имя базы данных
    static #LOCATION = 'mongodb://localhost'; //Адрес === 127.0.0.1
    static #PORT = 27017; //Порт
    static #LOGIN;
    static #PSSWD;

    constructor() {}

    Init() {
        console.info('start DB connect');
        const url = [MongoDB.#LOCATION, MongoDB.#PORT].join(':') + '/';
        this.client = new MongoClient(url);
        this.db = this.client.db(MongoDB.#DBNAME);
        console.info('DB connect success');
    }

    async count(collectionName) {
        try {
            if(collectionName != "") {
                const collection = this.db.collection(collectionName);
                const count = await collection.countDocuments();
                console.log(count);
                return count;
            }
        }
        catch(e) {
            console.log(e);
        }
    }

    issetCollection(collectionName) {
        this.Init();

        let result = false;
        if(collectionName != "") {
            result = (this.db[collectionName]);
        }

        this.mongoClient.close();
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
    remove(collectionName, _id = ObjectId) {
        if(collectionName == "") {
            return false;
        }

        if(_id instanceof ObjectId) {

            if(confirm('Удалить?')) {
                this.initDb();
            
                this.db[collectionName].drop({_id: _id});

                this.mongoClient.close();
                return true;
            }
        }

        return false;
    }

    /**
     * 
     * @param {*} collectionName 
     * @param {*} filter 
     * @param {*} select 
     * @param {*} limit 
     * @param {*} pageCount 
     * @returns 
     */
    async get(collectionName, filter = {}, select = [], limit = 0, pageCount = 0) {
        this.Init();

        if(collectionName == "") {
            this.mongoClient.close();
            return false;
        }

        let collection = this.db.collection(collectionName);
        let request = [filter];

        if(select.length > 0) {
            let arSelect = {};
            for( let key of select) {
                arSelect[key] = 1;
            }
            request.push(arSelect); // request = [filter, arSelect];
        }

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

        let result = await collection.find(...request).toArray();//.limit(limit).skip(pageCount); // ...find(filter, select) ...
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

module.exports = MongoDB;
