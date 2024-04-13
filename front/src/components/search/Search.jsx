import { useCallback, useEffect, useState } from 'react';
import config from '../../params/config.js';
import DatePicker from 'react-datepicker';
import './style.css';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from  "react-datepicker";
import { ru } from 'date-fns/locale/ru';
registerLocale('ru-RU', ru);

export default function Search({ onChange, nameCollection }) {
    const [schema, setSchema] = useState({});
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const [step, setStep] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);

    useEffect(
        () => {
            async function fetchSchema() {
                const response = await fetch(config.api + 'schema/get/' + nameCollection + '/');
                const answer = await response.json();

                for(let key in answer) {
                    let element = answer[key];

                    if(element.type === 'DBRef') {
                        let mdb = await fetch(config.api + element.collection + '/');
                        let ar = await mdb.json();
                        answer[key].arList = ar.data;
                    }

                    if(element.filter && element.type === 'Number') {
                        let minRequest = await fetch(config.api + nameCollection + '?min=' + key);
                        let minValue = await minRequest.json();
                        let maxRequest = await fetch(config.api + nameCollection + '?max=' + key);
                        let maxValue = await maxRequest.json();

                        answer[key].limits = {
                            min: minValue.data[0][key],
                            max: maxValue.data[0][key]
                        }

                        setStep(parseInt(element.step));
                        setMin(minValue.data[0][key]);
                        setMax(minValue.data[0][key] + step);
                    }
                }

                setSchema(answer);
            }
            
            fetchSchema();
        }, [nameCollection]
    );

    function onChangeDates(dates) {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    function inputEvent(event) {
        onChange(event.target.value);
    }

    function toggleFilter() {
        let modal = document.querySelector('.modal');
        let overlay = document.querySelector('.overlay');

        modal.classList.toggle('show');
        overlay.classList.toggle('show');
    }

    function changeValue(event) {
        let field = event.target;
        let parent = field.closest('.label');
        let key = field.id.split('_');

        if(key[1] === 'MIN') {
            //Получаем поле "до"
            let obSim = parent.querySelector('#' + key[0] + '_MAX');

            //Если значение "от" больше значения "до"
            if(obSim.value <= field.value) {
                //расчитываем значение "до" + шаг
                let maxValue = parseInt(field.value) + step;

                //Запрещаем ставить значение "до" больше существующего максимума
                if(maxValue > parseInt(field.max)) {
                    maxValue = parseInt(field.max);
                }
                setMax(maxValue);
            }
 
            //Устанавливаем значение "от" минус шаг, если близко к максимуму
            if(field.value >= field.max) {
                setMin(parseInt(field.value) - step)
            }
            else {
                setMin(field.value);
            }
        }

        if(key[1] === 'MAX') {
            let obSim = parent.querySelector('#' + key[0] + '_MIN');

            if(field.value <= obSim.value) {
                let minValue = parseInt(field.value) - step;

                if(minValue < parseInt(obSim.min)) {
                    setMin(obSim.min);
                }

                setMin(minValue);
            }

            if(field.value > field.min) {
                setMax(field.value);
            }
            else {
                setMax(parseInt(field.value) + step);
            }
        }
    }

    function clearFilter(event) {
        event.preventDefault();
        let curPage = window.location;
        document.location.href = curPage.origin + curPage.pathname;
    }

    function renderFilter(data = {}) {
        let formElements = [];
        for(let i in data) {
            let newRow = data[i];

            newRow.code = i;
            if(newRow.filter) {
                switch(newRow.type) {
                    case 'Number':
                        newRow.field = 'range';
                    break;

                    case 'Date':
                        newRow.field = 'datepicker';
                    break;
                }

                formElements.push(newRow);
            }
        }

        return (
            <>
                {
                    formElements.map((item, index) => (   
                        <>
                        {   item.field === 'range' &&
                            <div className='label' key={index}> 
                                <span>{item.loc} </span>
                                <div className='rangeGroup'>
                                    от: 
                                    <input type={item.field} 
                                        required={item.require && true}
                                        step={item.step ? item.step : null} 
                                        min={item.limits.min}
                                        max={item.limits.max}
                                        defaultValue={min}
                                        value={min}
                                        list={item.code + '_MIN'}
                                        id={item.code + '_MIN'}
                                        name={item.code + '[FROM]'} 
                                        onChange={changeValue}/>
                                    <datalist id={item.code + '_MIN'}>
                                        <option value={item.limits.min} label={item.limits.min}></option>
                                        <option className='curValue' defaultValue={min} label={min}></option>
                                        <option value={item.limits.max} label={item.limits.max}></option>
                                    </datalist>
                                </div>

                                <div className='rangeGroup'>
                                    до: 
                                    <input type={item.field} 
                                        required={item.require && true}
                                        step={item.step ? item.step : null} 
                                        min={item.limits.min}
                                        max={item.limits.max}
                                        defaultValue={max}
                                        value={max}
                                        list={item.code + '_MAX'}
                                        id={item.code + '_MAX'}
                                        name={item.code + '[TO]'}
                                        onChange={changeValue} />
                                    <datalist id={item.code + '_MAX'}>
                                        <option value={item.limits.min} label={item.limits.min}></option>
                                        <option className='curValue' defaultValue={max} label={max}></option>
                                        <option value={item.limits.max} label={item.limits.max}></option>
                                    </datalist>
                                </div> 
                                
                            </div>
                        }

                        {
                            item.field === 'datepicker' && 
                            <div className='label'>
                                <span>{item.loc}</span>
                                <DatePicker
                                    selected={startDate}
                                    onChange={onChangeDates}
                                    startDate={startDate}
                                    endDate={endDate}
                                    locale='ru-RU'
                                    dateFormat="dd.MM.yyyy"
                                    selectsRange
                                    inline
                                    />

                                <input type='hidden' name={item.code + '[FROM]'} defaultValue={new Date(startDate)} />
                                <input type='hidden' name={item.code + '[TO]'} defaultValue={new Date(endDate)} />
                            </div>
                            
                        }
                        </>
                    ))

                    
                }
            </>
        )
    }

    return (
        <>
        <div className='searchPanel'>
            <label>
                <input onChange={inputEvent} placeholder='Введите поисковый запрос'/>
            </label>

            <button onClick={toggleFilter}></button>
        </div>

        <div className='modal'>
            <div className='modal-head'>Фильтр <button onClick={toggleFilter}></button></div>
            <form method='GET'>
                {renderFilter(schema)}
                <input type="hidden" name="filter" value="Y"/>
                
                <div className='buttons'>
                <button>Отфильтровать</button>
                <button onClick={clearFilter}>Очистить</button>
                </div>
                
            </form>
        </div>
        <div className='overlay' onClick={toggleFilter}/>
        </>
    )
}