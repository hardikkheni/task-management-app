const request = require('supertest');
const path = require('path');

require('dotenv').config({
  path: path.resolve(process.cwd(), `.env`),
});

const app = require('../src/app');
const { connect } = require('../src/db');
const mongoose = require('mongoose');

//Note: this is for demo only use testing user
const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTI3YTgwNTg1ZDZlZGQyN2QxNzE3NjEiLCJmaXJzdE5hbWUiOiJIYXJkaWsiLCJsYXN0TmFtZSI6IktoZW5pIiwiZW1haWwiOiJoYXJkaWtraGVuaS53b3JrQGdtYWlsLmNvbSIsImF2YXRhciI6Imh0dHBzOi8vdWktYXZhdGFycy5jb20vYXBpLz9uYW1lPUhLJmJhY2tncm91bmQ9MDAwJmNvbG9yPWZmZiIsImNyZWF0ZWRfYXQiOiIyMDIzLTEwLTEyVDA4OjAyOjEzLjM5N1oiLCJ1cGRhdGVkX2F0IjoiMjAyMy0xMC0xMlQwODowMjoxMy4zOTdaIiwiaWQiOiI2NTI3YTgwNTg1ZDZlZGQyN2QxNzE3NjEiLCJpYXQiOjE2OTcxMDUxNTR9.xw_eOXvu5BJpQQuGwCQMuqYxA2ilkjvhNsoL1P5YwjE';

describe('Task module', () => {
  beforeEach(async () => {
    await connect();
  });

  /* Closing database connection after each test. */
  afterEach(async () => {
    await mongoose.connection.close();
  });
  test('should create a new task', (done) => {
    request(app)
      .post('/api/task')
      .send({ title: 'chores', description: '1000', status: 'Todo' })
      .set('Accept', 'application/json')
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  test('should get a list of tasks', (done) => {
    request(app)
      .get('/api/task')
      .set('Accept', 'application/json')
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  // test('should delete a task', (done) => {
  //   request(app)
  //     .delete('/api/task/6527cd493845e0ee6d308ed0')
  //     .set('Accept', 'application/json')
  //     .set({ Authorization: `Bearer ${accessToken}` })
  //     .expect('Content-Type', /json/)
  //     .expect(200, done);
  // });
});
