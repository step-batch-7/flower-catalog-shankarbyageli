const http = require('http');
const { getResponse } = require('./app.js');

const main = () => {
  const server = http.createServer((req, res) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    })
    req.on('end', () => {
      const { status, content, headers } = getResponse(req, data);
      res.writeHead(status, headers);
      res.end(content);
    })
  }).listen(4000);

  server.on('error', err => console.error('server error', err));
  server.on('listening', () => console.warn('listening', server.address()));
};

main();
