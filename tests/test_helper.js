const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const User = require('../models/User');
const Profile = require('../models/Profile');
const Post = require('../models/Post');

const testUsers = [
  {
    name: 'Test0', email: 'test0@mail.com', password: '123456',
  },
  {
    name: 'Test1', email: 'test1@mail.com', password: '1234567',
  },
  {
    name: 'Test2', email: 'test2@mail.com', password: '1234568',
  },
];

const createTestUsers = async () => {
  await User.deleteMany({});

  const tokens = testUsers.map(async (u) => {
    try {
      const user = new User(u);
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(u.password, salt);
      // save user
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      const t = jwt.sign(
        payload,
        config.JWT_SECRET,
        { expiresIn: 360000 },
      );
      return t;
    } catch (error) {
      return console.error(error.message);
    }
  });

  return Promise.all(tokens);
};

const createProfiles = async () => {
  await Profile.deleteMany({});

  // Build profile object for user Test0
  const userId0 = await User.findOne({ email: 'test0@mail.com' });
  const profileFields0 = {
    user: userId0.id,
    company: 'CompanyTest0',
    status: 'Status0',
    skills: ['Javascript', 'Node'],
    social: {},
    experience: [
      { title: 'title', company: 'company', from: '8-6-2010' },
    ],
    education: [
      { school: 'school', degree: 'degree' },
    ],
  };

  // Build profile object for user Test1
  const userId1 = await User.findOne({ email: 'test1@mail.com' });
  const profileFields1 = {
    user: userId1.id,
    company: 'CompanyTest1',
    status: 'Status1',
    skills: ['Javascript', 'Node'],
    social: {},
  };

  try {
    const profile0 = new Profile(profileFields0);
    const profile1 = new Profile(profileFields1);
    await profile0.save();
    await profile1.save();
  } catch (error) {
    console.log(error);
  }
};

const createPosts = async () => {
  await Post.deleteMany({});

  const user0 = await User.findOne({ email: 'test0@mail.com' });

  const postFields0 = {
    text: 'post text field',
    name: user0.name,
    avatar: user0.avatar,
    user: user0.id,
    likes: [{ user: user0.id }],
    comments: [
      {
        text: 'test comment',
        name: user0.name,
        avatar: user0.avatar,
        user: user0.id,
      },
    ],
  };

  try {
    const post0 = new Post(postFields0);
    await post0.save();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createTestUsers,
  createProfiles,
  createPosts,
};
