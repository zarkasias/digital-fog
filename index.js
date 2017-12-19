var express = require('express');

var app = express();

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.send('Hello World')
})

var port = process.env.PORT || 4800;
app.listen(port);
