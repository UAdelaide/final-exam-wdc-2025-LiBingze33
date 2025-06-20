const express = require('express');
const session = require('express-session'); //add the library we need for the session management
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(session({
  name: 'user.sid', //name of the cookie that will be soted in the browser
  secret: 'bingze', //secret key
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 100000 * 6000} //life time of the cookies
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;