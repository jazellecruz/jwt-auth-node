const mysql = require("mysql2");
const config = require("../config/config");

const db = mysql.createConnection({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME
});;

const connectToDb = () => {
  db.connect(err => {
    if(err) {
      console.log("Error connecting to database...", err)
    }
    console.log("Database connected...");
  });

}

module.exports = {connectToDb, db} 