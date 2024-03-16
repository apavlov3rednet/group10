const owners = {
    _id: {},
    TITLE: {
        type: 'String',
        require: true,
        default: 'None',
        loc: "ФИО",
        sort: true,
        editable: true,
    },
    PHONE: {
        type: 'Phone',
        require: true,
        default: '+7',
        loc: 'Телефон',
        sort: false,
        editable: true,
    },
    MODEL: {
        type: 'DBRef',
        require: false,
        default: 'None',
        loc: "Модель",
        sort: true,
        editable: true,
        collection: 'models'
    },
}

export default owners;