import { useCallback, useState, useEffect } from "react";
import './style.css';


export default function Table({nameTable}) {
    const [table, setTable] = useState({
        header: [],
        body: []
    });
    const [loading, setLoading] = useState(false);

    const fetchTable = useCallback(async () => {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/'+ nameTable +'/');
        let answer = await response.json();

        const data = {
            header: answer.schema,
            body: answer.data
        }

        setTable(data);
        setLoading(false);
    }, [nameTable])

    useEffect(
        () => {
            fetchTable()
        }, [fetchTable] 
    )

    function setSort(key) {
        console.log(key)
    }

    function toggleEdit(event) {
        console.log(event);
    }

    async function dropElement(key) {
        const url ='http://localhost:8000/api/'+ nameTable +'/' + key.target.value + '/';
        const c = window.confirm('Уверены?');
        if(c) {
            const response = await fetch(url);
            let answer = response.status;

            if(answer === 200) {
                fetchTable();
            }
        }
    }

    function getHeader(schema) {
        let header = [];
        for(let i in schema) {
            if(i === '_id') {
                header.push('ID')
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
                                <td key={index}>{col}</td>
                            ))}
                            <td>
                                <button className='edit' onClick={toggleEdit} value={row._id}></button>
                                <button className='drop' onClick={dropElement} value={row._id}></button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}