import { useCallback, useState, useEffect } from "react"
import FetchRequst from "../../modules/Fetch";

export default function Menu() {
    const [data, setData] = useState([]);

    const sResponse = useCallback(async () => {
        const dr = await FetchRequst.get({ menu: 'y' });
        setData(dr);
    }, []);

    useEffect(
        (prev) => {
            sResponse(prev);
            console.log(data);
        }, [sResponse]
      )

    return (
        <menu>
            {
                data.map((el,i) => (
                   <li key={i}> { el.NAME } </li>
                ))
            }
        </menu>
    )
}