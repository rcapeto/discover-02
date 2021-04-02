const express = require('express');
const path = require('path');
const routes = require('./routes');
const server = express();

server.set('view engine', 'ejs');

server.set('views', path.join(__dirname, 'views'));

//request.body
server.use(express.urlencoded({ extended: true }));

server.use(express.static('public'));
server.use(routes);

const port = 8080;

server.listen(port, callbackServer(port));

function callbackServer(port) {
   return function() {
      console.log(`======Server is running port: ${port}======`);
   }
}