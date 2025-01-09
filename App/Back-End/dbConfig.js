const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "52.53.237.178",
  user: "admin",
  password: "sfsuorientationlogistics",
  database: "OLLogistics",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

module.exports = connection;
