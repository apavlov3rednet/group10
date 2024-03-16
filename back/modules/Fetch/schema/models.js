const models = {
    _id: {},
    BRAND: {
        type: 'DBRef',
        require: false,
        default: 'None',
        loc: "Бренд",
        sort: true,
        editable: true,
        collection: 'brands'
    },
    TITLE: {
        type: 'String',
        require: true,
        default: 'None',
        loc: "Название",
        sort: true,
        editable: true,
    },
    
}

export default models;