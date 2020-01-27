const Response = require('./response');

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

const getResponseObject = function (content, contentType) {
  const res = new Response();
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', content.length);
  res.statusCode = 200;
  res.body = content;
  return res;
};

const formatComment = function (comment) {
  const formatted = comment;
  formatted.username = formatted.username.replace(/\+/g, ' ');
  formatted.username = decodeURIComponent(formatted.username);
  formatted.comment = formatted.comment.replace(/\+/g, ' ');
  formatted.comment = decodeURIComponent(formatted.comment);
  return formatted;
};

module.exports = { createTable, formatComment, getResponseObject };
