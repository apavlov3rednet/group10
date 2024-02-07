const brands = {
    TITLE: {
        require: true,
        type: 'String'
    },
    PARENT_COMPANY: {
        require: false,
        type: 'String'
    },
    BUDGET: {
        require: false,
        type: 'Number',
        validate: true
    },
    COUNTRY: {
        require: false,
        type: 'String'
    }
}

module.exports = brands;