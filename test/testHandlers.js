const request = require('supertest');
const app = require('../lib/handlers.js');

describe('GET /', function () {
  it('responds with homePage', function (done) {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', 'text/html')
      .expect(/Flower Catalog/)
      .expect(200, done);
  });
});

describe('GET /staticPage', function () {
  it('responds with static html page', function (done) {
    request(app.serve.bind(app))
      .get('/html/Ageratum.html')
      .set('Accept', 'text/html')
      .expect(/Ageratum/)
      .expect(200, done);
  });
});

describe('GET /badRequest', function () {
  it('responds 404 not found', function (done) {
    request(app.serve.bind(app))
      .get('/badRequest')
      .expect('Not Found')
      .expect(404, done);
  });
});

describe('PUT /url', function () {
  it('responds with 400 method not allowed', function (done) {
    request(app.serve.bind(app))
      .put('/html/Ageratum.html')
      .expect(/not allowed/i)
      .expect(400, done);
  });
});

describe('POST comments', function () {
  it('responds with 301 redirection', function (done) {
    request(app.serve.bind(app))
      .post('/html/guestBook.html')
      .send('username=sharad&comment=nice bro')
      .expect(301, done);
  });
});

describe('GET comments', function () {
  it('responds with comments guestBook page', function (done) {
    request(app.serve.bind(app))
      .get('/html/guestBook.html')
      .set('Accept', 'text/html')
      .expect(200, done);
  });
});