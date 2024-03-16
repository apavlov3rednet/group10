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

    const fetchTable = useCallback(async () => {
        setLoading(true);
        const response = await fetch(config.api+ nameTable +'/');
        let answer = await response.json();

        const data = {
            header: answer.schema,
            body: answer.data,
            sim: answer.sim
        }

        setTable(data);
        setLoading(false);
    }, [nameTable, onChange])

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

    function getContent(col, index, sim) {
        let value = col;

        if(col.ref) {
            value = sim[col.collectionName].filter(item => item._id === col._id)[0].TITLE;
        }

        return (
            <td key={index}>
                {value && value}
            </td>
        )
    }

    return (
        <table className='simple-table'>
            <thead>
                {!loading && getHeader(table.header)}
            </thead>

            <tbody>
                {
                    !loading && table.body.map((row) => (
                        <tr key={row._id}>
                            {Object.values(row).map((col, index )=> (
                                getContent(col, index, table.sim)
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
    )
}