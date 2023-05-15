const jwt = require("jsonwebtoken");
const config = require("../config/config");

const generateAccessToken = (user) => {
  try{
    let accessToken = jwt.sign({user: user}, config.ACCESS_SECRET_KEY, { expiresIn: '10s' });
    return accessToken;
  } catch(err) {
    console.log("Error in generating access token:", err)
  }
}

const generateRefreshToken = (user) => {
  try{
    let refreshToken = jwt.sign({user: user}, config.REFRESH_SECRET_KEY, { expiresIn: "7d" });
    return refreshToken;
  } catch(err) {
    console.log("Error in generating refresh token:", err)
  }
}

const verifyRefreshToken = (refreshToken) => {
  if(!refreshToken){
    return false;
  }

  try{
    let decoded = jwt.verify(refreshToken, config.REFRESH_SECRET_KEY);
    console.log(decoded)
    if(!decoded){
      return false;
    }

    return decoded.user;
  } catch(err) {
    console.log("Error in verifying refresh tokens:", err);
  }

}

class User {
  constructor(accessToken, refreshToken) {
    this.access_token = accessToken || null;
    this.refresh_token = refreshToken || null
  }

  hasAccessToken() {
    /* Using double logical NOT operator ensures we get the
    correct boolean when checking for tokens*/
    return !!this.access_token
  }

  hasRefreshToken() {
    return !!this.refresh_token
  }
}

module.exports = {generateAccessToken, generateRefreshToken, verifyRefreshToken, User}