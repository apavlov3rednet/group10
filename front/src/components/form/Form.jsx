import { useEffect, useState } from "react";
import './style.css';

export default function Form({nameForm}) {
    const [schema, setSchema] = useState(null);
    const urlRequest = 'http://localhost:8000/api/' + nameForm + '/';

    useEffect(
        () => {
            async function fetchSchema() {
                const response = await fetch('http://localhost:8000/api/schema/get/' + nameForm + '/');
                const answer = await response.json();
                console.log(answer);
                setSchema(answer);
            }

            fetchSchema();
        }, []
    );

    function renderForm(data = {}) {
        let formElements = [];

        for(let i in data) {
            let newRow = data[i];

            newRow.code = i;

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
                            <span>{item.loc}</span>
                            <input type={item.fieldType} 
                                step={(item.fieldType === 'number') ? '1000' : null} 
                                name={item.code} />
                        </label>
                    ))
                }
            </>
        )
    }

    async function sendRequest(event) {
        event.preventDefault();

        let form = event.target.parentNode;
        let arFields = form.querySelectorAll('input, textarea, select');
        let idField = form.querySelector('input[name=_id]');
        let queryType = 'ADD';
        let data = {};

        if(idField.value != '') {
            queryType = 'UPDATE';
        }

        arFields.forEach(item => {
            data[item.name] = item.value;
        });

        data.queryType = queryType;

        const response = await fetch(urlRequest, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });

        const answer = await response.json();

        console.log(answer);
    }

    return (
        <form method='POST'>
            { renderForm(schema) }

            <button onClick={sendRequest}>Сохранить</button>
        </form>
    )
}