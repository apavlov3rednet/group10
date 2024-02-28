import Header from './components/header/Header';
import Table from './components/table/Table';

//const PORT = 3000;

function App() {
  // const [loading, setLoading] = useState(false);
  // const [data, setData] = useState({
  //   menu: [],
  //   table: []
  // });

  // const serverResponse = useCallback(async () => {
  //   setLoading(true);
  //   // const response = await fetch(serverAddr);
  //   // const srData = await response.json();
  //   const dataResult = await FetchRequst.get();

  //   setData(dataResult);
  //   setLoading(false);
  // }, []);

  // useEffect(
  //   (prev) => {
  //     serverResponse(prev);
  //   }, [serverResponse]
  // )

  return (
    <div className="App">
      <Header />
      
      <Table nameTable='Brands'/>
    </div>
  );
}

export default App;
