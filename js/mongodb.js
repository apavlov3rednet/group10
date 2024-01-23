const { ObjectId } = require("mongodb");

class MongoDB 
{
    static #DBNAME = 'group10'; // Имя базы данных
    static #LOCATION = 'mongodb://localhost'; //Адрес === 127.0.0.1
    static #PORT = 27017; //Порт
    static #LOGIN;
    static #PSSWD;

    constructor() {}

    static initDb() {
        const MongoClient = require(DB.#DBNAME).MongoClient;
        const url = [DB.#LOCATION, DB.#PORT].join(":"); // mongodb://localhost:27017

        this.mongoClient = new MongoClient(url);
        this.client = this.mongoClient.connect(); //login & password
        this.db = client.db(DB.#DBNAME);
    }

    static issetCollection(collectionName) {
        this.initDb();

        let result = false;
        if(collectionName != "") {
            result = (this.db[collectionName]);
        }

        this.mongoClient.close();
        return result;
    }

    static createCollection(collectionName, props = {}) {
        if(collectionName === "")
            return false;

        let isset = this.issetCollection(collectionName);

        if(!isset) {
            this.initDb();

            let collection = this.db.createCollection(collectionName, props);
            this.mongoClient.close();
            return collection; // {ok: 1}
        }

        return false;
    }

    static set(collectionName, props = {}) {
        let id = 0;
        this.initDb();

        if(collectionName == "" || Object.keys(props).length === 0) {
            this.mongoClient.close();
            return false;
        }

        id = this.db[collectionName].insertOne(props); //db.collectionName
        this.mongoClient.close();
        return id;
    }

    /**
     * 
     * @param {*} collectionName 
     * @param {*} _id 
     */
    static remove(collectionName, _id = ObjectId) {
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
    static get(collectionName, filter = {}, select = [], limit = 0, pageCount = 0) {
        let ob = null;
        this.initDb();

        if(collectionName == "") {
            this.mongoClient.close();
            return false;
        }

        let collection = this.db.getCollection(collectionName);
        let request = [filter];

        if(select.length > 0) {
            let arSelect = {};
            for( let key of select) {
                arSelect[key] = 1;
            }
            request.push(arSelect); // request = [filter, arSelect];
        }

        ob = collection.find(...request).limit(limit).skip(pageCount); // ...find(filter, select) ...

        this.mongoClient.close();

        return ob;
    }

    static count(collectionName) {
        this.initDb();
        let result = 0;

        if(collectionName != "") {
            result = this.db[collectionName].count();
        }
        this.mongoClient.close();
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

window.MDB = new MongoDB()
