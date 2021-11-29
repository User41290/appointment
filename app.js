var app     = require('express')();
var express = require('express');
var server  = require('http').Server(app);
const bodyParser 	= require("body-parser");
var config 	= require("./config");

var _api 			= require("./routes/api");
var config_api   	= require("./routes/config");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use('/scripts', express.static(__dirname));
app.use('/public', express.static(__dirname+ '/public/'));
app.use('/api', _api);
app.use('/config', config_api);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

server.listen(config.port);