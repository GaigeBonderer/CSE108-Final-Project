// db.js
const sqlite3 = require('sqlite3').verbose();

// Create a new SQLite database connection
const db = new sqlite3.Database('Slayerz.sqlite');

// Check if the connection is successful
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)");
});

// Function to close the database connection
function closeConnection() {
  db.close(err => {
    if (err) {
      return console.error('Error closing the connection:', err.message);
    }
    console.log('Database connection closed.');
  });
}

// Export the connection and the close function
module.exports = {
  db,
  closeConnection
};
