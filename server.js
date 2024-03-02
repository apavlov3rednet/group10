import express, { urlencoded } from 'express';
import morgan from 'morgan';
import Fetch from './back/modules/Fetch/index.js';
import schema from './back/modules/Fetch/schema/index.js';

//const MongoClient = require('mongodb').MongoClient;

const app = express();

const PORT = 8000;

app.use(morgan(':method :url :status :res[content-lenght] - :response-time ms'));

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*'); //Указываем какому приложению мы разрешаем доступ к серверным запросам
    // SELECT * FROM table.name WHERE ID=1
    // robots.txt
    // Disallow: *
    res.setHeader('Access-Control-Allow-Method', 'GET, POST, DELETE'); // 'GET, POST'
    res.setHeader('Access-Control-Allow-Header', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true); //Разрешить все что указано выше и считать валидным
    next();
});

//Это если у нас клиент-сервер
//app.set('views', 'views');
//app.use(express.static('public'));

//GET request

app.get('/api/:CollectionName/', async (req, res) => { // http://localhost:8000/api/getListMenu/
    let mdb = new Fetch.MongoDB(req.params.CollectionName.toLowerCase()),
        result = {},
        filter = req.query.filter,
        select = [],
        limit = req.query.limit,
        skip = req.query.skip;

    result = await mdb.get(filter, select, limit, skip);
    res.end(JSON.stringify(result));
});

app.get('/api/:CollectionName/:id/', async (req, res) => {
    const collectionName = req.params.CollectionName.toLowerCase();
    const mdb = new Fetch.MongoDB(collectionName);
    mdb.remove(req.params.id);
    res.end('deleted');
});

app.get('/api/schema/get/:Schema/', async (req, res) => {
    let obSchema = await schema[req.params.Schema.toLowerCase()];
    res.end(JSON.stringify(obSchema));
});

const urlencodedParser = express.urlencoded({extended: false});

app.post('/api/:CollectionName/', urlencodedParser, async (req, res) => {
    const collectionName = req.params.CollectionName.toLowerCase();
    const mdb = new Fetch.MongoDB(collectionName);
    const Controll = new Fetch.Controll(collectionName);
    //const result = await mdb.set(Controll.preparePost(req.query));

    console.log(req); //todo: разберись что не так

    res.end(JSON.stringify({status: 'ok'}));
});



// app.get('/index.html', (req, res) => {
//     res.statusCode = 301;
//     res.redirect('/');
// });

// app.get('/:section/', async (req,res) => {
//     const title = req.params.section;
//     res.sendFile(createPath(req.params.section), {title});

//     let list = await mdb.get(req.params.section);
//     console.log(list);

// });

// app.get('/views/:section.html', (req, res) => {
//     const title = req.params.section;
//     res.sendFile(createPath(req.params.section), {title});
// });

// app.get('/:section/:page/', (req,res) => {
//     const title = req.params.section;
//     res.sendFile(createPath(req.params.section), {title});
// });

// //POST request
// app.post('/:section/', async (req,res) => { //request, response

//     let schema = require('./server/schema/' + req.params.section);
//     let data = controllSchema(req.body, schema);

//     let result = await mdb.set(req.params.section, data);    

//     if(result.insertedId instanceof ObjectId) {
//         res.redirect(req.url + '?success=Y');
//     }
//     else {
//         res.redirect(req.url + '?success=N');
//     }
    
// });


//Обработка ошибок, всегда вызываем самым последним
app.use((req, res) => {
    res
        .status(404)
        //.sendFile(createPath('404'));
});

app.listen(PORT, "localhost", function(error) {
    (error) ? console.log(error) : console.log('Server listen');
});