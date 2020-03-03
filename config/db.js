const mongoose = require('mongoose');

let MONGODB_URI = '';

const connectDB = async () => {
  if (process.env.NODE_ENV === 'production') MONGODB_URI = process.env.MONGODB_URI;
  if (process.env.NODE_ENV === 'development') MONGODB_URI = process.env.DEV_MONGODB_URI;
  if (process.env.NODE_ENV === 'test') MONGODB_URI = process.env.TEST_MONGODB_URI;

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(`MongoDB connected - ${MONGODB_URI}`);
  } catch (error) {
    console.error(error.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
