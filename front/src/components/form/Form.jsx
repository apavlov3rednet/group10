import { useEffect, useState } from "react";
import config from "../../params/config.js";
import './style.css';

export default function Form({nameForm, arValue}) {
    const [schema, setSchema] = useState(null);
    const [formValue, setFormValue] = useState(arValue);
    const [url, setUrl] = useState(config.api + nameForm + '/');

    useEffect(
        () => {
            async function fetchSchema() {
                const response = await fetch(config.api + 'schema/get/' + nameForm + '/');
                const answer = await response.json();

                for(let key in answer) {
                    let element = answer[key];

                    if(element.type === 'DBRef') {
                        let mdb = await fetch(config.api + element.collection + '/');
                        let ar = await mdb.json();
                        answer[key].arList = ar.data;
                    }
                }
                setSchema(answer);
            }
            setUrl(config.api + nameForm + '/');
            fetchSchema();
            setFormValue(arValue);
        }, [nameForm, arValue]
    );

    function renderSelect(ar) {
        let list = ar.arList;
        let value = ar.value._id;

        return (
            <>
                <option key='0' value='0' disabled>Выберите бренд</option>
                {
                    list.map(item => (
                        <option selected={value === item._id} key={item._id} defaultValue={item._id}>{item.TITLE}</option>
                    ))
                }
            </>
        )
    }

    function renderForm(data = {}, ar = {}) {
        let formElements = [];

        for(let i in data) {
            let newRow = data[i];

            newRow.code = i;
            newRow.value = (ar[i]) ? ar[i] : '';

            switch(newRow.type) {
                case "String":
                    newRow.fieldType = 'text';
                break;

                case "Number":
                    newRow.fieldType = 'number';
                break;

                case "Email":
                    newRow.fieldType = 'email';
                break;

                case "Phone":
                    newRow.fieldType = 'tel';
                break;

                case "DBRef":
                    newRow.fieldType = 'select';
                    newRow.list = renderSelect(newRow);
                break;

                case "Hidden":
                default: 
                    newRow.fieldType = 'hidden';
                break;
            }

            formElements.push(newRow);
        }

        return (
            <>
                {
                    formElements.map((item, index) => (
                        <label key={index}> 
                            <span>{item.loc} {item.require && '*'}</span>
                            {item.fieldType !== 'select' && <input type={item.fieldType} 
                                required={item.require && true}
                                step={(item.fieldType === 'number') ? '1000' : null} 
                                defaultValue={item.value && item.value}
                                name={item.code} />}

                            {item.fieldType === 'select' && <select name={item.code}>{item.list}</select>}
                        </label>
                    ))
                }
            </>
        )
    }

    return (
        <form method='POST' action={url}>
            <input type='hidden' name='collection' value={nameForm}/>
            { renderForm(schema, formValue) }

            <button>Сохранить</button>
        </form>
    )
}