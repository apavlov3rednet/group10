const express = require('express');
const morgan = require('morgan');
const path = require('path');
const MongoDB = require('./server/mongodb');
const { ObjectId } = require('mongodb');
const controllSchema = require('./server/schema');
const { nextTick } = require('process');

//const MongoClient = require('mongodb').MongoClient;

const app = express();
const mdb = new MongoDB();

const PORT = 8090;

mdb.Init();

// let c = mdb.count('brands');
// console.log(c);

// const client = new MongoClient('mongodb://localhost:27017/');

// client.connect().then(mongoClient => {
//     console.log('DB start connect');
//     console.log(mongoClient.options.dbName);
//     const db = mongoClient.db('group10');
//     const collection = db.collection('brands');
//     console.log(collection);
// });


const createPath = (page) => path.resolve(__dirname, 'views', `${page}.html`);

app.use(morgan(':method :url :status :res[content-lenght] - :response-time ms'));

/*
app.use((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //Указываем какому приложению мы разрешаем доступ к серверным запросам
    // SELECT * FROM table.name WHERE ID=1
    // robots.txt
    // Disallow: *
    res.setHeader('Access-Control-Allow-Method', 'GET'); // 'GET, POST'
    res.setHeader('Access-Control-Allow-Header', 'X-Requestes-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true); //Разрешить все что указано выше и считать валидным
    nextTick();
});
*/

app.set('views', 'views');

app.use(express.urlencoded({extended : true})); //возвращает корректные url и их методы

app.use(express.static('public'));

//GET request
app.get('/', (req, res) => {
    const title = 'Index';
    res.sendFile(createPath('index'), {title});
});

app.get('/index.html', (req, res) => {
    res.statusCode = 301;
    res.redirect('/');
});

app.get('/:section/', async (req,res) => {
    const title = req.params.section;
    res.sendFile(createPath(req.params.section), {title});

    let list = await mdb.get(req.params.section);
    console.log(list);

});

app.get('/views/:section.html', (req, res) => {
    const title = req.params.section;
    res.sendFile(createPath(req.params.section), {title});
});

app.get('/:section/:page/', (req,res) => {
    const title = req.params.section;
    res.sendFile(createPath(req.params.section), {title});
});

//POST request
app.post('/:section/', async (req,res) => { //request, response

    let schema = require('./server/schema/' + req.params.section);
    let data = controllSchema(req.body, schema);

    let result = await mdb.set(req.params.section, data);    

    if(result.insertedId instanceof ObjectId) {
        res.redirect(req.url + '?success=Y');
    }
    else {
        res.redirect(req.url + '?success=N');
    }
    
});

//Обработка ошибок, всегда вызываем самым последним
app.use((req, res) => {
    res
        .status(404)
        .sendFile(createPath('404'));
});

app.listen(PORT, "localhost", function(error) {
    (error) ? console.log(error) : console.log('Server listen');
});