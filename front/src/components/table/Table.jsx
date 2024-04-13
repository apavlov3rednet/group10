import { useCallback, useState, useEffect } from "react";
import config from "../../params/config.js";
import './style.css';


export default function Table({nameTable, onChange, query = ''}) {
    const [table, setTable] = useState({
        header: [],
        body: [],
        sim: {}
    });
    const [loading, setLoading] = useState(false);

    const fetchTable = useCallback(async () => {
        setLoading(true);
        const getRequest = window.location.search;
        console.log(getRequest);
        let urlRequest = config.api+ nameTable +'/';

        if(query != '') {
            urlRequest += '?q=' + query;
        }

        if(getRequest != '' && query == '') {
            urlRequest += getRequest;
        }

        await getFetch(urlRequest);
        setLoading(false);
    }, [nameTable, onChange, query])

    useEffect(
        () => {
            fetchTable()
        }, [fetchTable] 
    )

    async function getFetch(url) {
        const response = await fetch(url);
        let answer = await response.json();

        const data = {
            header: answer.schema,
            body: answer.data,
            sim: answer.sim
        }

        setTable(data);
    }

    async function setSort(event) {
        let th = event.target;
        let parent = th.closest('tr');
        let allTh = parent.querySelectorAll('th');
        let order = th.classList.contains('DESC') ? 'DESC' : 'ASC';
        let code = th.dataset.code;
        let url = config.api+ nameTable +'/?sort=' + code + '&order=' + order;

        th.classList.add(order);

        await getFetch(url);

        if(order === 'ASC') {
            th.classList.add('DESC');
            th.classList.remove('ASC');
        }
        else {
            th.classList.remove('DESC');
            th.classList.add('ASC');
        }

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
            let obHeader = schema[i];

            obHeader.code = i;

            if(i === '_id') {
                header.push({loc: 'ID'})
            }
            else {
                header.push(obHeader)
            }
        }

        header.push({});

        return (
            <tr>
                {
                    header.map((item, index) => (
                        <th key={index} 
                        className={item.sort ? 'sortable' : null}
                        data-code={item.code}
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

    return (
        <>
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