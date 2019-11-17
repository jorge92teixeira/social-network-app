const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

const User = require('../models/User');

let token;

async function createTestUser() {
  await User.deleteMany({});
  const response = await request(app)
    .post('/api/users')
    .send({
      name: 'Teste',
      email: 'test@test.com',
      password: '123456',
    });
  token = response.body.token;
}

beforeAll(async () => {
  await createTestUser();
});

describe('When trying to get current user profile', () => {
  test('fails if user is not authenticated', async () => {
    await request(app)
      .get('/api/profile/me')
      .expect(401);
  });

  test('fails if there i no profile for the user', async () => {
    const response = await request(app)
      .get('/api/profile/me')
      .set('x-auth-token', token)
      .expect(400);
    expect(response.body.msg).toBe('There is no profile for this user');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
