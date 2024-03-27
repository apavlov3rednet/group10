import { useEffect, useState } from "react";
import InputMask from 'react-input-mask';
import DatePicker from 'react-datepicker';
import config from "../../params/config.js";
import './style.css';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from  "react-datepicker";
import { ru } from 'date-fns/locale/ru';
registerLocale('ru-RU', ru)

export default function Form({nameForm, arValue}) {
    const [schema, setSchema] = useState(null);
    const [formValue, setFormValue] = useState({});
    const [url, setUrl] = useState(config.api + nameForm + '/');
    const [edit, setEdit] = useState(false); 
    const [disabled, setDisabled] = useState(true);
    const [startDate, setStartDate] = useState(new Date());

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
            if(Object.keys(arValue).length > 0) {
                setFormValue(arValue);
                setEdit(true);
                setDisabled(false);
            }
            
        }, [nameForm, arValue]
    );

    function renderSelect(ar) {
        let list = ar.arList;
        let value = ar.value._id;

        return (
            <>
                <option key='0' value='0'>Выберите...</option>
                {
                    list.map(item => (
                        <option selected={value === item._id} key={item._id} value={item._id}>{item.TITLE}</option>
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
                    newRow.field = 'field';
                break;

                case "Number":
                    newRow.fieldType = 'number';
                    newRow.field = 'field';
                break;

                case "Email":
                    newRow.fieldType = 'email';
                    newRow.field = 'field';
                break;

                case 'Date':
                    newRow.fieldType = 'date';
                    newRow.field = 'date';
                break;

                case "Phone":
                    newRow.fieldType = 'tel';
                    newRow.field = 'tel';
                break;

                case "DBRef":
                    newRow.fieldType = 'select';
                    newRow.field = 'select';
                    newRow.list = renderSelect(newRow);
                break;

                case "Hidden":
                default: 
                    newRow.fieldType = 'hidden';
                    newRow.field = 'hidden';
                break;
            }

            formElements.push(newRow);
        }

        return (
            <>
                {
                    formElements.map((item, index) => (
                        <>
                        { item.field === 'hidden' && <input type='hidden' name={item.code} defaultValue={item.value && item.value} />}  


                        <label key={index}> 
                            <span>{item.loc} {item.require && '*'}</span>
                            {
                                item.field === 'field' && <input type={item.fieldType} 
                                    required={item.require && true}
                                    step={(item.fieldType === 'number') ? item.step : null} 
                                    defaultValue={item.value && item.value}
                                    readOnly={item.readOnly}
                                    onChange={item.sim && callMethod}
                                    name={item.code} />
                            }

                            {
                                item.field === 'select' && <select name={item.code}>{item.list}</select>
                            }

                            {
                                item.field === 'tel' && <InputMask
                                required={item.require && true}
                                defaultValue={item.value && item.value}
                                name={item.code}
                                    mask="+7(999)-999-99-99" maskChar="_" />
                            }

                            {
                                item.field === 'date' && <DatePicker
                                    selected={startDate}
                                    dateFormat="dd.MM.yyyy"
                                    name={item.code}
                                    locale='ru-RU'
                                    required={item.require && true}
                                    defaultValue={item.value && item.value}
                                    onChange={(date) => setStartDate(date)}
                                />
                            }
                        </label>
                        </>
                    ))
                }
            </>
        )
    }

    function callMethod(event) {
        let form = event.target.closest('form'); //Форма
        let name = event.target.name; //Имя поля провокатора является ключем схемы
        let curSchemaTotal = schema[name].sim; //Имя поля с итогом

        if(curSchemaTotal) {
            let obTotal = form.querySelector('input[name='+curSchemaTotal+']'); //Поле с итогом
            let value = 0;
            let method = schema[curSchemaTotal].method; //Метод поля с итогом
            let arSims = schema[curSchemaTotal].fields; //Ключи связных полей
            let arFields = [];

            arSims.forEach(item => {
                arFields.push(form.querySelector('input[name='+item+']'));
            });

            switch(method) {
                case "MULTIPLY":
                    value = arFields[0].value * arFields[1].value;
                break;
            }

            obTotal.value = value;
        }
    }

    function clearForm(event) {
        event.preventDefault();
        setFormValue({});
        renderForm(schema, {});
        setEdit(false);
        setDisabled(true);
    }

    function checkRequired(event) {
        let formElement = event.target.closest('form').querySelectorAll('input, select, textarea');
        let error = 0;

        formElement.forEach(item => {
            if(item.required === true && (item.value === '0' || item.value === '')) {
                setDisabled(true);
                error++;
            }
        });

        if(error == 0) 
            setDisabled(false);
    }

    return (
        <form method='POST' action={url} onChange={checkRequired}>
            <input type='hidden' name='collection' value={nameForm}/>
            { renderForm(schema, formValue) }

            <button disabled={disabled && disabled}>
                {!edit && 'Сохранить'}
                {edit && 'Изменить'}
            </button>
            <button onClick={clearForm}>Сбросить</button>
        </form>
    )
}