'use strict';

(function() {
    //Получаем элементы разметки
    let obOwnerForm = document.getElementById('owner');
    let obCarForm = document.getElementById('car');

    //Получаем данные из БД
    let arOwner = DB.get('owners') || [];

    function updateOwnerList() {
        let selectOwner = obCarForm.querySelector('[name=OWNER]');
        let childrens = [];

        selectOwner.innerHTML = '';

        childrens.push(DOM.create('option', {
            attrs: {value: 0},
            text: 'Выберите владельца'
        }));

        arOwner.forEach(item => {
            if(Object.keys(item).length > 0) {
                childrens.push(DOM.create('option', {
                    attrs: {value: item.id},
                    text: item.params.NAME + ' ' + item.params.LAST_NAME
                }));
            }
        });

        DOM.adjust(selectOwner, {
            children: childrens
        });
    }


    obOwnerForm.addEventListener('submit', function(event) {
        event.preventDefault(); //Отменяем штатное поведение на событие

        let arFields = obOwnerForm.querySelectorAll('input');

        let owner = new Model();

        arFields.forEach(item => {
            let params = {};
            params[item.name] = item.value;
            owner.set(params);
        });

        //Подготовка данных для БД
        arOwner.push(owner);

        //Сохранение в БД
        DB.set('owners', arOwner);

        updateOwnerList();
    });

    updateOwnerList();
})(window);