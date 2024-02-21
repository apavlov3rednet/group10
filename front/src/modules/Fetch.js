class FetchRequst {
    static serverAddr = 'http://localhost:8000/';

    static async get(params = {}) {
        let addr = FetchRequst.serverAddr;

        if(Object.keys(params).length > 0) {
            addr += '?';
            for(let i in params) {
                addr += i + '=' + params[i] + '&';
            }
        }

        const response = await fetch(addr);
        const data = await response.json();

        return data;
    }
}

module.exports = FetchRequst;