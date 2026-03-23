const express = require("express");
const router = express.Router();
const pool = require("../dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
require("dotenv").config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  pool.query(
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
        pool.query(
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

    pool.query(
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

  pool.query(
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

        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        pool.query(
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

  pool.query(
    "SELECT * FROM users WHERE user_id = ?",
    [userId],
    (error, results) => {
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

  pool.query(
    "INSERT INTO history (date, action, user_id) VALUES (?, ?, ?)",
    [date, action, userId],
    (error, results) => {
      if (error) {
        console.error("Error logging action:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.status(200).json({ message: "Action logged successfully" });
    }
  );
});

router.get("/transactions", authenticateToken, (req, res) => {
  const query = `
    SELECT h.id, h.date, h.action, u.username
    FROM history h
    JOIN users u ON h.user_id = u.user_id
    ORDER BY h.date DESC
  `;

  pool.query(query, (error, results) => {
    if (error) {
      console.error("Error retrieving transactions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    const formattedResults = results.map((transaction) => ({
      ...transaction,
      date: moment(transaction.date)
        .tz("America/Los_Angeles")
        .format("YYYY-MM-DD hh:mm A"),
    }));

    res.status(200).json(formattedResults);
  });
});


router.post("/logout", (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  pool.query("DELETE FROM sessions WHERE token = ?", [token], (err) => {
    if (err) {
      console.error("Error deleting session:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json({ message: "Logout successful" });
  });
});

router.post("/changePassword", authenticateToken, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;

  pool.query(
    "SELECT password FROM users WHERE user_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error retrieving user password:", error);
        return res.status(500).json({ message: "Internal server error" });
      }

      // Check if the user exists
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const hashedPassword = results[0].password;

      // Compare the provided old password with the hashed password in the database
      bcrypt.compare(oldPassword, hashedPassword, (err, passwordMatch) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).json({ message: "Internal server error" });
        }

        if (!passwordMatch) {
          return res.status(401).json({ message: "Incorrect old password" });
        }

        // Hash the new password
        bcrypt.hash(newPassword, 10, (hashErr, newHash) => {
          if (hashErr) {
            console.error("Error hashing new password:", hashErr);
            return res.status(500).json({ message: "Internal server error" });
          }

          pool.query(
            "UPDATE users SET password = ? WHERE user_id = ?",
            [newHash, userId],
            (updateError) => {
              if (updateError) {
                console.error("Error updating password:", updateError);
                return res
                  .status(500)
                  .json({ message: "Internal server error" });
              }

              res
                .status(200)
                .json({ message: "Password changed successfully" });
            }
          );
        });
      });
    }
  );
});




module.exports = router;
