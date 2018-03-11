const expect = require('expect');
const request = require('supertest');

const {populate_db, data} = require('./scripts/test-data.js');
const {app} = require('./server.js');

beforeEach((done) => {
  populate_db(done);
})

describe('GET /', () => {
  it('Should return all posts', (done) => {
    request(app)
      .get('/')
      .expect('hello world')
      .end(done);
    })
});

describe('GET /posts', () => {
  it('Should return all posts', (done) => {
    request(app)
      .get('/posts')
      .expect((res) => {
        expect(res.body.length).toBe(data.length);

        for (let i = 0; i < data.length; i++) {
          expect(res.body[i].text).toEqual(data[i].text);
          expect(res.body[i].name).toEqual(data[i].name);
          expect(res.body[i].comments.length).toBe(data[i].comments.length);
        }
      })
      .end(done);
    })
});