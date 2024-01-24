const EventEmitter = require('events');

const {Logger, userName} = require('./server/log');

// emitter.on('some_events', (arg) => {
//     const {id, key} = arg;
//     console.log(id, key);
// });

// log('Test log');
// emitter.emit('some_events', {id: 10, key: 'Test'});
// console.log('Console');

const logger = new Logger();

console.log('app.js');

logger.on('some_events', (arg) => {
         const {id, key} = arg;
         console.log(id, key);
}).log('Log.js ' + userName);