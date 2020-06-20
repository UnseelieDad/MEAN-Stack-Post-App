// Import http functionality
const http = require('http');
const app = require('./backend/app');
const port = process.env.PORT || 3000;

app.set('port', port);
const server = http.createServer(app);

// Listen on provider host port or 3000 if that isn't set
server.listen(port);