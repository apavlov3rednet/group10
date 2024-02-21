import React, { useCallback, useEffect, useState } from 'react';
import Header from './components/header/Header';
import FetchRequst from './modules/Fetch';

const serverAddr = 'http://localhost:8000/';
//const PORT = 3000;

function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const serverResponse = useCallback(async () => {
    setLoading(true);
    // const response = await fetch(serverAddr);
    // const srData = await response.json();
    const dataResult = await FetchRequst.get({menu: 'y'});

    setData(dataResult);
    setLoading(false);
  }, []);

  useEffect(
    () => {
      serverResponse();
    }, [serverResponse]
  )

  return (
    <div className="App">
      <Header />
    </div>
  );
}

export default App;
