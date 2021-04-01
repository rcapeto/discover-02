const express = require('express');
const routes = require('./routes');
const server = express();

server.set('view engine', 'ejs');

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