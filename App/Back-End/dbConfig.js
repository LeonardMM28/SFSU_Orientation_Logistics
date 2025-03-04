const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "52.53.237.178",
  user: "admin",
  password: "sfsuorientationlogistics",
  database: "OLLogistics",
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
    connection.release();
  }
});

module.exports = pool;
