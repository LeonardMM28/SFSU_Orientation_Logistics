const express = require("express");
const router = express.Router();
const connection = require("../dbConfig");

// Endpoint to get user game data
router.get("/game/userdata/:code", (req, res) => {
  const { code } = req.params;
  connection.query(
    "SELECT * FROM ol_game WHERE code = ?",
    [code],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(results[0]);
    }
  );
});

// Endpoint to set a rescue request
router.post("/game/set/request", (req, res) => {
  const { rescuerCode, rescueeCode, timer } = req.body;
  connection.query(
    'UPDATE ol_game SET requests = JSON_OBJECT("rescuer", ?, "timer", ?) WHERE code = ?',
    [rescuerCode, timer, rescueeCode],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Rescue request set successfully" });
    }
  );
});

// Endpoint to check for rescue requests
router.get("/game/check/request/:code", (req, res) => {
  const { code } = req.params;
  connection.query(
    "SELECT requests FROM ol_game WHERE code = ?",
    [code],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(results[0].requests);
    }
  );
});

// Endpoint to clear a rescue request
router.post("/game/clear/request", (req, res) => {
  const { code } = req.body;
  connection.query(
    "UPDATE ol_game SET requests = NULL WHERE code = ?",
    [code],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Rescue request cleared successfully" });
    }
  );
});

module.exports = router;
