// Dependencies
const http = require('http');

const url= require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
  
// Create the Server
var httpServer = http.createServer(function(req,res){
      // Get the url and parse it.
      var parsedUrl = url.parse(req.url, true);

      // Get the path from the url Example /foo.
      var path = parsedUrl.pathname;
      var trimmedPath = path.replace(/^\/+|\+$/g, '');
  
  
      //Get the query string as an object;
      var queryStringObject = parsedUrl.query;
  
      // Get the HTTP Method
      var method = req.method.toLocaleLowerCase();
  
      // Get the headers as an object
      var headers = req.headers;
  
      //Get the payload, if any
      var decoder = new StringDecoder('utf-8');//json decoding format.
      var buffer = '';
      req.on('data', function (data) {
          buffer += decoder.write(data);
      });
      req.on('end', function () {
          buffer += decoder.end();
  
          // Choose the handcler this requiest should go to. If one is not found go to the notFound handler.
          var choosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
  
          // Construct the data object to send to the handler
          var data = {
              'trimmedPath': trimmedPath,
              'queryStringObject': queryStringObject,
              'method': method,
              'headers': headers,
              'payload': buffer
          };
  
          //Route the request to the handler specified in the router
          choosenHandler(data, function (statusCode, payload) {
              // Use the status code called back by the hanlder, or the default 200
              statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
  
              // Use the payload called back by the handler, or default to an empty object
              payload = typeof (payload) == 'object' ? payload : {};
  
              // Convert the payload to a string
              var payloadString = JSON.stringify(payload);
  
              // Return the response
              res.setHeader('Content-Type', 'application/json');
              res.writeHead(statusCode);
              res.end(payloadString);
  
              // Log the request path.
              console.log('Returning this response: ', statusCode, payloadString);
          })
  
  
      });
});

// Start the HTTP Server
httpServer.listen(config.httpPort, function () {
    console.log(`The server is listening on port ${config.httpPort}`);
});

// Define Handlers
var handlers = {};

handlers.hello = function(data,callback){
    if(data.method === "post")
        callback(200,{"message": "Hello you have created your first API."});
    else handlers.methodNotAllowed(data,callback);
}

// Not found handler
handlers.notFound = function (data, callback) {
    callback(404);
};

// Method Not Allowed
handlers.methodNotAllowed = function(data,callback){
    callback(405);
}
// Define a request router
var router = {
    'hello': handlers.hello
}