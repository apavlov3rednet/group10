import { ObjectId } from 'mongodb';
import schema from "../schema/index.js";

export default class Controll {
    constructor(collectionName) {
        if(collectionName.length == 0 )
            return false;

        this.error = null;
        this.schema = schema[collectionName];
    }

    showError() {
        console.log(this.error)
    }

    preparePost(query) {
        let data = {};

        if(query._id.length > 0) {
            data._id = new ObjectId(query._id);
        }

        if(Object.keys(query).length > 0 && Object.keys(this.schema).length > 0) {
            for(let i in this.schema) {
                if(i === '_id') continue;

                let checkValue = query[i];
                let checkSchema = this.schema[i];

                if(checkValue != '') {
                    switch(checkSchema.type) {
                        case "Number":
                            data[i] = parseFloat(checkValue);
                        break;

                        case "String":
                            data[i] = String(checkValue);
                        break;
                    }
                }
                else { //Подставляем значения по умолчанию, если оно пришло пустым или не существует
                    data[i] = checkSchema.default;
                }
            }
        }
        return data;
    }

    static prepareData(data = [], schema = {}) {
        let result = [];

        if(data instanceof Array && Object.keys(schema).length > 0) {
            data.forEach(item => {
                let newRow = {};

                for(let fieldName in schema) {
                    let fieldSchema  = schema[fieldName];
                    let newData = (item[fieldName]) ? item[fieldName] : fieldSchema.default;
                    if(fieldSchema.type === 'DBRef') {
                        let dbref = item[fieldName]; // { $ref: collection, $id: new ObjectId}
                        let collection = dbref.collection;
                        let oid = dbref.oid;

                        newRow[fieldName] = {
                            collectionName: collection,
                            _id: oid 
                        }
                    }
                    else {
                        newRow[fieldName] = newData;
                    }
                    
                }

                result.push(newRow);
            });
        }

        return result;
    }
}