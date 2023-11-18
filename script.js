'use strict';

(function() {
    var DataBase = {
        /**Создание переменной в базе
         * @param {*} key 
         * @param {*} value 
         */
        setValue: function(key, value) {
            if(typeof value === undefined || typeof value === null || value === '')
                this.removeValue(key);

            window.localStorage.setItem(key, JSON.stringify(value));
        },

        /** Получение переменной с базы
         * @param {*} key 
         * @returns 
         */
        getValue: function(key) {
            let value = window.localStorage.getItem(key);

            if(this.isJson(value))
                return JSON.parse(value);
            
            return value;
        },

        /** Удаление переменной из базы
         * @param {*} key 
         */
        removeValue: function(key) {
            window.localStorage.removeItem(JSON.parse(key));
        },

        /** Очистка базы */
        clear: function() {
            window.localStorage.clear();
        },

        /** Проверка является ли строка JSON объектом
         * @param {*} str 
         * @returns 
         */
        isJson: function(str) {
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

    var Owner = {
        userName: {},

        setName: function(firstName = '', lastName = '', secondName) {
            if(typeof firstName != 'string' || typeof lastName != 'string')
                return false;

            this.userName = {
                firstName : firstName,
                lastName : lastName
            }

            if(typeof secondName === 'string' && secondName != "")
                this.userName.secondName = secondName;
        },

        getFullName: function() {
            if(Object.keys(this.userName).length > 0)
                return this.userName.lastName + ' ' + this.userName.firstName + this.getSecondName();
        },

        setBirthDate: function(date) {
            try {
                if(date instanceof Date) {
                    let d = new Date(date);

                    this.userName.dateBD = d;
                }
            }
            catch(error) {
                return false;
            }
        },

        isBirthDate: function() {
            //сегодня ДР?
        },

        getSecondName: function() {
            if(this.userName.secondName)
                return ' ' + this.userName.secondName;
        },

        getUser: function() {
            return this.userName;
        }
    }

    // let personal1 = new Owner;
    //     personal1.setName('Иван', 'Петров');

    // DataBase.setValue('user1', personal1.getUser());

})(window);