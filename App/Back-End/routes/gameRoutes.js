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
      const userData = results[0];

      let progress = [];
      try {
        progress = userData.progress ? JSON.parse(userData.progress) : [];
      } catch (error) {
        return res.status(500).json({ error: "Failed to parse progress data" });
      }

      const progressCount = progress.length;
      const tierRequirements = [0, 0, 19, 21, 23, 24, 25, 26, 27];
      const requiredProgress = tierRequirements[userData.tier];
      const canBeRescued =
        userData.tier === 1 || progressCount >= requiredProgress;

      res.json({
        ...userData,
        progress,
        canBeRescued,
      });
    }
  );
});

// Endpoint to update progress
router.post("/game/update/progress", (req, res) => {
  const { rescuerCode, rescueeCode } = req.body;

  connection.query(
    "SELECT progress, tier FROM ol_game WHERE code = ?",
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

      const progressCount = progress.length;
      const tierRequirements = [0, 0, 19, 21, 23, 24, 25, 26, 27];
      const requiredProgress = tierRequirements[results[0].tier];

      if (results[0].tier === 1 || progressCount >= requiredProgress) {
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
      } else {
        res
          .status(403)
          .json({ error: "Not enough OL power to rescue this person" });
      }
    }
  );
});

module.exports = router;
