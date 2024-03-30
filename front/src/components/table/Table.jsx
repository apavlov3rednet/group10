import { useCallback, useState, useEffect } from "react";
import config from "../../params/config.js";
import './style.css';


export default function Table({nameTable, onChange}) {
    const [table, setTable] = useState({
        header: [],
        body: [],
        sim: {}
    });
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');

    const fetchTable = useCallback(async () => {
        setLoading(true);
        const response = await fetch(config.api+ nameTable +'/' + query);
        let answer = await response.json();

        const data = {
            header: answer.schema,
            body: answer.data,
            sim: answer.sim
        }

        setTable(data);
        setLoading(false);
    }, [nameTable, onChange, query])

    useEffect(
        () => {
            fetchTable()
        }, [fetchTable] 
    )

    function setSort(key) {
        console.log(key)
    }

    async function dropElement(key) {
        const url = config.api+ nameTable +'/' + key.target.value + '/';
        const c = window.confirm('Уверены?');
        if(c) {
            const response = await fetch(url);
            let answer = response.status;

            if(answer === 200) {
                fetchTable();
            }
        }
    }

    async function edit(event) {
        const url = config.api + nameTable + '/?id=' + event.target.value;
        const response = await fetch(url);
        const answer = await response.json();
        console.log(answer);
        onChange(answer);
    }

    function getHeader(schema) {
        let header = [];
        for(let i in schema) {
            if(i === '_id') {
                header.push({loc: 'ID'})
            }
            else {
                header.push(schema[i])
            }
        }

        header.push({});

        return (
            <tr>
                {
                    header.map((item, index) => (
                        <th key={index} 
                        className={item.sort ? 'sortable' : null}
                        onClick={item.sort ? setSort : null}>
                            {item.loc}
                            </th>
                    ))
                }
            </tr>
        )
    }

    function getContent(col, index, sim, schema) {
        let value = col;
        let getIndex = 0;
        let curSchema = 0;

        for(let i in schema) {
            if(getIndex === index) {
                curSchema = schema[i];
            }
            getIndex++;
        }

        if(col.ref) {
            value = sim[col.collectionName].filter(item => item._id === col._id)[0].TITLE;
        }

        if(curSchema.type === 'Phone') {
            let callTo = 'tel:' + col;
            value = <a href={callTo}>{col}</a>
        }

        if(curSchema.type === 'Email') {
            let mailTo = 'mailto:' + col;
            value = <a href={mailTo}>{col}</a>
        }

        if(curSchema.type === 'Date') {
            let date = new Date(col);
            value = new Intl.DateTimeFormat('ru').format(date);
        }

        return (
            <td key={index}>
                {value && value}
            </td>
        )
    }

    function searchEvent(event) {
        let field = event.target;
        let value = field.value;

        setQuery('?q=' + value);
    }

    return (
        <>
        <label>
            <input placeholder="Начните вводить поиск..." onChange={searchEvent}/>
        </label>
        <table className='simple-table'>
            <thead>
                {!loading && getHeader(table.header)}
            </thead>

            <tbody>
                {
                    !loading && table.body.map((row) => (
                        <tr key={row._id}>
                            {Object.values(row).map((col, index )=> (
                                getContent(col, index, table.sim, table.header)
                            ))}
                            <td>
                                <button className='edit' onClick={edit} value={row._id}></button>
                                <button className='drop' onClick={dropElement} value={row._id}></button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
        </>
    )
}