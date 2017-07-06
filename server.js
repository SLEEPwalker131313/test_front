/**
 * Created by SNSukhanov on 03.07.2017.
 */

let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let methodOverride = require('method-override');

let config = require('./server.config');

//let port = process.env.PORT || 3000;
//let staticdir = process.env.NODE_ENV === 'production' ? 'dist.prod' : 'dist.dev';
let staticdir = config.directory;
let port = config.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.static(__dirname + '/' + staticdir));

app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/' + staticdir + '/index.html');
});

// start app ===============================================
app.listen(port, function () {
  console.log('Starting server on port http://localhost:' + port);
});

exports = module.exports = app;