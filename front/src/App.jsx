import React, { useCallback, useEffect, useState } from 'react';
import Header from './components/header/Header';
import FetchRequst from './modules/Fetch';

//const PORT = 3000;

function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    menu: [],
    table: []
  });

  const serverResponse = useCallback(async () => {
    setLoading(true);
    // const response = await fetch(serverAddr);
    // const srData = await response.json();
    const dataResult = await FetchRequst.get();

    setData(dataResult);
    setLoading(false);
  }, []);

  useEffect(
    (prev) => {
      serverResponse(prev);
    }, [serverResponse]
  )

  return (
    <div className="App">
      <Header menu= {data.menu}/>

      <container>
        {/* <Form name={data.name} />
        <Table name={data.name} /> */}
      </container>

      <table>
        <thead></thead>
          {loading && <tr><td>Loading....</td></tr>}
          
          {!loading && (
              <tbody>
                {
                  data.table.map(e => (
                    <tr key={ e._id }>
                      <td>{ e.TITLE }</td>
                    </tr>
                  ))
                }
              </tbody>
            )
          }
          <tfoot></tfoot>
      </table>
      
    </div>
  );
}

export default App;
