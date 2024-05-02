// User.js
const bcrypt = require('bcrypt');
const { db } = require('../db/db');

async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 12);
  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  return new Promise((resolve, reject) => {
    db.run(sql, [username, hashedPassword], function(error) {
      if (error) {
        reject(error);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

function findUserByUsername(username) {
  const sql = 'SELECT * FROM users WHERE LOWER(username) = LOWER(?)';
  return new Promise((resolve, reject) => {
    db.get(sql, [username], (error, row) => {
      if (error) {
        console.error('Database error:', error);
        reject(error);
      } else {
        console.log('User found:', row);
        resolve(row);
      }
    });
  });
}

async function comparePasswords(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = { createUser, findUserByUsername, comparePasswords };