const { Server } = require('net');
const fs = require('fs');
const Request = require('./lib/request.js');
const Response = require('./lib/response.js');

const STATIC_FOLDER = `${__dirname}/public`;
const CONTENT_TYPES = {
  txt: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  json: 'application/json',
  gif: 'image/gif'
};

const serveStaticFile = (req) => {
  const path = `${STATIC_FOLDER}${req.url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) return new Response();
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = CONTENT_TYPES[extension];
  const content = fs.readFileSync(path);
  const res = new Response();
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', content.length);
  res.statusCode = 200;
  res.body = content;
  return res;
};

const findHandler = (req) => {
  if (req.method === 'GET' && req.url === '/') {
    req.url = '/index.html';
    return serveStaticFile;
  }
  if (req.method === 'GET') return serveStaticFile;
  return () => new Response();
};

const handleConnection = function (socket) {
  const remote = `${socket.remoteAddress}:${socket.remotePort}`;
  console.warn('new connection', remote);
  socket.setEncoding('utf8');
  socket.on('close', (hadError) => console.warn(`${remote} closed ${hadError ? 'with error' : ''}`));
  socket.on('end', () => console.warn(`${remote} ended`));
  socket.on('error', (err) => console.error('socket error', err));
  socket.on('data', (text) => {
    console.warn(`${remote} data:\n`);
    const req = Request.parse(text);
    const handler = findHandler(req);
    const res = handler(req);
    res.writeTo(socket);
  });
}
const main = () => {
  const server = new Server();
  server.on('error', err => console.error('server error', err));
  server.on('connection', handleConnection);
  server.on('listening', () => console.warn('started listening', server.address()));
  server.listen(4000);
}
main();