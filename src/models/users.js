const { db } = require("../db/db");
const bcrypt = require("bcrypt");

const findUserFromDb = async(username, password) => {
  if (!username || !password) { return undefined };

  let foundUser = await db.promise().query("SELECT * FROM users WHERE username = ?", [username]);

  if(!foundUser[0][0]) { return false };

  let isUserMatched = await bcrypt.compare(password, foundUser[0][0].password);

  if(!isUserMatched) { return false };

  return foundUser[0][0].username;

}

module.exports = { findUserFromDb }