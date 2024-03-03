const mysql = require("mysql");


const pool = mysql.createPool({
    host: "sql6.freesqldatabase.com", // Replace with your database host
    user: "sql6688288", // Replace with your database username
    password: "u9jYWueKd6", // Replace with your database password
    database: "sql6688288", // Replace with your database name
  });

// Export the pool for reuse
module.exports = pool;
