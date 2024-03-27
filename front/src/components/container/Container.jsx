import { useState, useCallback, useEffect } from "react";
import Form from "../form/Form.jsx";
import Table from "../table/Table.jsx";
import Index from "../index/Index.jsx";

export default function Container({ curPath }) 
{
    const [row, setRow] = useState({});
    const [collectName, setCollectionName] = useState(null);

    const handle = (value) => {
        if(value.data)
            setRow(value.data[0]);
    }

    const setCollection = useCallback(async () => {
        if(curPath !== 'index' && curPath !== '/')
            setCollectionName(curPath);
    });

    useEffect(
        () => {
            setCollection();
        }, [setCollection]
    );

    return (
        <div className="container">
            {collectName && <Form arValue={row} nameForm={collectName}></Form> }
            {collectName && <Table onChange={handle} nameTable={collectName}></Table>}

            {!collectName && <Index/>}
        </div>
    )
}