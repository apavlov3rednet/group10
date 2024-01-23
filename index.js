//const EventEmitter = require('events');
//const emitter = new EventEmitter();

/*
emitter.on('some_event', (args) => {
    const {id, key} = args;
    console.log(id, key)
})

emitter.emit('some_event', {id: 1, key 2});
*/


//step 2
const log = require('.js/log');

log('test');

//step 3
const Logger = require('.js/log');
const logger = new Logger();

logger.on('some_event', (args) => {
    const {id, key} = args;
    console.log(id, text);
});
