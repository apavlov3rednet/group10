"use strict";

(function () {
  //Формы
  let obOwnerForm = document.getElementById("owner");
  let obCarForm = document.getElementById("car");
  let obBrandForm = document.getElementById("brand");

  //Получаем данные из БД
  let arOwner = DB.get("owners") || [];
  let arBrand = DB.get("brands") || [];

  //Селекты
  let selectOwner = obCarForm.querySelector("[name=OWNER]");
  let selectBrand = obCarForm.querySelector("[name=BRAND]");

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

  obOwnerForm.addEventListener("submit", function (event) {
    event.preventDefault(); //Отменяем штатное поведение на событие

    let arFields = obOwnerForm.querySelectorAll("input");

    let owner = new Model();

    arFields.forEach((item) => {
      let params = {};
      params[item.name] = item.value;
      owner.set(params);
    });

    //Подготовка данных для БД
    arOwner.push(owner);

    //Сохранение в БД
    DB.set("owners", arOwner);

    updateList(selectOwner, arOwner);
  });

  obBrandForm.addEventListener("submit", function (event) {
    event.preventDefault(); //Отменяем штатное поведение на событие

    let arFields = obBrandForm.querySelectorAll("input");

    let brand = new Model();

    arFields.forEach((item) => {
      let params = {};
      params[item.name] = item.value;
      brand.set(params);
    });

    //Подготовка данных для БД
    arBrand.push(brand);

    //Сохранение в БД
    DB.set("brands", arBrand);

    updateList(selectBrand, arBrand);
  });

  //Формирование селектов при первой загрузке
  updateList(selectOwner, arOwner);
  updateList(selectBrand, arBrand);
})(window);
