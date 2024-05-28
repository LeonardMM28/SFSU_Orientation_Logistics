const express = require("express");
const router = express.Router();
const connection = require("../dbConfig");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
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

router.put(
  "/edit/item/:itemId",
  authenticateToken,
  upload.single("picture"),
  async (req, res) => {
    const { itemId } = req.params;
    const { name, locationAnnex, quantityAnnex, locationHQ, quantityHQ, consumible } =
      req.body;
    let imageUrl = null;

    try {
      // Check if there's a file upload
      if (req.file) {
        const s3Response = await uploadFileToS3(req.file);
        imageUrl = s3Response.Location; // Use only the Location property
      }

      // Retrieve the current item data from the database
      connection.query(
        "SELECT * FROM items WHERE id = ?",
        [itemId],
        async (error, results) => {
          if (error) {
            console.error("Error retrieving item:", error);
            return res.status(500).json({ error: "Internal server error" });
          }

          if (results.length === 0) {
            return res.status(404).json({ message: "Item not found" });
          }

          const currentItem = results[0];

          // Compare the updated values with the current values
          const changes = [];
          if (name !== currentItem.name) {
            changes.push(`Name changed from ${currentItem.name} to ${name}`);
          }
          if (String(locationAnnex) !== String(currentItem.location_annex)) {
            changes.push(
              `Location at annex changed from ${currentItem.location_annex} to ${locationAnnex}`
            );
          }
          if (String(quantityAnnex) !== String(currentItem.quantity_annex)) {
            changes.push(
              `Quantity at annex changed from ${currentItem.quantity_annex} to ${quantityAnnex}`
            );
          }
          if (String(locationHQ) !== String(currentItem.location_hq)) {
            changes.push(
              `Location at HQ changed from ${currentItem.location_hq} to ${locationHQ}`
            );
          }
          if (String(quantityHQ) !== String(currentItem.quantity_hq)) {
            changes.push(
              `Quantity at HQ changed from ${currentItem.quantity_hq} to ${quantityHQ}`
            );
          }

          // Construct the action message
          const action = `Item "${
            currentItem.name
          }" was edited: ${changes.join(", ")}`;

          // Update the item in the database
          const query = `
            UPDATE items
            SET name = ?, image = IFNULL(?, image), location_annex = ?, quantity_annex = ?, location_hq = ?, quantity_hq = ?, consumible = ?
            WHERE id = ?
          `;
          const values = [
            name,
            imageUrl || currentItem.image,
            locationAnnex,
            quantityAnnex,
            locationHQ,
            quantityHQ,
            consumible,
            itemId,
          ];

          connection.query(query, values, (updateError, updateResults) => {
            if (updateError) {
              console.error("Error updating item:", updateError);
              return res.status(500).json({ error: "Error updating item" });
            }

            // Log the action in the history table
            const userId = req.user.userId;
            const date = moment()
              .tz("America/Los_Angeles")
              .format("YYYY-MM-DD HH:mm:ss");
            const logQuery =
              "INSERT INTO history (date, action, user_id) VALUES (?, ?, ?)";
            connection.query(
              logQuery,
              [date, action, userId],
              (logError, logResults) => {
                if (logError) {
                  console.error("Error logging action:", logError);
                  return res
                    .status(500)
                    .json({ message: "Internal server error" });
                }
                res.json({ message: "Item updated successfully" });
              }
            );
          });
        }
      );
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);


router.post("/store/item", authenticateToken, (req, res) => {
  const { itemId, amount } = req.body;

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
      if (item.quantity_hq < amount) {
        return res.status(400).json({ message: "Not enough quantity at HQ" });
      }

      connection.query(
        "UPDATE items SET quantity_hq = quantity_hq - ?, quantity_annex = quantity_annex + ? WHERE id = ?",
        [amount, amount, itemId],
        (updateError) => {
          if (updateError) {
            console.error("Error updating item:", updateError);
            return res.status(500).json({ message: "Internal server error" });
          }
          res.json({ message: "Item stored successfully" });
        }
      );
    }
  );
});


