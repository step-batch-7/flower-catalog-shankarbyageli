module.exports = class Comments {
  constructor(comments) {
    this.comments = comments || [];
  }

  addComment(comment) {
    this.comments.unshift(comment);
  }

  toString() {
    let tableHTML = '';
    this.comments.forEach(commentDetails => {
      commentDetails.comment = commentDetails.comment.replace(/\r\n/g, '<br>');
      tableHTML += '<tr>';
      tableHTML += `<td> ${commentDetails.date} </td>`;
      tableHTML += `<td> ${commentDetails.username} </td>`;
      tableHTML += `<td> ${commentDetails.comment} </td>`;
      tableHTML += '</tr>';
    });
    return tableHTML;
  }
};
