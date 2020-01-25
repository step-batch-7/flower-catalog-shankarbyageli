const Response = require('./response');

const createTable = function (comments) {
  let tableHTML = "";
  comments.forEach(comment => {
    tableHTML += "<tr>";
    tableHTML += `<td> ${comment.date} </td>`;
    tableHTML += `<td> ${comment.username} </td>`;
    tableHTML += `<td> ${comment.comment} </td>`;
    tableHTML += "</tr>";
  })
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
  formatted.comment = formatted.comment.replace(/\+/g, ' ');
  formatted.comment = formatted.comment.replace(/%0D%0A/g, '\n');
  return formatted;
};

module.exports = { createTable, formatComment, getResponseObject };