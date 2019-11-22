const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

const User = require('../models/User');
const Profile = require('../models/Profile');

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

describe('GET /api/profile/me', () => {
  test('fails if user is not authenticated', async () => {
    await request(app)
      .get('/api/profile/me')
      .expect(401);
  });

  test('fails if there is no profile for the user', async () => {
    const response = await request(app)
      .get('/api/profile/me')
      .set('x-auth-token', tokens[2])
      .expect(400);
    expect(response.body.msg).toBe('There is no profile for this user');
  });

  test('if success, returns profile object', async () => {
    const response = await request(app)
      .get('/api/profile/me')
      .set('x-auth-token', tokens[0])
      .expect(200);
    expect(response.body).toHaveProperty('skills', 'status', 'user');
  });
});

describe('GET /api/profile', () => {
  test('returns all existing profiles', async () => {
    const response = await request(app)
      .get('/api/profile')
      .expect(200);
    expect(response.body.length).toBe(2);
  });
});

describe('POST /api/profile', () => {
  test('fails if user is not authenticated', async () => {
    await request(app)
      .get('/api/profile/me')
      .expect(401);
  });
  test('fails if status is empty', async () => {
    const response = await request(app)
      .post('/api/profile/')
      .set('x-auth-token', tokens[0])
      .send({
        skills: 'Javascript, Node',
        company: 'Microsoft',
        website: 'https://www.test.com',
      })
      .expect(400);
    expect(response.body.errors[0].msg).toBe('Status is required');
  });
  test('fails if skills is empty', async () => {
    const response = await request(app)
      .post('/api/profile/')
      .set('x-auth-token', tokens[0])
      .send({
        status: 'Developer',
        company: 'Microsoft',
        website: 'https://www.test.com',
      })
      .expect(400);
    expect(response.body.errors[0].msg).toBe('Skills is required');
  });
  test('if it succeeds returns profile object', async () => {
    const response = await request(app)
      .post('/api/profile/')
      .set('x-auth-token', tokens[0])
      .send({
        skills: 'javascript, node.js',
        status: 'Developer',
        company: 'Microsoft',
        website: 'https://www.test.com',
      })
      .expect(200);
    expect(response.body).toHaveProperty('skills', 'status', 'company', 'website');
  });
});

describe('GET /api/profile/user/:user_id', () => {
  test('fails if user does not have a profile', async () => {
    const { id } = await User.findOne({ email: 'test2@mail.com' });
    const response = await request(app)
      .get(`/api/profile/users/${id}`)
      .expect(400);
    expect(response.body.msg).toBe('Profile not found');
  });
  test('if it succedds returns profile for user id', async () => {
    const { id } = await User.findOne({ email: 'test0@mail.com' });
    const response = await request(app)
      .get(`/api/profile/users/${id}`)
      .expect(200);
    expect(response.body.user._id).toBe(id);
    expect(response.body).toHaveProperty('skills', 'status', 'company');
  });
});

describe('DELETE /api/profile', () => {
  test('fails if user is not authenticated', async () => {
    await request(app)
      .delete('/api/profile')
      .expect(401);
  });
  test('returns message User Deleted when successful ', async () => {
    const { id } = await User.findOne({ email: 'test0@mail.com' });
    const response = await request(app)
      .delete('/api/profile')
      .set('x-auth-token', tokens[0])
      .expect(200);
    expect(response.body.msg).toBe('User deleted');
    expect(await User.findOne({ email: 'test0@mail.com' })).toBe(null);
    expect(await Profile.findOne({ user: id })).toBe(null);
  });
});

describe('PUT /api/profile/experience', () => {
  test('fails if user is not authenticated', async () => {
    await request(app)
      .put('/api/profile/experience')
      .send({ title: 'title', company: 'company', from: '8-6-2010' })
      .expect(401);
  });
  test('fails if title is empty', async () => {
    const response = await request(app)
      .put('/api/profile/experience')
      .set('x-auth-token', tokens[0])
      .send({ company: 'company', from: '8-6-2010' })
      .expect(400);
    expect(response.body.errors[0].msg).toBe('Title is required');
  });
  test('fails if company is empty', async () => {
    const response = await request(app)
      .put('/api/profile/experience')
      .set('x-auth-token', tokens[0])
      .send({ title: 'title', from: '8-6-2010' })
      .expect(400);
    expect(response.body.errors[0].msg).toBe('Company is required');
  });
  test('fails if from is empty', async () => {
    const response = await request(app)
      .put('/api/profile/experience')
      .set('x-auth-token', tokens[0])
      .send({ title: 'title', company: 'company' })
      .expect(400);
    expect(response.body.errors[0].msg).toBe('From date is required');
  });
  test('when succeeds returns profile object', async () => {
    const response = await request(app)
      .put('/api/profile/experience')
      .set('x-auth-token', tokens[0])
      .send({ title: 'title', company: 'company', from: '8-6-2010' })
      .expect(200);
    expect(response.body).toHaveProperty('experience');
  });
});

describe('DELETE /api/profile/experience/:exp_id', () => {
  test('fails if user is not authenticated', async () => {
    const { id } = await User.findOne({ email: 'test0@mail.com' });
    const { experience } = await Profile.findOne({ user: id });
    await request(app)
      .delete(`/api/profile/experience/${experience[0]._id}`)
      .expect(401);
  });
  test('when succeeds returns new profile object', async () => {
    const { id } = await User.findOne({ email: 'test0@mail.com' });
    const { experience } = await Profile.findOne({ user: id });
    const response = await request(app)
      .delete(`/api/profile/experience/${experience[0]._id}`)
      .set('x-auth-token', tokens[0])
      .expect(200);
    expect(response.body.experience.length).toBeLessThan(experience.length);
  });
});

describe('PUT /api/profile/education', () => {
  test('fails if user is not authenticated', async () => {
    await request(app)
      .put('/api/profile/education')
      .send({ school: 'school', degree: 'degree' })
      .expect(401);
  });
  test('fails if school is empty', async () => {
    const response = await request(app)
      .put('/api/profile/education')
      .set('x-auth-token', tokens[0])
      .send({ degree: 'degree' })
      .expect(400);
    expect(response.body.errors[0].msg).toBe('School is required');
  });
  test('fails if degree is empty', async () => {
    const response = await request(app)
      .put('/api/profile/education')
      .set('x-auth-token', tokens[0])
      .send({ school: 'school' })
      .expect(400);
    expect(response.body.errors[0].msg).toBe('Degree is required');
  });
  test('when succeeds returns profile object', async () => {
    const response = await request(app)
      .put('/api/profile/education')
      .set('x-auth-token', tokens[0])
      .send({ school: 'school', degree: 'degree' })
      .expect(200);
    expect(response.body).toHaveProperty('education');
  });
});

describe('DELETE /api/profile/education/:edu_id', () => {
  test('fails if user is not authenticated', async () => {
    const { id } = await User.findOne({ email: 'test0@mail.com' });
    const { education } = await Profile.findOne({ user: id });
    await request(app)
      .delete(`/api/profile/education/${education[0]._id}`)
      .expect(401);
  });
  test('when succeeds returns new profile object', async () => {
    const { id } = await User.findOne({ email: 'test0@mail.com' });
    const { education } = await Profile.findOne({ user: id });
    const response = await request(app)
      .delete(`/api/profile/education/${education[0]._id}`)
      .set('x-auth-token', tokens[0])
      .expect(200);
    expect(response.body.education.length).toBeLessThan(education.length);
  });
});
