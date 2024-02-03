const { DBRef } = require('mongodb');
const MongoClient = require('../mongodb');

const Brands = {
    TITLE: {
        require: true,
        type: 'String'
    },
    BRAND: {
        require: true,
        type: DBRef()
    }
}

module.exports = Brands;