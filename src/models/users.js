const { db } = require("../db/db");
const bcrypt = require("bcrypt");

const findUserFromDb = async(username, password) => {
  /* incase there is no username and password present in req body 
  passed onto the function*/ 
  if (!username || !password) return false;
  
  try{
    let foundUser = await db.promise().query("SELECT * FROM users WHERE username = ?", [username]);

    if(!foundUser[0][0]) return false;

    let isUserMatched = await bcrypt.compare(password, foundUser[0][0].password);

    if(!isUserMatched) return false;
  
    return foundUser[0][0].username;
  } catch(err) {
    console.log("Error in validating user:", err)
  }

}

const findUserFromDbWithUsername = async(username) => {
  try{
    let foundUser = await db.promise().query("SELECT * FROM users WHERE username = ?", [username]);

    if(!foundUser[0][0]) return false;
  
    return foundUser[0][0].username;
  } catch(err) {
    console.log("Error in finding user from database:", err)
  }

}

module.exports = { findUserFromDb, findUserFromDbWithUsername }