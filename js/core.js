"use strict";

(function () {
    //Формы
    let obOwnerForm = document.getElementById("owner");
    let obCarForm = document.getElementById("car");
    let obBrandForm = document.getElementById("brand");
    let obModelForm = document.getElementById("model");

    //Получаем данные из БД
    let arOwner = DB.get("owners") || [];
    let arBrand = DB.get("brands") || [];
    let arModel = DB.get("models") || [];

    //Селекты
    let selectOwner = obCarForm.querySelector("[name=OWNER]");
    let selectBrand = obCarForm.querySelector("[name=BRAND]");
    let selectModel = obCarForm.querySelector("[name=MODEL]");
    let selectModelBrand = obModelForm.querySelector("[name=BRAND]");

    //Универсальная функция обновления селектов
    function updateList(select, arr, title = "Выберите") {
        let childrens = [];

        select.innerHTML = "";

        childrens.push(
            DOM.create("option", {
                attrs: { value: 0 },
                text: title,
            })
        );

        arr.forEach((item) => {
            if (Object.keys(item).length > 0) {
                childrens.push(
                    DOM.create("option", {
                        attrs: { value: item.id },
                        text: Object.values(item.params).join(" "),
                    })
                );
            }
        });

        DOM.adjust(select, {
            children: childrens,
        });
    }

    //Универсальная функция отправки формы
    function bindSendForm(obForm, arr, db, callback = []) {
        obForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let arFields = obForm.querySelectorAll("input, select");
            let model = new Model();

            arFields.forEach((item) => {
                let params = {};
                params[item.name] = item.value;
                model.set(params);

                switch (item.tagName) {
                    case "INPUT":
                        item.value = "";
                        break;

                    case "SELECT":
                        item.value = 0;
                        break;
                }
            });

            arr.push(model);

            DB.set(db, arr);

            callback.forEach((item) => updateList(item, arr));
        });
    }

    selectBrand.addEventListener('change', function(event) {
        event.preventDefault();

        let value = selectBrand.value;

        if(arModel.length > 0) {
            let newArray = arModel.filter(item => item.params.BRAND === value);
            updateList(selectModel, newArray);
        }
    });

    bindSendForm(obOwnerForm, arOwner, "owners", [selectOwner]);
    bindSendForm(obBrandForm, arBrand, "brands", [
        selectBrand,
        selectModelBrand,
    ]);
    bindSendForm(obModelForm, arModel, "models", [selectModel]);

    //   obOwnerForm.addEventListener("submit", function (event) {
    //     event.preventDefault(); //Отменяем штатное поведение на событие

    //     let arFields = obOwnerForm.querySelectorAll("input");

    //     let owner = new Model();

    //     arFields.forEach((item) => {
    //       let params = {};
    //       params[item.name] = item.value;
    //       owner.set(params);
    //     });

    //     //Подготовка данных для БД
    //     arOwner.push(owner);

    //     //Сохранение в БД
    //     DB.set("owners", arOwner);

    //     updateList(selectOwner, arOwner);
    //   });

    //   obBrandForm.addEventListener("submit", function (event) {
    //     event.preventDefault(); //Отменяем штатное поведение на событие

    //     let arFields = obBrandForm.querySelectorAll("input");

    //     let brand = new Model();

    //     arFields.forEach((item) => {
    //       let params = {};
    //       params[item.name] = item.value;
    //       brand.set(params);
    //     });

    //     //Подготовка данных для БД
    //     arBrand.push(brand);

    //     //Сохранение в БД
    //     DB.set("brands", arBrand);

    //     updateList(selectBrand, arBrand);
    //   });

    //Формирование селектов при первой загрузке
    updateList(selectOwner, arOwner);
    updateList(selectBrand, arBrand);
    updateList(selectModelBrand, arBrand);
    updateList(selectModel, arModel);
})(window);
