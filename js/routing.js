class Routing
{
    constructor() {
        this.dirViews = '/views/';
        this.arRoutes = {};
        this.ext = '.tmpl';
        this.error404 = '404';
    }

    /**
     * 
     * @param {*} url important
     * @param {method = GET*|POST, type = sync*|async, responseType = '', headers = [], data = {}} params options
     */
    static ajax(url, params = {}) {
       //Старт события XHR - XML HTTP Response
       let xhr = new XMLHttpRequest();

       //Определить метод запроса и его тип
       let method = params.method || 'GET';
       let type = params.type === 'async';

       xhr.open(method, url, type);

       //Тип возвращаемых данных
       if(type) {
        /**
         * text === ''
         * arraybuffer
         * blob
         * document - xml, yml, XPath
         * json
         */
        xhr.responseType = (params.responseType) ? params.responseType : '';
       }
       
       //Загаловки
       if(params.headers && params.headers instanceof Array) {
        params.headers.forEach((item, index) => xhr.setRequestHeader(index, item));
        //xhr.setRequestHeader('Content-Type', 'applictaion/json');
       }

       //Отправка запроса
       if(params.data && Object.keys(params.data).length > 0) {
        xhr.send(params.data);
       }
       else {
        xhr.send();
       }

       //Прогресс выполнения запроса
       xhr.onprogress = function(event) {
        console.log(event);
       }

       //Результат обращения к серверу
       xhr.onload = function() {
        /**
         * 100 - 120 - ошибки которые происходят на стороне физического сервера
         * 200 - 226 - положительные ответы, 203 - положительным ответом, но которому нельзя доверять
         * 300 - 308 - редиректы, 304 - файл был не изменен относительно последнего запроса
         * 400 - 499 - ошибки клиента, приложения
         * 500 - 526 - ошибки сервера или его запреты
         */
        if(xhr.status >= 200 && xhr.status < 300) {
            console.log(xhr.response);
        }
        else {
            console.error(`${url} Error ${xhr.status}: ${xhr.statusText}`); // Error 404: Not found
        }
       }
       
       //Отлов ошибок
       xhr.onerror = function(event) {
        console.error(event);
       }
    }

    treeRoutes(menu = []) {
        menu.forEach((item, index) => {
            this.arRoutes[index] = {
                name: item.innerText,
                request: this.dirViews + item.dataset.route + this.ext,
                url: '/' + item.dataset.route + '/'
            }
        });

        this.arRoutes['error'] = {
            name: '404',
            request: this.dirViews + this.error404 + this.ext,
            url: '/404/'
        } 
    }

    getContent(id) {
        let url = this.arRoutes[id].request || 'error';

        if(url === 'error') {
            Routing.ajax(this.arRoutes.error)
        }
        else {
            Routing.ajax(url, {
                method: "POST",
                type: 'async',
                headers: {
                    'Access-Control-Allow-Origin' : '*',
                    'Access-Control-Allow-Methods' : '*'
                }
            });
        }
    }
}

