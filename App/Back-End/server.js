const express = require("express");
const https = require("https"); // Include the https module
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRoutes"); // Updated require statement
const itemsRouter = require("./routes/itemsRoutes"); // Import the product router
const gameRouter = require("./routes/gameRoutes");
const connection = require("./dbConfig"); // Import MySQL connection

const app = express();

require("dotenv").config(); // To load the .env file

const AWS = require("aws-sdk");
// Configure AWS with your access key, secret, and region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create an S3 instance
const s3 = new AWS.S3();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Create the users table if it doesn't exist
connection.query(
  `
  CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tier ENUM('1', '2') NOT NULL DEFAULT '1'
  )
`,
  (err) => {
    if (err) {
      console.error("Error creating Users table:", err);
      return;
    }
    console.log("Users table created successfully");
  }
);

// Create the sessions table if it doesn't exist
connection.query(
  `
  CREATE TABLE IF NOT EXISTS sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  )
`,
  (err) => {
    if (err) {
      console.error("Error creating Sessions table:", err);
      return;
    }
    console.log("Sessions table created successfully");
  }
);

// Create the products table if it doesn't exist
connection.query(
  `
  CREATE TABLE IF NOT EXISTS items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      image VARCHAR(255),
      category VARCHAR(255) NOT NULL,
      location_annex VARCHAR(255),
      quantity_annex INT,
      location_hq VARCHAR(255),
      quantity_hq INT,
      consumible BOOLEAN DEFAULT FALSE
  )
  `,
  (error, results, fields) => {
    if (error) {
      console.error("Error creating products table:", error);
    } else {
      console.log("Products table created successfully");
    }
  }
);

// Create the OLsessions table if it doesn't exist
connection.query(
  `
  CREATE TABLE IF NOT EXISTS OLSessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    type VARCHAR(255) NOT NULL,
    attendees TEXT, 
    checklist JSON,
    status ENUM('NES', 'ES', 'READY') NOT NULL DEFAULT 'NES'
  )
`,
  (err) => {
    if (err) {
      console.error("Error creating Sessions table:", err);
      return;
    }
    console.log("Sessions table created successfully");
  }
);

//CREATE A TABLE NAMED 'history' WITH THE FOLLOWING COLUMNS: id, date, action, user_id, AND THE user_is is a foreign key from the users table
connection.query(
  `
  CREATE TABLE IF NOT EXISTS history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATETIME NOT NULL,
    action VARCHAR(255) NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  )
`,
  (err) => {
    if (err) {
      console.error("Error creating history table:", err);
      return;
    }
    console.log("History table created successfully");
  }
);

connection.query(
  `
  CREATE TABLE IF NOT EXISTS ol_game (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code CHAR(7) NOT NULL,
    progress JSON,
    requests JSON,
  message LONGTEXT,
    tier INT CHECK (tier >= 1 AND tier <= 8)
  )
    
`,
  (err) => {
    if (err) {
      console.error("Error creating ol_game table:", err);
      return;
    }
    console.log("OL Game table created successfully");
  }
);

app.use("/", userRouter); // Update the endpoint to use the imported router middleware
app.use("/", itemsRouter); // Add the product router middleware
app.use("/", gameRouter);

const privateKey = fs.readFileSync("./keycertbot.pem", "utf8");
const certificate = fs.readFileSync("./certificate.pem", "utf8");

const httpsServer = https.createServer(
  {
    key: privateKey,
    cert: certificate,
  },
  app
);

// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "../public/index.html")); // Update the path to your index.html file
// });

httpsServer.listen(PORT, () => {
  console.log(`Server is running on https://sfsulogistics.online:${PORT}`);
});

// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });
