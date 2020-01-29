const STATUS_CODES = {
  'success': 200,
  'redirect': 301,
  'notFound': 404,
  'notAllowed': 400
};

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

const createTable = function (comments) {
  let tableHTML = '';
  comments.forEach(commentDetails => {
    commentDetails.comment = commentDetails.comment.replace(/\r\n/g, '<br>');
    tableHTML += '<tr>';
    tableHTML += `<td> ${commentDetails.date} </td>`;
    tableHTML += `<td> ${commentDetails.username} </td>`;
    tableHTML += `<td> ${commentDetails.comment} </td>`;
    tableHTML += '</tr>';
  });
  return tableHTML;
};

const formatComment = function (comment) {
  const formatted = comment;
  formatted.username = formatted.username.replace(/\+/g, ' ');
  formatted.username = decodeURIComponent(formatted.username);
  formatted.comment = formatted.comment.replace(/\+/g, ' ');
  formatted.comment = decodeURIComponent(formatted.comment);
  return formatted;
};

const parseQuery = function (query) {
  const parsedQuery = {};
  const queries = query.split('&');
  queries.forEach(keyValuePair => {
    const [key, value] = keyValuePair.split('=');
    parsedQuery[key] = value;
  })
  return parsedQuery;
};

module.exports = { createTable, formatComment, parseQuery, STATUS_CODES, CONTENT_TYPES };
