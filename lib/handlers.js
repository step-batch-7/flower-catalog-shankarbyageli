const fs = require('fs');
const App = require('./app');
const {
  formatComment,
  createTable,
  parseQuery,
  STATUS_CODES,
  CONTENT_TYPES } = require('./utilities');
const config = require('../config.json');

const STATIC_FOLDER = config.STATIC_FOLDER;
const DATABASE = config.DATASTORE_PATH;

const serveGuestBook = function (req, res) {
  const path = `${STATIC_FOLDER}${req.url}`;
  let comments = fs.readFileSync(DATABASE, 'utf8');
  comments = JSON.parse(comments);
  const commentsTable = createTable(comments);
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace('__comments__', commentsTable);
  const contentType = 'text/html';
  res.writeHead(STATUS_CODES.success, { 'Content-Type': contentType });
  res.end(content);
};

const saveAndServeComments = function (req, res) {
  let comments = fs.readFileSync(DATABASE, 'utf8');
  comments = JSON.parse(comments);
  const query = parseQuery(req.body);
  const decodedComment = formatComment(query);
  const date = new Date();
  decodedComment.date = `${date.toDateString()} ${date.toLocaleTimeString()}`;
  comments.unshift(decodedComment);
  fs.writeFileSync(DATABASE, JSON.stringify(comments));
  const headers = {
    'Content-Type': 'text/plain',
    'Location': '/html/guestBook.html'
  };
  res.writeHead(STATUS_CODES.redirect, headers);
  res.end();
};

const serveStaticFile = function (req, res, next) {
  let path = req.url;
  if (path === '/') {
    path = '/html/index.html';
  }
  const filePath = `${STATIC_FOLDER}${path}`;
  const stat = fs.existsSync(filePath) && fs.statSync(filePath);
  if (!stat || !stat.isFile()) {
    next();
    return;
  }
  const [, extension] = filePath.match(/.*\.(.*)$/) || [];
  const contentType = CONTENT_TYPES[extension];
  const content = fs.readFileSync(filePath);
  res.writeHead(STATUS_CODES.success, { 'Content-Type': contentType });
  res.end(content);
};

const parseBody = function (req, res, next) {
  let data = '';
  req.on('data', text => {
    data += text;
  });
  req.on('end', () => {
    req.body = data;
    next();
  });
};

const notFound = function (req, res) {
  res.writeHead(STATUS_CODES.notFound);
  res.end('Not Found');
};

const methodNotAllowed = function (req, res) {
  res.writeHead(STATUS_CODES.notAllowed);
  res.end('Method Not Allowed');
};

const app = new App();

app.use(parseBody);
app.get('/html/guestBook.html', serveGuestBook);
app.post('/html/guestBook.html', saveAndServeComments);
app.get('', serveStaticFile);
app.get('', notFound);
app.use(methodNotAllowed);

module.exports = app;
