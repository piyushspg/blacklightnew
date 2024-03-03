const db = require("./db"); 
db.query("SELECT * FROM leaderboard", (err, results) => {
  if (err) {
    console.error("Error executing query:", err);
    return;
  }

  console.log("Query Results:", results);

  db.end((err) => {
    if (err) {
      console.error("Error closing pool:", err);
      return;
    }

    console.log("Connection pool closed");
  });
});
