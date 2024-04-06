import { useCallback, useEffect, useState } from 'react';
import config from '../../params/config.js';
import './style.css';

export default function Search({ onChange, nameCollection }) {
    const [schema, setSchema] = useState({});
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);

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
                        let min = await fetch(config.api + nameCollection + '?min=' + key);
                        let minValue = await min.json();
                        let max = await fetch(config.api + nameCollection + '?max=' + key);
                        let maxValue = await max.json();

                        answer[key].limits = {
                            min: minValue.data[0][key],
                            max: maxValue.data[0][key]
                        }
                    }
                }

                console.log(answer);
                setSchema(answer);
            }
            
            fetchSchema();
        }, [nameCollection]
    );

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
        let parent = field.closest('label');
        let key = field.id.split('_');

        if(key[1] === 'MIN') {
            let obSim = parent.querySelector('#' + key[0] + '_MAX');

            if(obSim.value <= field.value) {
                let maxValue = parseInt(field.value) + parseInt(obSim.step);

                if(maxValue > parseInt(field.max)) {
                    maxValue = parseInt(field.max);
                }
                setMax(maxValue);
            }

            if(field.value >= field.max) {
                setMin(parseInt(field.value) - parseInt(field.step))
            }
            else {
                setMin(field.value);
            }
        }

        if(key[1] === 'MAX') {
            let obSim = parent.querySelector('#' + key[0] + '_MIN');
            setMax(field.value);
        }
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
                }

                formElements.push(newRow);
            }
        }

        return (
            <>
                {
                    formElements.map((item, index) => (     
                        <label key={index}> 
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
                                    name={item.code + '[MIN]'} 
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
                                    name={item.code + '[MAX]'}
                                    onChange={changeValue} />
                                <datalist id={item.code + '_MAX'}>
                                    <option value={item.limits.min} label={item.limits.min}></option>
                                    <option className='curValue' defaultValue={max} label={max}></option>
                                    <option value={item.limits.max} label={item.limits.max}></option>
                                </datalist>
                            </div> 
                            
                        </label>
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
            </form>
        </div>
        <div className='overlay' onClick={toggleFilter}/>
        </>
    )
}