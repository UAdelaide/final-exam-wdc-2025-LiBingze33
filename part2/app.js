const express = require('express');
const session = require('express-session')
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(session({
  name: 'user.sid',
  secret: 'bingze',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 6000,
            httpOnly: true,
            rolling: true //reset cookie maxage on every response
   }
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