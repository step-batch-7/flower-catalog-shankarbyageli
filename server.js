const { Server } = require('net');
const fs = require('fs');
const Request = require('./lib/request.js');
const Response = require('./lib/response.js');
const {
  formatComment,
  createTable,
  getResponseObject } = require('./lib/utilities');

const STATIC_FOLDER = `${__dirname}/public`;
const CONTENT_TYPES = {
  txt: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  json: 'application/json',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  pdf: 'application/pdf'
};

const serveGuestBook = function (req) {
  let comments = fs.readFileSync('./comments.json', 'utf8');
  comments = JSON.parse(comments);
  if (req.method === 'POST') {
    const decodedComment = formatComment(req.body);
    decodedComment.date = new Date().toLocaleString();
    comments.unshift(decodedComment);
    fs.writeFileSync('./comments.json', JSON.stringify(comments));
  }
  const commentsTable = createTable(comments);
  let content = fs.readFileSync('./public/guestBook.html', 'utf8');
  content = content.replace('__comments__', commentsTable);
  return getResponseObject(content, 'text/html');
};

const serveStaticFile = (req) => {
  const path = `${STATIC_FOLDER}${req.url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) {
    return new Response();
  }
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = CONTENT_TYPES[extension];
  const content = fs.readFileSync(path);
  return getResponseObject(content, contentType);
};

const findHandler = (req) => {
  if (req.method === 'GET' && req.url === '/') {
    req.url = '/index.html';
    return serveStaticFile;
  }
  if (req.url === '/guestBook.html') {
    return serveGuestBook;
  }
  if (req.method === 'GET') {
    return serveStaticFile;
  }
  return () => new Response();
};

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
