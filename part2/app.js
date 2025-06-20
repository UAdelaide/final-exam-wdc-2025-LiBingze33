const express = require('express');
const session = require('express-session'); //add the library we need for the session management
const path = require('path');
const db = require('./models/db');
const{check_owners, check_walkers} = require("./middleware/auth");
require('dotenv').config();

const app = express();

// Middleware
app.use(session({
  name: 'user.sid', //name of the cookie that will be soted in the browser
  secret: 'bingze', //secret key
  resave: false, //
  saveUninitialized: false,
  cookie: { maxAge: 100000 * 6000} //life time of the cookies
}));
// Protect from force browsing, now if their identity mismatch or not logged in will all redirect to the index page
app.get('/owner-dashboard.html', check_owners, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'owner-dashboard.html'));
});
app.get('/walker-dashboard.html', check_walkers, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'walker-dashboard.html'));
});
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);
app.use('/api/owners',ownerRoutes);
app.get('/api/dogs',async (req, res) => {
    try{ // Just get all the information from the dog tables
        const [dogs] = await db.query('SELECT dog_id, name, size, owner_id FROM Dogs');
        res.json(dogs);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'cannot fetch dogs'});
    }

});

// Export the app instead of listening here
module.exports = app;