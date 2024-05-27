const express = require("express");
const router = express.Router();
const connection = require("../dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
require("dotenv").config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  connection.query(
    "SELECT * FROM sessions WHERE token = ?",
    [token],
    (error, results) => {
      if (error) {
        console.error("Error checking token in database:", error);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length === 0) {
        console.log("Token not found in database, expiring token");
        return res.status(401).json({ message: "Unauthorized" });
      }

      const expiration = new Date(results[0].expires_at).getTime();
      const now = new Date().getTime();
      if (now > expiration) {
        // Delete expired session from the database
        connection.query(
          "DELETE FROM sessions WHERE token = ?",
          [token],
          (deleteError) => {
            if (deleteError) {
              console.error("Error deleting expired token:", deleteError);
              return res.status(500).json({ message: "Internal server error" });
            }
            // Continue with the next middleware
            next();
          }
        );
        
      } else {
        // Continue with token verification
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
          if (err) return res.sendStatus(403);
          req.user = user;
          next();
        });
      }
    }
  );
}


router.get("/auth-check", authenticateToken, (req, res) => {
  res.sendStatus(200); // Send a success response if token authentication is successful
});

// Endpoint to create a new user
router.post("/newUser", (req, res, next) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ error: "Sign up failed" });
    }

    connection.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hash],
      (error, results) => {
        if (error) {
          console.error("Error signing up user:", error);
          return res.status(500).json({ error: "Sign up failed" });
        } else {
          console.log("User signed up successfully");
          res.status(200).json({ message: "User signed up successfully" });
        }
      }
    );
  });
});

// Endpoint to handle user login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (error, results) => {
      if (error) {
        console.error("Error retrieving user:", error);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).json({ message: "Internal server error" });
        }

        if (!passwordMatch) {
          return res
            .status(401)
            .json({ message: "Invalid username or password" });
        }

        const token = jwt.sign(
          { userId: user.user_id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
        connection.query(
          "INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)",
          [user.user_id, token, expiresAt],
          (err) => {
            if (err) {
              console.error("Error inserting session:", err);
              return res.status(500).json({ message: "Internal server error" });
            }

            res.json({ token });
          }
        );
      });
    }
  );
});

router.get("/getUser/:userId", (req, res) => {
  const userId = req.params.userId;

  // Query to select information about the specific user based on user_id
  connection.query(
    "SELECT * FROM users WHERE user_id = ?",
    [userId],
    (error, results, fields) => {
      if (error) {
        console.error("Error retrieving user:", error);
        return res.status(500).json({ error: "Failed to retrieve user" });
      }

      // Check if the user with the specified ID exists
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      // Send the retrieved user information as a JSON response
      res.status(200).json(results[0]);
    }
  );
});


router.post("/logAction", authenticateToken, (req, res) => {
  const { action } = req.body;
  const userId = req.user.userId;
  const date = moment().tz("America/Los_Angeles").format("YYYY-MM-DD HH:mm:ss");

  const query = "INSERT INTO history (date, action, user_id) VALUES (?, ?, ?)";
  connection.query(query, [date, action, userId], (error, results) => {
    if (error) {
      console.error("Error logging action:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json({ message: "Action logged successfully" });
  });
});

router.get("/transactions", authenticateToken, (req, res) => {
  const query = `
    SELECT h.id, h.date, h.action, u.username
    FROM history h
    JOIN users u ON h.user_id = u.user_id
    ORDER BY h.date DESC
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error retrieving transactions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    // Format the date for each transaction
    const formattedResults = results.map((transaction) => {
      return {
        ...transaction,
        date: moment(transaction.date)
          .tz("America/Los_Angeles")
          .format("YYYY-MM-DD hh:mm A"),
      };
    });

    res.status(200).json(formattedResults);
  });
});



router.post("/logout", (req, res) => {
  const token = req.headers["authorization"].split(" ")[1]; // Extract the token from the Authorization header
  connection.query("DELETE FROM sessions WHERE token = ?", [token], (err) => {
    if (err) {
      console.error("Error deleting session:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json({ message: "Logout successful" });
  });
});



module.exports = router;
