const mysql = require("mysql");


const pool = mysql.createPool({
    host: "localhost", // Replace with your database host
    user: "root", // Replace with your database username
    password: "", // Replace with your database password
    database: "leadenhall", // Replace with your database name
  });

// Export the pool for reuse
module.exports = pool;
