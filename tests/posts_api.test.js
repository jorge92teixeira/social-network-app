const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

const User = require('../models/User');
const Post = require('../models/Post');

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


describe('POST /social-network/api/posts', () => {
  test('fails if user is not authenticated', async () => {
    await request(app)
      .post('/social-network/api/posts')
      .expect(401);
  });
  test('fails if text is empty', async () => {
    const response = await request(app)
      .post('/social-network/api/posts')
      .set('x-auth-token', tokens[0])
      .send({ })
      .expect(400);
    expect(response.body.errors[0].msg).toBe('Text is required');
  });
  test('returns post if success', async () => {
    const response = await request(app)
      .post('/social-network/api/posts')
      .set('x-auth-token', tokens[0])
      .send({ text: 'test post' })
      .expect(200);
    expect(response.body).toHaveProperty('text', 'name', 'avatar', 'user');
    expect(response.body.text).toBe('test post');
  });
});

describe('GET /social-network/api/posts', () => {
  test('fails if user is not authenticated', async () => {
    await request(app)
      .get('/social-network/api/posts')
      .expect(401);
  });
  test('returns posts if success', async () => {
    const response = await request(app)
      .get('/social-network/api/posts')
      .set('x-auth-token', tokens[0])
      .expect(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].text).toBe('post text field');
  });
});

describe('GET /social-network/api/posts/:id', () => {
  test('fails if user is not authenticated', async () => {
    const { id } = await User.findOne({ email: 'test0@mail.com' });
    const posts = await Post.find({ user: id });
    await request(app)
      .get(`/social-network/api/posts/${posts[0].id}`)
      .expect(401);
  });
  test('returns post if success', async () => {
    const { id } = await User.findOne({ email: 'test0@mail.com' });
    const posts = await Post.find({ user: id });
    const response = await request(app)
      .get(`/social-network/api/posts/${posts[0].id}`)
      .set('x-auth-token', tokens[0])
      .expect(200);
    expect(response.body.text).toBe(posts[0].text);
    expect(response.body.user).toBe(id);
  });
});

describe('DELETE /social-network/api/posts/:id', () => {
  test('fails if user is not authenticated', async () => {
    const { id } = await User.findOne({ email: 'test0@mail.com' });
    const post = await Post.findOne({ user: id });
    await request(app)
      .delete(`/social-network/api/posts/${post.id}`)
      .expect(401);
  });

  test('fails if post does not exist', async () => {
    const { id } = await User.findOne({ email: 'test0@mail.com' });
    const post = await Post.findOne({ user: id });
    await Post.deleteMany({});
    const response = await request(app)
      .delete(`/social-network/api/posts/${post.id}`)
      .set('x-auth-token', tokens[0])
      .expect(404);
    expect(response.body.msg).toBe('Post not found');
  });

  test('fails if test1 tries to delete a post from test0', async () => {
    const { id } = await User.findOne({ email: 'test0@mail.com' });
    const post = await Post.findOne({ user: id });
    const response = await request(app)
      .delete(`/social-network/api/posts/${post.id}`)
      .set('x-auth-token', tokens[1])
      .expect(401);
    expect(response.body.msg).toBe('User not authorized');
  });
  test('if success returns message', async () => {
    const { id } = await User.findOne({ email: 'test0@mail.com' });
    const post = await Post.findOne({ user: id });
    const response = await request(app)
      .delete(`/social-network/api/posts/${post.id}`)
      .set('x-auth-token', tokens[0])
      .expect(200);
    expect(response.body.msg).toBe('Post removed');
  });
});

describe('PUT /social-network/api/posts/like/:id', () => {
  test('fails if user is not authenticated', async () => {
    const { id } = await User.findOne({ email: 'test0@mail.com' });
    const post = await Post.findOne({ user: id });
    await request(app)
      .put(`/social-network/api/posts/like/${post.id}`)
      .expect(401);
  });
  test('fails if user already liked post', async () => {
    const { id } = await User.findOne({ email: 'test0@mail.com' });
    const post = await Post.findOne({ user: id });
    const response = await request(app)
      .put(`/social-network/api/posts/like/${post.id}`)
      .set('x-auth-token', tokens[0])
      .expect(400);
    expect(response.body.msg).toBe('Post already liked');
  });
  test('if succeeds returns list of likes', async () => {
    const { id } = await User.findOne({ email: 'test0@mail.com' });
    const post = await Post.findOne({ user: id });
    const response = await request(app)
      .put(`/social-network/api/posts/like/${post.id}`)
      .set('x-auth-token', tokens[1])
      .expect(200);
    const test1 = await User.findOne({ email: 'test1@mail.com' });
    expect(response.body.length).toBe(2);
    expect(response.body[0].user).toBe(test1.id);
  });
});

