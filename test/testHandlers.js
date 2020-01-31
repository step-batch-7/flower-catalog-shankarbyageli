const fs = require('fs');
const sinon = require('sinon');
const request = require('supertest');
const app = require('../lib/handlers.js');
const { STATUS_CODES } = require('../lib/utilities.js');

const readFake = sinon.fake.returns('Hello');
const writeFake = sinon.fake();
sinon.replace(fs, 'readFileSync', readFake);
sinon.replace(fs, 'writeFileSync', writeFake);

after(() => {
  sinon.restore();
});

describe('GET /', function () {
  it('responds with homePage', function (done) {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', 'text/html')
      .expect('Hello')
      .expect(STATUS_CODES.success, done);
  });
});

describe('GET /staticPage', function () {
  it('responds with static html page', function (done) {
    request(app.serve.bind(app))
      .get('/html/Ageratum.html')
      .set('Accept', 'text/html')
      .expect('Hello')
      .expect(STATUS_CODES.success, done);
  });
});

describe('GET /badRequest', function () {
  it('responds 404 not found', function (done) {
    request(app.serve.bind(app))
      .get('/badRequest')
      .expect('Not Found')
      .expect(STATUS_CODES.notFound, done);
  });
});

describe('PUT /url', function () {
  it('responds with 400 method not allowed', function (done) {
    request(app.serve.bind(app))
      .put('/html/Ageratum.html')
      .expect(STATUS_CODES.notAllowed, done);
  });
});

describe('POST comments', function () {
  it('responds with 301 redirection', function (done) {
    request(app.serve.bind(app))
      .post('/html/guestBook.html')
      .send('username=sharad&comment=nice bro')
      .expect(STATUS_CODES.redirect, done);
  });
});

describe('GET comments', function () {
  it('responds with comments guestBook page', function (done) {
    request(app.serve.bind(app))
      .get('/html/guestBook.html')
      .set('Accept', 'text/html')
      .expect('Hello')
      .expect(STATUS_CODES.success, done);
  });
});
