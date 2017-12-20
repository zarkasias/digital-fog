var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4800;

var events = require('events');
var eventEmitter = new events.EventEmitter();

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.send('Hello World')
})

// eventEmitter.on('logging', function(message) {
//   io.emit('log_message', message);
// });


// Override console.log
// var originConsoleLog = console.log;
// console.log = function(data) {
//   eventEmitter.emit('logging', data);
//   originConsoleLog(data);
// };

http.listen(port, function(){
  console.log('listening on *:' + port);
});
