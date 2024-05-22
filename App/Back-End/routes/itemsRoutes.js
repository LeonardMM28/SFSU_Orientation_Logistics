const express = require("express");
const router = express.Router();
const connection = require("../dbConfig");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
// Configure multer to use S3 storage
console.log(process.env.AWS_S3_BUCKET_NAME);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// AWS SDK configuration
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadFileToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
  };
  const upload = new Upload({
    client: s3,
    params,
  });

  return await upload.done();
};

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

router.get("/items/uniforms", authenticateToken, (req, res) => {
  connection.query(
    "SELECT * FROM items WHERE category = 'UNIFORMS'",
    (error, results) => {
      if (error) {
        console.error("Error retrieving uniforms:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.json(results);
    }
  );
});

router.get("/items/supplies", authenticateToken, (req, res) => {
  connection.query(
    "SELECT * FROM items WHERE category = 'SUPPLIES'",
    (error, results) => {
      if (error) {
        console.error("Error retrieving uniforms:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.json(results);
    }
  );
});

router.get("/items/:itemId", authenticateToken, (req, res) => {
  const { itemId } = req.params;

  // Query to retrieve item data from the database
  connection.query(
    "SELECT * FROM items WHERE id = ?",
    [itemId],
    (error, results) => {
      if (error) {
        console.error("Error retrieving item:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Item not found" });
      }
      const item = results[0];
      res.json(item);
    }
  );
});


router.get("/sessions", authenticateToken, (req, res) => {
  connection.query("SELECT * FROM OLSessions", (error, results) => {
    if (error) {
      console.error("Error retrieving sessions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(results);
  });
});

router.get("/session/:sessionId", authenticateToken, (req, res) => {
  const { sessionId } = req.params;

  // Query to retrieve session data from the database
  connection.query(
    "SELECT * FROM OLSessions WHERE id = ?",
    [sessionId],
    (error, results) => {
      if (error) {
        console.error("Error retrieving session:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Session not found" });
      }
      const session = results[0];
      try {
        // Ensure the checklist is parsed from JSON to an array
        session.checklist = JSON.parse(session.checklist);
      } catch (parseError) {
        console.error("Error parsing checklist:", parseError);
        session.checklist = [];
      }
      res.json(session);
    }
  );
});


router.put("/edit/session/:sessionId", authenticateToken, (req, res) => {
  const { sessionId } = req.params;
  const { date, type, attendees, checklist } = req.body;

  // Validate input data
  if (!date || !type || attendees == null || !checklist) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Update session data in the database
  const query =
    "UPDATE OLSessions SET date = ?, type = ?, attendees = ?, checklist = ? WHERE id = ?";
  connection.query(
    query,
    [date, type, attendees, JSON.stringify(checklist), sessionId],
    (error, results) => {
      if (error) {
        console.error("Error updating session:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.json({ message: "Session updated successfully" });
    }
  );
});

router.post(
  "/add/items",
  authenticateToken,
  upload.single("picture"),
  async (req, res) => {
    try {
      const { name, category, locationAnnex, quantityAnnex, locationHQ, quantityHQ } =
        req.body;
      let imageUrl = null;
      if (req.file) {
        const s3Response = await uploadFileToS3(req.file);
        imageUrl = s3Response.Location; // Use only the Location property
      }

      const query =
        "INSERT INTO items (name, image, category, location_annex, quantity_annex, location_hq, quantity_hq) VALUES (?, ?, ?, ?, ?, ?, ?)";
      connection.query(
        query,
        [name, imageUrl, category, locationAnnex, quantityAnnex, locationHQ, quantityHQ],
        (error, results) => {
          if (error) {
            console.error("Error adding item:", error);
            return res.status(500).json({ message: "Internal server error" });
          }
          res.status(201).json({ message: "Item added successfully" });
        }
      );
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post("/add/session", authenticateToken, (req, res) => {
  const { date, type, attendees, checklist } = req.body;

  // Validate the input
  if (!date || !type || attendees == null || !checklist) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Insert the new session into the OLSessions table
  const query =
    "INSERT INTO OLSessions (date, type, attendees, checklist) VALUES (?, ?, ?, ?)";
  connection.query(
    query,
    [date, type, attendees, JSON.stringify(checklist)],
    (error, results) => {
      if (error) {
        console.error("Error inserting session:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.status(201).json({
        message: "Session added successfully",
        sessionId: results.insertId,
      });
    }
  );
});



module.exports = router;
