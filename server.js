const http = require('http');
const app = require('./handlers');

const main = () => {
  const port = 4000;
  const server = new http.Server(app.serve.bind(app));
  server.listen(port);
  server.on('error', err => console.error('server error', err));
  server.on('listening', () => console.warn('listening', server.address()));
};

main();
