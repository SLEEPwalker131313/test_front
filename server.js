/**
 * Created by SNSukhanov on 03.07.2017.
 */

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/client/dist.dev'));

app.get('/', function (req, res) {
  res.send(null);
});

var server = app.listen(1234, function () {
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', 'localhost', port);

});