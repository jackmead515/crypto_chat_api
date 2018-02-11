global.__basedir = __dirname;

const DBManager = require('./db/DBManager');
global.DBManager = new DBManager();

const express = require('express');
const bodyParser = require('body-parser');
const statusMonitor = require('express-status-monitor');
const http = require('http');
const socketio = require('socket.io');
const services = require('./services/services');
const io_services = require('./services/io_services');

var app = express();
var server = http.createServer(app);
var io = socketio(server);

//############# MIDDLEWARE
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(statusMonitor());
//########################

//############### SERVICES
app.use('/api/rooms/', services.rooms);

io.on('connection', (socket) => {
  socket.on('check', (p, c) => io_services.check(socket, io, p, c));
  socket.on('join', (p, c) => io_services.join(socket, io, p, c));
  socket.on('message', (p, c) => io_services.message(socket, io, p, c));
  socket.on('disconnect', (p, c) => io_services.disconnect(socket, io, p, c));
});
//########################

var port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log("\n\n----------- crypto_chat_api booted -----------\n\n")
});
