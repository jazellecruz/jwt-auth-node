const router = require("express").Router();
const { findUserFromDb, findUserFromDbWithUsername } = require("../models/users");
const {generateAccessToken, generateRefreshToken, verifyRefreshToken} = require("../utils/jwt");


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

    res.cookie("auth", JSON.stringify(`${accessToken};${refreshToken}`), {
      httpOnly: true,
      secure: true
    })

    res.redirect("/secret");
  } catch(err) {
    console.log("Error in logging user in:", err)
  }

});


router.get("/logout", (req, res) => {

  try{
    res.clearCookie("auth")
    .status(200)
    .send("Successfully logged out! 🤘");
  } catch(err) {
    console.log("Error in logging out user:", err);
  }

});

router.get("/refresh-tokens", async(req, res) => {
  /* 
  HEY YOU! Refresh tokens should be stored and be accessed through an http cookie only >:(
  Since access token is invalid and there is no refresh token present just redirect to login to create new ones 
  */
  if(!req.auth.refresh_token) {
    res.redirect("/login");
    return;
  }

  let decoded = await verifyRefreshToken(req.auth.refresh_token);
  
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

    res.cookie("auth", `${accessToken};${req.auth.refresh_token}`).redirect("/secret");
  } catch(err) {
    console.log("Error in verifying refresh token:", err)
  }

});

module.exports = router