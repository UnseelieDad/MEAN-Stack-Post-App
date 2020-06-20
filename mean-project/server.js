// Import http functionality
const http = require('http');

const server = http.createServer((req, res) => {
    res.end('This is my first response!');
});

// Listen on provider host port or 3000 if that isn't set
server.listen(process.env.PORT || 3000);