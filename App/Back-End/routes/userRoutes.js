const express = require("express");
const router = express.Router();
const connection = require("../dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;

    // Check if the token exists in the database
    connection.query(
      "SELECT * FROM sessions WHERE token = ?",
      [token],
      (error, results) => {
        if (error) {
          console.error("Error checking token in database:", error);
          return res.status(500).json({ message: "Internal server error" });
        }

        // If token not found in database, set it to expire immediately
         if (results.length === 0) {
           console.log("Token not found in database, expiring token");
           return res.status(401).json({ message: "Unauthorized" });
         }

        // Token exists in database, check expiration
        const expiration = new Date(results[0].expires_at).getTime();
        const now = new Date().getTime();
        if (now > expiration) {
          console.log("Token expired, deleting from database");
          // Remove the token from the database
          connection.query(
            "DELETE FROM sessions WHERE token = ?",
            [token],
            (deleteError) => {
              if (deleteError) {
                console.error("Error deleting expired token:", deleteError);
                return res
                  .status(500)
                  .json({ message: "Internal server error" });
              }
              return res.status(401).json({ message: "Unauthorized" });
            }
          );
        } else {
          // Token is valid, continue with the request
          next();
        }
      }
    );
  });
}

router.get("/auth-check", authenticateToken, (req, res) => {
  res.sendStatus(200); // Send a success response if token authentication is successful
});

// Endpoint to create a new user
router.post("/newUser", (req, res, next) => {
  const { username, email, password, isSeller } = req.body; // Include isSeller in the request body

  // Hash the password before storing it in the database
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ error: "Sign up failed" });
    }

    // Store the hashed password and isSeller in the database
    connection.query(
      "INSERT INTO users (username, email, password, is_seller) VALUES (?, ?, ?, ?)",
      [username, email, hash, isSeller], // Include isSeller in the query parameters
      (error, results, fields) => {
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
  const { email, password } = req.body;
  console.log("Attempting to log in user:", email);

  // Retrieve user from the database
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (error, results, fields) => {
      if (error) {
        console.error("Error retrieving user:", error);
        return res.status(500).json({ message: "Internal server error" });
      }

      console.log("Query results:", results); // Log query results

      // Ensure that at least one user is found
      if (results.length === 0) {
        console.log("User not found");
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const user = results[0]; // Extract the user object from the first row

      // Check the number of active sessions for the user
      connection.query(
        "SELECT COUNT(*) AS count FROM sessions WHERE user_id = ? AND expires_at > NOW()",
        [user.user_id],
        (err, activeSessionsQueryResult) => {
          if (err) {
            console.error("Error checking active sessions:", err);
            return res.status(500).json({ message: "Internal server error" });
          }

          const activeSessionsCount = activeSessionsQueryResult[0].count;

          // Set a maximum number of active sessions per user
          const maxSessionsPerUser = 1;

          // If the number of active sessions exceeds the limit, deny login
          if (activeSessionsCount >= maxSessionsPerUser) {
            console.log("Maximum sessions limit exceeded for user:", email);
            return res
              .status(403)
              .json({ message: "Maximum sessions limit exceeded" });
          }

          // Compare hashed password from the database with the provided password
          bcrypt.compare(password, user.password, (err, passwordMatch) => {
            if (err) {
              console.error("Error comparing passwords:", err);
              return res.status(500).json({ message: "Internal server error" });
            }

            if (!passwordMatch) {
              console.log("Incorrect password");
              return res
                .status(401)
                .json({ message: "Invalid username or password" });
            }

            // Generate JWT token with username included in payload
            const token = jwt.sign(
              { userId: user.user_id, username: user.username, email: user.email},
              process.env.JWT_SECRET,
              {
                expiresIn: "1h",
              }
            );

            // Insert new session into the sessions table
            const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour from now
            connection.query(
              "INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)",
              [user.user_id, token, expiresAt],
              (err) => {
                if (err) {
                  console.error("Error inserting session:", err);
                  return res
                    .status(500)
                    .json({ message: "Internal server error" });
                }

                res.json({ token });
              }
            );
          });
        }
      );
    }
  );
});




module.exports = router;
