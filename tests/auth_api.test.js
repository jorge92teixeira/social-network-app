const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

const helper = require('./test_helper');

let tokens;

beforeEach(async () => {
  tokens = await helper.createTestUsers();
  await helper.createProfiles();
  await helper.createPosts();
});

afterAll(() => {
  mongoose.connection.close();
});


describe('GET /social-network/api/auth', () => {
  test('fails if user is not authenticated', async () => {
    await request(app)
      .get('/social-network/api/auth')
      .expect(401);
  });
  test('if succeeds returns user object', async () => {
    const response = await request(app)
      .get('/social-network/api/auth')
      .set('x-auth-token', tokens[0])
      .expect(200);
    expect(response.body).toHaveProperty('name', 'email', 'avatar', 'date');
    expect(response.body).not.toHaveProperty('password');
  });
});

describe('POST /social-network/api/auth', () => {
  test('fails if email is empty', async () => {
    const response = await request(app)
      .post('/social-network/api/auth')
      .send({ password: '123456' })
      .expect(400);
    expect(response.body.errors[0].msg).toBe('Please include a valid email');
  });
  test('fails if password is empty', async () => {
    const response = await request(app)
      .post('/social-network/api/auth')
      .send({ email: 'test0@mail.com' })
      .expect(400);
    expect(response.body.errors[0].msg).toBe('Password is required');
  });
  test('fails if user does not exist', async () => {
    const response = await request(app)
      .post('/social-network/api/auth')
      .send({ email: 'test4@mail.com', password: '123456' })
      .expect(400);
    expect(response.body.errors[0].msg).toBe('Invalid credentials');
  });
  test('fails if user does exist but password is wrong', async () => {
    const response = await request(app)
      .post('/social-network/api/auth')
      .send({ email: 'test0@mail.com', password: '654321' })
      .expect(400);
    expect(response.body.errors[0].msg).toBe('Invalid credentials');
  });
  test('if success return token', async () => {
    const response = await request(app)
      .post('/social-network/api/auth')
      .send({ email: 'test0@mail.com', password: '123456' })
      .expect(200);
    expect(typeof response.body.token).toBe('string');
    expect(response.body.token).toEqual(tokens[0]);
  });
});
