require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/social-network/api/users', require('./routes/api/users'));
app.use('/social-network/api/auth', require('./routes/api/auth'));
app.use('/social-network/api/posts', require('./routes/api/posts'));
app.use('/social-network/api/profile', require('./routes/api/profile'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use('/social-network/', express.static(path.join(__dirname, '/client/build')));
  // Set static folder
  // app.use(express.static('client/build'));

  // app.get('*', (req, res) => {
  //   res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  // });
}

module.exports = app;
