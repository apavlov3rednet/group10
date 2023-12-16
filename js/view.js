class View {
    constructor() {
        this.obContent = document.getElementById('content');
    }

    setContent(content) {
        let _this = this;
        this.obContent.innerHTML = content;

        let obForm = this.obContent.querySelector('form');
        if(obForm) {
            let dbName = obForm.id;
            let db = DB.get(dbName) || [];
            let arSelect = obForm.querySelectorAll('select');

            _this.bindSendForm(obForm, db, dbName, arSelect);

            arSelect.forEach(item => {
                let name = item.getAttribute('name').toLowerCase() + 's';
                let db2 =  DB.get(name) || [];
                _this.updateList(item, db2);
            });
        }
    }

    bindSendForm(obForm, arr, db, callback = []) {
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

    updateList(select, arr, title = "Выберите") {
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
}