import React, { useEffect, useState } from 'react';
import Header from './components/header/Header';
import Table from './components/table/Table';

const serverAddr = 'http://localhost:8000/';
//const PORT = 3000;

function App() {
  const [data, setData] = useState(null);

  useEffect(
    () => {
      fetch(serverAddr) //pending
      .then(response => response.json())
      .then(
        (response) => { //response
          //setData(<Table data={response} />);
        },
        (error) => { //rejected
          console.error(error);
        }
      )
    }
  )

  return (
    <div className="App">
      <Header />

      { data }
    </div>
  );
}

export default App;
