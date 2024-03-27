import { useCallback, useState, useEffect } from "react";
import config from "../../params/config.js";


export default function Index() {
    const [table, setTable] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchTable = useCallback(async () => {
        setLoading(true);
        const response = await fetch(config.api+ 'get/collections/');
        // let answer = await response.json();
        // setTable(data);
        // setLoading(false);
    }, [])

    useEffect(
        () => {
            fetchTable()
        }, [fetchTable] 
    )

    return (
        <div>
            <h1>Главная</h1>
        </div>
    )
}