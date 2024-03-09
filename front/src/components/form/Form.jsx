import { useEffect, useState } from "react";
import config from "../../params/config.js";
import './style.css';

export default function Form({nameForm, arValue = {} }) {
    const [schema, setSchema] = useState(null);
    const [formValue, setFormValue] = useState(arValue);
    const urlRequest = config.api + nameForm + '/';

    useEffect(
        () => {
            async function fetchSchema() {
                const response = await fetch(config.api + 'schema/get/' + nameForm + '/');
                const answer = await response.json();
                setSchema(answer);
            }

            fetchSchema();
            setFormValue(arValue);
        }, [nameForm, arValue]
    );

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
                            <input type={item.fieldType} 
                                required={item.require && true}
                                step={(item.fieldType === 'number') ? '1000' : null} 
                                defaultValue={item.value && item.value}
                                name={item.code} />
                        </label>
                    ))
                }
            </>
        )
    }

    return (
        <form method='POST' action={urlRequest}>
            { renderForm(schema, formValue) }

            <button>Сохранить</button>
        </form>
    )
}