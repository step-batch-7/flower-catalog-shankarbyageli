const fs = require('fs');
const {
  formatComment,
  createTable,
  parseQuery } = require('./lib/utilities');

const STATIC_FOLDER = `${__dirname}/public`;
const DATABASE = `${__dirname}/database/comments.json`;
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
  const path = `${STATIC_FOLDER}${req.url}`;
  let comments = fs.readFileSync(DATABASE, 'utf8');
  comments = JSON.parse(comments);
  const commentsTable = createTable(comments);
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace('__comments__', commentsTable);
  const contentType = 'text/html';
  return { content, contentType };
};

const saveAndServeComments = function (req, data) {
  let comments = fs.readFileSync(DATABASE, 'utf8');
  comments = JSON.parse(comments);
  const query = parseQuery(data);
  const decodedComment = formatComment(query);
  const date = new Date();
  decodedComment.date = `${date.toDateString()} ${date.toLocaleTimeString()}`
  comments.unshift(decodedComment);
  fs.writeFileSync(DATABASE, JSON.stringify(comments));
  return serveGuestBook(req);
};

const serveStaticFile = (req) => {
  let path = req.url;
  if (path === '/' || path === '/index.html') {
    path = '/html/index.html';
  }
  const filePath = `${STATIC_FOLDER}${path}`;
  const stat = fs.existsSync(filePath) && fs.statSync(filePath);
  if (!stat || !stat.isFile()) {
    return {};
  }
  const [, extension] = filePath.match(/.*\.(.*)$/) || [];
  const contentType = CONTENT_TYPES[extension];
  const content = fs.readFileSync(filePath);
  return { content, contentType };
};

const defaultResponse = () => {
  return {};
};

const getHandlers = {
  '/html/guestBook.html': serveGuestBook
};

const postHandlers = {
  '/html/guestBook.html': saveAndServeComments
};

const findHandler = (req) => {
  if (req.method === 'GET') {
    return getHandlers[req.url] || serveStaticFile;
  }
  if (req.method === 'POST') {
    return postHandlers[req.url];
  }
  return defaultResponse;
};

const getResponse = function (req, data) {
  const handler = findHandler(req);
  let status = 200;
  let { content, contentType } = handler(req, data);
  if (content === undefined) status = 404;
  const headers = { 'Content-Type': contentType };
  return { status, content, headers };
};

module.exports = { getResponse };
