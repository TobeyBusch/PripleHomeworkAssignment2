// Define Handlers
let handlers = {};

handlers.hello = function (data, callback) {
    if (data.method === "post")
        callback(200, {"message": "Hello you have created your first API."});
    else handlers.methodNotAllowed(data, callback);
};

// Not found handler
handlers.notFound = function (data, callback) {
    callback(404);
};

// Method Not Allowed
handlers.methodNotAllowed = function (data, callback) {
    callback(405);
};


//Export the Module
module.exports = handlers;