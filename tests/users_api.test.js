const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

const helper = require('./test_helper');

beforeEach(async () => {
  await helper.createTestUsers();
  await helper.createProfiles();
  await helper.createPosts();
});

afterAll(() => {
  mongoose.connection.close();
});

describe('POST /api/users', () => {
  test('fails if name is empty', async () => {
    await request(app)
      .post('/api/users')
      .send({ email: 'test10@mail.com', password: '123456' })
      .expect(400);
  });
  test('fails if password is empty', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'Test10', password: '123456' })
      .expect(400);
  });
  test('fails if password is to short', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'Test10', email: 'test10@mail.com', password: '12345' })
      .expect(400);
  });
  test('fails if user already exists', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'Test0', email: 'test0@mail.com', password: '123456' })
      .expect(400);
  });
  test('returns a jwt token if success', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Test10', email: 'test10@mail.com', password: '123456' })
      .expect(200);
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
  });
});
