// var sqlite3 = require('sqlite3');
// var mkdirp = require('mkdirp');
// // var crypto = require('crypto');

// mkdirp.sync('var/db');

// var db = new sqlite3.Database('var/db/todos.db');

// db.serialize(function() {
//   // create the database schema for the todos app
//   db.run("CREATE TABLE IF NOT EXISTS users ( \
//     id INTEGER PRIMARY KEY, \
//     username TEXT UNIQUE, \
//     hashed_password BLOB, \
//     salt BLOB, \
//     name TEXT, \
//     email TEXT UNIQUE, \
//     email_verified INTEGER \
//   )");
  
//   db.run("CREATE TABLE IF NOT EXISTS federated_credentials ( \
//     id INTEGER PRIMARY KEY, \
//     user_id INTEGER NOT NULL, \
//     provider TEXT NOT NULL, \
//     subject TEXT NOT NULL, \
//     UNIQUE (provider, subject) \
//   )");
  
//   db.run("CREATE TABLE IF NOT EXISTS todos ( \
//     id INTEGER PRIMARY KEY, \
//     owner_id INTEGER NOT NULL, \
//     title TEXT NOT NULL, \
//     completed INTEGER \
//   )");
  
//   // create an initial user (username: alice, password: letmein)
//   var salt = crypto.randomBytes(16);
//   db.run('INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
//     'alice',
//     crypto.pbkdf2Sync('letmein', salt, 310000, 32, 'sha256'),
//     salt
//   ]);
// });
const dotenv = require('dotenv')
dotenv.config();
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
})

db.connect(function(err) {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

module.exports = db;
