const router = require("express").Router();
const { findUserFromDb } = require("../models/users");
const {generateAccessToken, generateRefreshToken} = require("../utils/jwt");

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", async(req, res) => {

  try{
    let foundUser = await findUserFromDb(req.body.username, req.body.password);
    
    if(!foundUser) {
      res.send("No user found.");
      return;
    }

    let token =  generateAccessToken(foundUser)

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true
    });

    res.redirect("/secret");
  } catch(err) {
    console.log(err)
  }
});

module.exports = router