router.post("/retrieve/item", authenticateToken, (req, res) => {
  const { itemId, amount } = req.body;

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
      if (item.quantity_annex < amount) {
        return res
          .status(400)
          .json({ message: "Not enough quantity at Annex" });
      }

      connection.query(
        "UPDATE items SET quantity_annex = quantity_annex - ?, quantity_hq = quantity_hq + ? WHERE id = ?",
        [amount, amount, itemId],
        (updateError) => {
          if (updateError) {
            console.error("Error updating item:", updateError);
            return res.status(500).json({ message: "Internal server error" });
          }
          res.json({ message: "Item retrieved successfully" });
        }
      );
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

  // Begin transaction
  connection.beginTransaction(async (transactionError) => {
    if (transactionError) {
      console.error("Error beginning transaction:", transactionError);
      return res.status(500).json({ error: "Internal server error" });
    }

    try {
      // Update session data in the database
      const query =
        "UPDATE OLSessions SET date = ?, type = ?, attendees = ?, checklist = ? WHERE id = ?";
      await connection.query(query, [
        date,
        type,
        attendees,
        JSON.stringify(checklist),
        sessionId,
      ]);

      // Log the action in the history table
      const userId = req.user.userId;
      const action = `Session for ${date} was edited`;
      const dateLogged = moment()
        .tz("America/Los_Angeles")
        .format("YYYY-MM-DD HH:mm:ss");
      const logQuery =
        "INSERT INTO history (date, action, user_id) VALUES (?, ?, ?)";
      await connection.query(logQuery, [dateLogged, action, userId]);

      // Commit transaction
      await connection.commit();

      res.json({ message: "Session updated successfully" });
    } catch (error) {
      console.error("Error updating session:", error);
      await connection.rollback();
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

router.put(
  "/update-session-ES/:sessionId",
  authenticateToken,
  (req, res) => {
    const { sessionId } = req.params;

    // Update session status in the database to 'ES'
    const query = "UPDATE OLSessions SET status = 'ES' WHERE id = ?";
    connection.query(query, [sessionId], (error, results) => {
      if (error) {
        console.error("Error updating session status:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.json({ message: "Session status updated to 'ES' successfully" });
    });
  }
);

router.put("/update-session-NES/:sessionId", authenticateToken, (req, res) => {
  const { sessionId } = req.params;

  // Update session status in the database to 'NES'
  const query = "UPDATE OLSessions SET status = 'NES' WHERE id = ?";
  connection.query(query, [sessionId], (error, results) => {
    if (error) {
      console.error("Error updating session status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json({ message: "Session status updated to 'ES' successfully" });
  });
});

router.put(
  "/update-session-READY/:sessionId",
  authenticateToken,
  (req, res) => {
    const { sessionId } = req.params;

    // Begin transaction
    connection.beginTransaction(async (transactionError) => {
      if (transactionError) {
        console.error("Error beginning transaction:", transactionError);
        return res.status(500).json({ error: "Internal server error" });
      }

      try {
        // Retrieve the session date from the database
        connection.query(
          "SELECT date FROM OLSessions WHERE id = ?",
          [sessionId],
          async (error, results) => {
            if (error) {
              console.error("Error retrieving session date:", error);
              return res.status(500).json({ error: "Internal server error" });
            }
            if (results.length === 0) {
              return res.status(404).json({ message: "Session not found" });
            }

            const sessionDate = moment(results[0].date).format("YYYY-MM-DD");

            // Update session status in the database to 'READY'
            const updateQuery =
              "UPDATE OLSessions SET status = 'READY' WHERE id = ?";
            await connection.query(updateQuery, [sessionId]);

            // Log the action in the history table with the session date
            const userId = req.user.userId;
            const action = `Session for ${sessionDate} status changed to 'READY'`;
            const dateLogged = moment()
              .tz("America/Los_Angeles")
              .format("YYYY-MM-DD HH:mm:ss");
            const logQuery =
              "INSERT INTO history (date, action, user_id) VALUES (?, ?, ?)";
            await connection.query(logQuery, [dateLogged, action, userId]);

            // Commit transaction
            await connection.commit();

            res.json({
              message: "Session status updated to 'READY' successfully",
            });
          }
        );
      } catch (error) {
        console.error("Error updating session status to 'READY':", error);
        await connection.rollback();
        res.status(500).json({ message: "Internal server error" });
      }
    });
  }
);


router.post(
  "/add/items",
  authenticateToken,
  upload.single("picture"),
  async (req, res) => {
    try {
      const {
        name,
        category,
        locationAnnex,
        quantityAnnex,
        locationHQ,
        quantityHQ,
        consumible,
      } = req.body;

      // Check if the item name already exists
      const nameCheckQuery = "SELECT * FROM items WHERE name = ?";
      connection.query(
        nameCheckQuery,
        [name],
        async (nameCheckError, nameCheckResults) => {
          if (nameCheckError) {
            console.error("Error checking item name:", nameCheckError);
            return res.status(500).json({ message: "Internal server error" });
          }

          // If the item name already exists, return an error
          if (nameCheckResults.length > 0) {
            return res
              .status(400)
              .json({ message: "Item name already exists" });
          }

          let imageUrl = null;
          if (req.file) {
            const s3Response = await uploadFileToS3(req.file);
            imageUrl = s3Response.Location; // Use only the Location property
          }

          const query =
            "INSERT INTO items (name, image, category, location_annex, quantity_annex, location_hq, quantity_hq, consumible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
          connection.query(
            query,
            [
              name,
              imageUrl,
              category,
              locationAnnex,
              quantityAnnex,
              locationHQ,
              quantityHQ,
              consumible,
            ],
            (error, results) => {
              if (error) {
                console.error("Error adding item:", error);
                return res
                  .status(500)
                  .json({ message: "Internal server error" });
              }

              // Log the action in the history table
              const action = `${name} was added to inventory`;
              const userId = req.user.userId;
              const date = moment()
                .tz("America/Los_Angeles")
                .format("YYYY-MM-DD HH:mm:ss");
              const logQuery =
                "INSERT INTO history (date, action, user_id) VALUES (?, ?, ?)";
              connection.query(
                logQuery,
                [date, action, userId],
                (logError, logResults) => {
                  if (logError) {
                    console.error("Error logging action:", logError);
                    return res
                      .status(500)
                      .json({ message: "Internal server error" });
                  }
                  res.status(201).json({ message: "Item added successfully" });
                }
              );
            }
          );
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

  // Begin transaction
  connection.beginTransaction(async (transactionError) => {
    if (transactionError) {
      console.error("Error beginning transaction:", transactionError);
      return res.status(500).json({ error: "Internal server error" });
    }

    try {
      // Insert the new session into the OLSessions table
      const query =
        "INSERT INTO OLSessions (date, type, attendees, checklist) VALUES (?, ?, ?, ?)";
      const results = await connection.query(query, [
        date,
        type,
        attendees,
        JSON.stringify(checklist),
      ]);

      const sessionId = results.insertId;

      // Log the action in the history table
      const userId = req.user.userId;
      const action = `Session for ${date} was added`;
      const dateLogged = moment()
        .tz("America/Los_Angeles")
        .format("YYYY-MM-DD HH:mm:ss");
      const logQuery =
        "INSERT INTO history (date, action, user_id) VALUES (?, ?, ?)";
      await connection.query(logQuery, [dateLogged, action, userId]);

      // Commit transaction
      await connection.commit();

      res.status(201).json({
        message: "Session added successfully",
        sessionId: sessionId,
      });
    } catch (error) {
      console.error("Error inserting session:", error);
      await connection.rollback();
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

router.put("/deduct-item-quantity/:itemId", authenticateToken, (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  // Deduct the specified quantity from the inventory count of the item
  connection.query(
    "UPDATE items SET quantity_hq = quantity_hq - ? WHERE id = ?",
    [quantity, itemId],
    (error, results) => {
      if (error) {
        console.error("Error deducting item quantity:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.json({ message: "Item quantity deducted successfully" });
    }
  );
});


module.exports = router;
