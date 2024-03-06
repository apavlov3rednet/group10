export default params = {
    url: 'localhost',
    clientPort: '3000',
    backPort: '8000',
    client: 'http://' + this.url + ':' + this.clientPort + '/',
    server: 'http://' + this.url + ':' + this.backPort + '/'
}