describe('PUT /social-network/api/posts/unlike/:id', () => {
  test('fails if user is not authenticated', async () => {
    const { id } = await User.findOne({ email: 'test0@mail.com' });
    const post = await Post.findOne({ user: id });
    await request(app)
      .put(`/social-network/api/posts/unlike/${post.id}`)
      .expect(401);
  });

  test('fails if user have not liked post', async () => {
    const { id } = await User.findOne({ email: 'test0@mail.com' });
    const post = await Post.findOne({ user: id });
    const response = await request(app)
      .put(`/social-network/api/posts/unlike/${post.id}`)
      .set('x-auth-token', tokens[1])
      .expect(400);
    expect(response.body.msg).toBe('Post has not yet been liked');
  });

  test('if succeeds returns list of likes', async () => {
    const { id } = await User.findOne({ email: 'test0@mail.com' });
    const post = await Post.findOne({ user: id });
    const response = await request(app)
      .put(`/social-network/api/posts/unlike/${post.id}`)
      .set('x-auth-token', tokens[0])
      .expect(200);
    expect(response.body.length).toBe(0);
  });
});

describe('POST /social-network/api/posts/comment/:id', () => {
  test('fails if user is not authenticated', async () => {
    const user0 = await User.findOne({ email: 'test0@mail.com' });
    const post = await Post.findOne({ user: user0.id });
    await request(app)
      .post(`/social-network/api/posts/comment/${post.id}`)
      .send({
        text: 'test comment',
        name: user0.name,
        avatar: user0.avatar,
        user: user0.id,
      })
      .expect(401);
  });

  test('fails if text is empty', async () => {
    const user0 = await User.findOne({ email: 'test0@mail.com' });
    const post = await Post.findOne({ user: user0.id });
    const response = await request(app)
      .post(`/social-network/api/posts/comment/${post.id}`)
      .set('x-auth-token', tokens[0])
      .send({
        name: user0.name,
        avatar: user0.avatar,
        user: user0.id,
      })
      .expect(400);
    expect(response.body.errors[0].msg).toBe('Text is required');
  });

  test('if success returns post.comments array', async () => {
    const user0 = await User.findOne({ email: 'test0@mail.com' });
    const post = await Post.findOne({ user: user0.id });
    const response = await request(app)
      .post(`/social-network/api/posts/comment/${post.id}`)
      .set('x-auth-token', tokens[0])
      .send({
        text: 'test comment 2',
        name: user0.name,
        avatar: user0.avatar,
        user: user0.id,
      })
      .expect(200);
    expect(response.body.length).toBe(2);
  });
});

describe('DELETE /social-network/api/posts/comment/:id/:comment_id', () => {
  test('fails if user is not authenticated', async () => {
    const user0 = await User.findOne({ email: 'test0@mail.com' });
    const post = await Post.findOne({ user: user0.id });
    const comment = post.comments[0];
    await request(app)
      .delete(`/social-network/api/posts/comment/${post.id}/${comment.id}`)
      .expect(401);
  });

  test('fails comment does not exist', async () => {
    const user0 = await User.findOne({ email: 'test0@mail.com' });
    const post = await Post.findOne({ user: user0.id });
    const comment = post.comments[0];
    await Post.findByIdAndUpdate(post.id, { comments: [] });
    const response = await request(app)
      .delete(`/social-network/api/posts/comment/${post.id}/${comment.id}`)
      .set('x-auth-token', tokens[0])
      .expect(404);
    expect(response.body.msg).toBe('Comment does not exist');
  });

  test('fails if test1 tries to delete a post from test0', async () => {
    const user0 = await User.findOne({ email: 'test0@mail.com' });
    const post = await Post.findOne({ user: user0.id });
    const comment = post.comments[0];
    const response = await request(app)
      .delete(`/social-network/api/posts/comment/${post.id}/${comment.id}`)
      .set('x-auth-token', tokens[1])
      .expect(401);
    expect(response.body.msg).toBe('User not authorized');
  });

  test('if success returns post.comments array', async () => {
    const user0 = await User.findOne({ email: 'test0@mail.com' });
    const post = await Post.findOne({ user: user0.id });
    const comment = post.comments[0];
    const response = await request(app)
      .delete(`/social-network/api/posts/comment/${post.id}/${comment.id}`)
      .set('x-auth-token', tokens[0])
      .expect(200);
    expect(response.body.length).toBe(0);
  });
});
