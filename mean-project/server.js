// import the express app
const app = require('./backend/app');
// import http
const http = require('http');
const debug = require('debug')('node-angular');

// make sure recieved port is valid
const normalizePort = val => {
    var port = parseInt(val, 10);
    
    if (isNaN(port)) {
        // name
        return val;
    }
    
    if (port >= 0) {
        // port number
        return port
    }

    return false;
}

// Handle errors more gracefully
const onError = error => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    switch(error.code) {
        case "EACCESS":
            console.error(bind + " reqires elevated priileges");
            process.exit(1);
            break;

        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;

        default:
            throw error;
    }
};

// Log that the server is listening to incomming requests
const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
