const fs = require('fs');
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
  let comments = fs.readFileSync('./database/comments.json', 'utf8');
  comments = JSON.parse(comments);
  if (req.method === 'POST') {
    const decodedComment = formatComment(req.body);
    const date = new Date();
    decodedComment.date = `${date.toDateString()} ${date.toLocaleTimeString()}`
    comments.unshift(decodedComment);
    fs.writeFileSync('./comments.json', JSON.stringify(comments));
  }
  const commentsTable = createTable(comments);
  let content = fs.readFileSync('./public/html/guestBook.html', 'utf8');
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
  if (req.method === 'GET' && req.url === '/' || req.url === '/index.html') {
    req.url = '/html/index.html';
    return serveStaticFile;
  }
  if (req.url === '/html/guestBook.html') {
    return serveGuestBook;
  }
  if (req.method === 'GET') {
    return serveStaticFile;
  }
  return () => new Response();
};

module.exports = { findHandler };