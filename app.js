
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const db = require("./db");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.set("views", __dirname); 
app.use(express.static(path.join(__dirname, "public")));

const fetchUserRank = () => {
    return 42;
};

app.get("/", (req, res) => {
    const userRank = fetchUserRank();
    res.render("home", { userRank });
});
app.get("/question1", (req, res) => {
    const query = `
        SELECT *
        FROM leaderboard
        WHERE YEARWEEK(TimeStamp, 1) = YEARWEEK(NOW(), 1)
        ORDER BY Score DESC
        LIMIT 200;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).send("Internal Server Error");
            return;
        }

        res.render("all_entry", { leaderboard: results });
    });
});

app.get("/question2", (req, res) => {
    const userProvidedCountryCode = req.query.country;

    if (!userProvidedCountryCode) {
        res.render("home", { userRank: undefined, message: "Please enter a country code" });
        return;
    }

    const query = `
        SELECT *
        FROM leaderboard
        WHERE Country = ?
          AND YEARWEEK(TimeStamp, 1) = YEARWEEK(NOW() - INTERVAL 1 WEEK, 1)
        ORDER BY Score DESC
        LIMIT 200;
    `;

    db.query(query, [userProvidedCountryCode], (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).send("Internal Server Error");
            return;
        }

        res.render("all_entry", { leaderboard: results, message: null });
    });
});

app.get("/user_rank", (req, res) => {
    const uid = req.query.uid;

    if (!uid) {
        res.render("home", { userRank: "Please enter a UID" });
        return;
    }

    const query = `
        SELECT RANK
        FROM (
            SELECT UID, Score,
            @curRank := IF(@prevScore = Score, @curRank, @rowCount) AS RANK,
            @rowCount := @rowCount + 1,
            @prevScore := Score
            FROM leaderboard, (SELECT @curRank := 0, @prevScore := null, @rowCount := 1) AS vars
            ORDER BY Score DESC
        ) AS ranked_users
        WHERE UID = ?;
    `;

    db.query(query, [uid], (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).send(`Internal Server Error: ${err.message}`);
            return;
        }

        if (results.length > 0) {
            const userRank = results[0].RANK;
            res.render("home", { userRank });
        } else {
            res.render("home", { userRank: "User not found" });
        }
    });
});

// Route to fetch and render all entries
app.get("/all_entry", (req, res) => {
    const query = `
        SELECT *
        FROM leaderboard;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).send("Internal Server Error");
            return;
        }

        // Assuming you have an EJS template named all_entry.ejs to render the data
        res.render("all_entry", { leaderboard: results });
    });
});

// ... (other routes and server startup)

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
