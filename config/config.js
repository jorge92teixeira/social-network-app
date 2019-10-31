require('dotenv').config();

const {
  PORT,
  JWT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_SECRET,
} = process.env;
let { MONGODB_URI } = process.env;

if (process.env.NODE_ENV === 'development') {
  MONGODB_URI = process.env.DEV_MONGODB_URI;
}

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI;
}

module.exports = {
  PORT,
  MONGODB_URI,
  JWT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_SECRET,
};
