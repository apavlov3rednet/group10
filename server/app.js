//Подключаем нативный модуль
const http = require('http');

//Подключаем модуль файловой системы
const fs = require('fs');

const server = http.createServer(function(request, response) {

    if(request.url === 'http://group10/') {
        fs.readFile(`${__dirname}/index.html`, (err, content) => {
            if(!err) {
                response.setHeader('Content-Type', 'text/html');
                response.write(content);
            }
            else {
                console.log(err);
                response.statusCode = 500;
                response.write('Error 500');
            }

            response.end('end 1');
        });
    }
    else {
        response.write('Другая страница 1111');
        response.end('end 2');
    }

});

server.listen(80, "localhost", function() {
    console.log('Server start listener');
});
