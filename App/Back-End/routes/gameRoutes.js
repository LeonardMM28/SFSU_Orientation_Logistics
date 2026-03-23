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

// Endpoint to update progress
router.post("/game/update/progress", (req, res) => {
  const { rescuerCode, rescueeCode } = req.body;
  connection.query(
    "SELECT progress FROM ol_game WHERE code = ?",
    [rescuerCode],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Rescuer not found" });
      }

      let progress = [];
      try {
        progress = results[0].progress ? JSON.parse(results[0].progress) : [];
      } catch (error) {
        return res.status(500).json({ error: "Failed to parse progress data" });
      }

      // Ensure progress is an array
      if (!Array.isArray(progress)) {
        progress = [];
      }

      progress.push(rescueeCode);

      connection.query(
        "UPDATE ol_game SET progress = ? WHERE code = ?",
        [JSON.stringify(progress), rescuerCode],
        (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: "Progress updated successfully" });
        }
      );
    }
  );
});

module.exports = router;
