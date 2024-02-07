const DBRef = require('mongodb');
const controllSchema = (data = {}, schema = {}) => {
    let pushData = {};

    for(let index in data) {
        let val = data[index];
        let model = schema[index];

        if(model.validate) {
            switch(schema.type) {
                case "String":
                    pushData[index] = String(val);
                break;

                case "Number":
                    pushData[index] = Number(val);
                break;
            }
        }
        else {
            pushData[index] = val;
        }
    }

    return pushData;
}

module.exports = controllSchema;