const EventEmitter = require('events');

// const emitter = new EventEmitter();

// const log = (msg) => {
//     console.log(msg);
//     emitter.emit('some_events', {id: 3, key: "log"});
// }

// module.exports = log;

class Logger extends EventEmitter {
    log = (msg) => {
        let _this = this;
        setTimeout(function() {
            _this.emit('some_events', {id: 100, key: 'class'});
        }, 2000);
        console.log(msg);
    }
}

const userName = 'Толя';

module.exports = {Logger, userName};