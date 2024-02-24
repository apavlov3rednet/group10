import { useCallback, useState, useEffect } from "react";
import './style.css';


export default function Table({children, ...props}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTable = useCallback(async () => {
        setLoading(true);
        if(props.name) {
            const response = await fetch('http://localhost:8000/api/getList'+ props.name +'/');
            setData(await response.json());
            setLoading(false);
        }
        
        
    }, [])

    useEffect(
        () => {fetchTable()}, [fetchTable] 
    )


    return (
        <table className='simple-table'>
            <thead>
                <tr>
                    {
                        !loading && Object.keys(data[0]).map(head => (
                            <th>{head}</th>
                        ))
                    }
                </tr>
            </thead>

            <tbody>
                {
                    !loading && data.map((row) => (
                        <tr key={row._id}>
                            {Object.values(row).map(col => (
                                <td>{col}</td>
                            ))}
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}