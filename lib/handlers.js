const fs = require('fs');
const App = require('./app');
const Comments = require('./comments');
const {
  formatComment,
  parseQuery,
  STATUS_CODES,
  CONTENT_TYPES } = require('./utilities');
const config = require('../config.js');
const comments = require('../database/comments.json');

const commentList = new Comments(comments);
const STATIC_FOLDER = config.STATIC_FOLDER;
const DATABASE = config.DATA_STORE;

const serveGuestBook = function (req, res) {
  const path = `${STATIC_FOLDER}${req.url}`;
  let content = fs.readFileSync(path, 'utf8');
  const commentsTable = commentList.toString();
  content = content.replace('__comments__', commentsTable);
  const contentType = 'text/html';
  res.writeHead(STATUS_CODES.success, { 'Content-Type': contentType });
  res.end(content);
};

const saveAndServeComments = function (req, res) {
  const query = parseQuery(req.body);
  const decodedComment = formatComment(query);
  const date = new Date();
  decodedComment.date = `${date.toDateString()} ${date.toLocaleTimeString()}`;
  commentList.addComment(decodedComment);
  fs.writeFileSync(DATABASE, JSON.stringify(commentList.comments));
  const headers = {
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
  const [, extension] = filePath.match(/.*\.(.*)$/);
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
