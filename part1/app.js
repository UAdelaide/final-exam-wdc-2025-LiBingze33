var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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
        const [user_count] = await db.execute('SELECT COUNT(*) AS count FROM Users');
        if (user_count[0].count === 0) {
            await db.execute(`
            INSERT INTO Users (username, email, password_hash, role) VALUES ('alice123', 'alice@example.com', 'hashed123', 'owner'),
            ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
            ('carol123', 'carol@example.com', 'hashed789', 'owner'),
            ('bingze', 'bingze@example.com', 'hashed789', 'owner'),
            ('bingze123', 'bingze123@example.com', 'hashed789', 'owner');

      `);
        }
        const [dog_count] = await db.execute('SELECT COUNT(*) AS count FROM Dogs');
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

        const [request_count] = await db.execute('SELECT COUNT(*) AS count FROM WalkRequests');
        if (request_count.count[0].count === 0) {
            await db.execute(`
            INSERT INTO Dogs (owner_id, name, size) VALUES
            ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max' , 'medium'),
            ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella' , 'small'),
            ((SELECT user_id FROM Users WHERE username = 'bobwalker'), 'Mike' , 'small'),
            ((SELECT user_id FROM Users WHERE username = 'bingze'), 'Toutou' , 'small'),
            ((SELECT user_id FROM Users WHERE username = 'bingze123'), 'Guodong' , 'small');
      `);
        }


    }

    catch (err) {
        console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
    }






})();

app.get('')




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
