const { Server } = require('net');
const Request = require('./lib/request.js');
const { findHandler } = require('./app.js');


const handleConnection = function (socket) {
  const remote = `${socket.remoteAddress}:${socket.remotePort}`;
  console.warn('new connection', remote);
  socket.setEncoding('utf8');
  socket.on('close', (hadError) => {
    console.warn(`${remote} closed ${hadError ? 'with error' : ''}`);
  });
  socket.on('end', () => console.warn(`${remote} ended`));
  socket.on('error', (err) => console.error('socket error', err));
  socket.on('data', (text) => {
    console.warn(`${remote} data:\n`);
    const req = Request.parse(text);
    const handler = findHandler(req);
    const res = handler(req);
    res.writeTo(socket);
  });
};

const main = () => {
  const server = new Server();
  const port = 4000;
  server.on('error', err => console.error('server error', err));
  server.on('connection', handleConnection);
  server.on('listening', () => console.warn('listening', server.address()));
  server.listen(port);
};

main();
