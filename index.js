var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var MongoClient = require('mongodb').MongoClient;
var Twitter = require('twitter');
var bodyParser = require('body-parser');
var port = process.env.PORT || 4800;

var events = require('events');
var eventEmitter = new events.EventEmitter();

//local database url
//var dburl = "mongodb://localhost:27017/dfog";

app.use(express.static('public'))
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Hello World')
});

//twitter config and data request
app.post('/twitterconfig', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  console.log('post twitter details');
  var body = req.body;
  //var tweets = [];
  if (body) {

    //initialize twitter client
    var client = new Twitter({
      consumer_key: body.consumer_key,
      consumer_secret: body.consumer_secret,
      access_token_key: body.access_token_key,
      access_token_secret: body.access_token_secret
    });

    if ((body.listToShow === '') || (body.listToShow.toUpperCase() === 'TIMELINE')) {
      var params = {
        screen_name: body.screenName,
        exclude_replies: true,
        include_rts: false
      };
      client.get('statuses/home_timeline', params, function(error, tweets, response) {
        if (!error) {
          res.send(tweets);
        } else {
          console.log(error);
        }
      });
    } else {
      var listparams = {
        screen_name: body.screenName
      };

      client.get('lists/list', listparams, function(error, lists, response) {
        if (!error) {
          var twitterlists = lists;
          for (var i = 0; i < twitterlists.length; i++) {
            if (twitterlists[i].name === body.listToShow) {
              var lparams = {
                slug: twitterlists[i].slug,
                owner_screen_name: body.screenName,
                include_rts: false
              };

              client.get('lists/statuses', lparams, function(error, tweets, response) {
                if (!error) {
                  res.send(tweets);
                } else {
                  console.log(error);
                }
              });
            }
          }
        } else {
          console.log(error);
        }
      });
    }


  }
});



// MongoClient.connect(dburl, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });

// eventEmitter.on('logging', function(message) {
//   io.emit('log_message', message);
// });


// Override console.log
// var originConsoleLog = console.log;
// console.log = function(data) {
//   eventEmitter.emit('logging', data);
//   originConsoleLog(data);
// };

http.listen(port, function() {
  console.log('listening on *:' + port);
});
