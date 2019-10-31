const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

const User = require('../models/User');

beforeEach(async () => {
  await User.deleteMany({});
  await new User({
    name: 'joao',
    email: 'joao@mail.com',
    password: '123456',
  }).save();
});

describe('When signin up a user', () => {
  test('fails if name is empty', async () => {
    await request(app)
      .post('/api/users')
      .send({ email: 'jorge@mail.com', password: '123456' })
      .expect(400);
  });
  test('fails if password is empty', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'jorge', password: '123456' })
      .expect(400);
  });
  test('fails if password is to short', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'jorge', email: 'jorge@mail.com', password: '12345' })
      .expect(400);
  });
  test('fails if user already exists', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'joao', email: 'joao@mail.com', password: '123456' })
      .expect(400);
  });
  test('returns a jwt token if success', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'jorge', email: 'jorge@mail.com', password: '123456' })
      .expect(200);
    expect(typeof response.body.token).toBe('string');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
