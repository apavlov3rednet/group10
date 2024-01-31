

/*
const EventEmitter = require('events');
const emitter = new EventEmitter();

const log = (msg) => {
    console.log(msg);
    emitter.emit('some_event', {id: 1, key 2});
}

*/

//step 2
const EventEmitter = require('events');
class Logger extends EventEmitter {
    log = (msg) => {
        console.log(msg);
        this.emit('some_event', {id: 1, key 2});
    }
}

module.exports = log;

//step2
module.exports = Logger;