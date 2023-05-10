const router = require("express").Router();
const { findUserFromDb, findUserFromDbWithUsername } = require("../models/users");
const {generateAccessToken, generateRefreshToken} = require("../utils/jwt");


router.get("/login", (req, res) => {
  res.render("login");
});


router.post("/login", async(req, res) => {

  try{
    let foundUser = await findUserFromDb(req.body.username, req.body.password);

    if(!foundUser) {
      res.send("No user found.");
      return;
    }

    let accessToken = generateAccessToken(foundUser);
    let refreshToken = generateRefreshToken(foundUser);

    let token = JSON.stringify({
      accessToken: accessToken,
      refreshToken: refreshToken
    })

    res.cookie("auth", token, {
      httpOnly: true,
      secure: true
    })

    res.redirect("/secret");
  } catch(err) {
    console.log(err)
  }

});


router.get("/logout", (req, res) => {

  try{
    res.clearCookie("refresh_token")
    .status(200)
    .send("Successfully logged out! 🤘");
  } catch(err) {
    console.log("Error in logging out user:", err);
  }

});

router.post("/refresh-tokens", async(req, res) => {

  /* 
  HEY YOU! Refresh tokens should be stored and be accessed through an http cookie only >:(
  Since access token is invalid and there is no refresh token present just redirect to login to create new ones 
  */
  if(!req.cookies.refresh_token) {
    res.redirect("/login");
    return;
  }

  let decoded = verifyRefreshToken(req.cookies.refresh_token);
  
  /* 
  if failed to decode user from token because of invalid refresh token
  redirect to login to create a new access and refresh token
  */
  if(!decoded){
    res.redirect("/login");
    return;
  }

  try{
    let foundUser = await findUserFromDbWithUsername(decoded);

    if(!foundUser) {
      res.send("Failed to validate user with refresh token");
      return;
    }

    // if all goes well, make a new token and send in it in a new cookie
    let accessToken = generateAccessToken(foundUser);

    res.send({access_token: accessToken});
  } catch(err) {
    console.log(err)
  }

});

module.exports = router