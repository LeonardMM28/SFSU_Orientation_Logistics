const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "3.91.71.109",
  user: "admin",
  password: "csc648thelockerroom",
  database: "thelockerroom",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

module.exports = connection;
