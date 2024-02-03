const express = require('express');
const morgan = require('morgan');
const path = require('path');
const MongoDB = require('./server/mongodb');

const app = express();

const PORT = 8090;

const createPath = (page) => path.resolve(__dirname, 'views', `${page}.html`);

app.use(morgan(':method :url :status :res[content-lenght] - :response-time ms'));

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

app.get('/:section/', (req,res) => {
    const title = req.params.section;
    res.sendFile(createPath(req.params.section), {title});
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
app.post('/:section/', (req,res) => { //request, response
    const title = req.params.section;

    console.log(req.body);

    res.sendFile(createPath(req.params.section), {title});
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