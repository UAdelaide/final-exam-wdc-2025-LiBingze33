var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
let db;

(async () => {
    try {
        // Connect to MySQL without specifying a database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '' // Set your MySQL root password
        });

        // Create the database if it doesn't exist
        await connection.query('CREATE DATABASE IF NOT EXISTS DogWalkService');
        await connection.end();

        // Now connect to the created database
        db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'DogWalkService'
        });

        // Create a table if it doesn't exist
        // await db.execute(`
        //   CREATE TABLE IF NOT EXISTS books (
        //     id INT AUTO_INCREMENT PRIMARY KEY,
        //     title VARCHAR(255),
        //     author VARCHAR(255)
        //   )
        // `);

        // Insert data if table is empty
        const [user_count] = await db.query('SELECT COUNT(*) AS count FROM Users');
        if (user_count[0].count === 0) {
            await db.execute(`
            INSERT INTO Users (username, email, password_hash, role) VALUES ('alice123', 'alice@example.com', 'hashed123', 'owner'),
            ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
            ('carol123', 'carol@example.com', 'hashed789', 'owner'),
            ('bingze', 'bingze@example.com', 'hashed789', 'owner'),
            ('bingze123', 'bingze123@example.com', 'hashed789', 'owner');

      `);
        }
        const [dog_count] = await db.query('SELECT COUNT(*) AS count FROM Dogs');
        if (dog_count[0].count === 0) {
            await db.execute(`
            INSERT INTO Dogs (owner_id, name, size) VALUES
            ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max' , 'medium'),
            ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella' , 'small'),
            ((SELECT user_id FROM Users WHERE username = 'bobwalker'), 'Mike' , 'small'),
            ((SELECT user_id FROM Users WHERE username = 'bingze'), 'Toutou' , 'small'),
            ((SELECT user_id FROM Users WHERE username = 'bingze123'), 'Guodong' , 'small');
      `);
        }

        const [request_count] = await db.query('SELECT COUNT(*) AS count FROM WalkRequests');
        if (request_count[0].count === 0) {
            await db.execute(`
            INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
            ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
            ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
            ((SELECT dog_id FROM Dogs WHERE name = 'Mike'), '2025-06-11 10:00:00', 60, 'Adelaide', 'accepted'),
            ((SELECT dog_id FROM Dogs WHERE name = 'Toutou'), '2025-06-12 10:00:00', 60, 'China', 'completed'),
            ((SELECT dog_id FROM Dogs WHERE name = 'Guodong'), '2025-06-12 13:00:00', 60, 'Qingdao', 'completed');
                `);
        }
        const [rating_count] = await db.query('SELECT COUNT(*) AS count FROM WalkingRatings');
        if (rating_count[0].count === 0) {
            await db.execute(`
            INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating, comments) VALUES
            (
            (SELECT request_id FROM WalkRequests WHERE dog_id = (SELECT dog_id FROM Dogs WHERE name = 'Toutou') AND status = 'completed'),
            (SELECT user_id FROM Users WHERE username = 'bobwalker'),
            5,
            'good walker, very reliable'),

            INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating, comments) VALUES
            (
            (SELECT request_id FROM WalkRequests WHERE dog_id = (SELECT dog_id FROM Dogs WHERE name = '') AND status = 'completed'),
            (SELECT user_id FROM Users WHERE username = 'bobwalker'),
            5,
            'good walker, very reliable'),




                `);
        }


    }

    catch (err) {
        console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
    }






})();

app.get('/api/dogs',async (req, res) => {
    try{
        const [dogs] = await db.query('SELECT d.name AS dog_name, d.size, u.username AS owner_username FROM Dogs d JOIN Users u ON d.owner_id = u.user_id');
        res.json(dogs);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'cannot fetch dogs'});
    }

});

app.get('/api/walkrequests/open',async (req, res) => {
    try{
        const [requests] = await db.query("SELECT wr.request_id, d.name AS dog_name, wr.requested_time, wr.duration_minutes, wr.location, u.username AS owner_username FROM WalkRequests wr JOIN Dogs d ON wr.dog_id = d.dog_id JOIN Users u ON d.owner_id = u.user_id WHERE wr.status ='open'");
        res.json(requests);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'cannot fetch requests'});
    }

});



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
