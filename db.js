const mysql = require("mysql");


const pool = mysql.createPool({
    host: "sql6.freesqldatabase.com", // Replace with your database host
    user: "sql6690105", // Replace with your database username
    password: "fqbQ52qKNt", // Replace with your database password
    database: "sql6690105", // Replace with your database name
  });

// Export the pool for reuse
module.exports = pool;
