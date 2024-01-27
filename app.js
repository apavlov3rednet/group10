//Подключаем нативный модуль
const http = require('http');

//Подключаем модуль файловой системы
const fs = require('fs');
const path = require('path');
const express = require('express');

const PORT = 8084;

const server = http.createServer(function(req, res) { //req - request, res - response
    console.log('Server request');
    console.log(req.url, req.method);

    res.setHeader('Content-Type', 'text/html');

    // res.write('<h1>Header</h1>');

    // res.setHeader('Content-Type', 'application/json');

    // const data = JSON.stringify([
    //     {name: "Tomy", age: 35},
    //     {name: "Boby", age: 100}
    // ]);

    // res.write(data);

    //mechanism
    const createPath = (page) => path.resolve(__dirname, 'views', `${page}.tmpl`);

    let basePath = '';

    switch(req.url) {
        case '/':
            basePath = 'index.html';
        break;

        case '/index.html':
            res.statusCode = 301; //Контролируемый редирект
            res.setHeader('Location', '/');
        break;

        case '/brands/':
            basePath = createPath('brands');
        break;

        case '/brands/':
            basePath = createPath('brands');
        break;

        case '/cards/':
            basePath = createPath('cards');
        break;

        case '/models/':
            basePath = createPath('models');
        break;

        case '/owners/':
            basePath = createPath('owners');
        break;

        case '/services/':
            basePath = createPath('services');
        break;

        default:
            basePath = createPath('404');
            res.statusCode = 404;
        break;
    }

    if(basePath != '') {
        fs.readFile(basePath, (err, data) => {
            if(err) {
                console.log(err);
                res.statusCode = 500;
                res.end();
            }
            else {
                res.write('<meta charset="UTF-8">');
                res.write(data);
                res.end();
            }
        });
    }
    else {
        res.end();
    }

});

server.listen(PORT, "localhost", function(err) {
    (err) ? console.log(err) : console.log('Server listen');
});
