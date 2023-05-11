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

/*
  NOTE TO SELF: STOP using req and res in this function, this aint a middleware its
  a FUNCTION >:(
*/
const verifyRefreshToken = (refreshToken) => {
  if(!refreshToken){
    return false;
  }

  try{
    let decoded = jwt.verify(refreshToken, config.REFRESH_SECRET_KEY);

    if(!decoded){
      return false;
    }

    return decoded.user;
  } catch(err) {
    console.log("Error in verifying refresh tokens:", err);
  }

}

module.exports = {generateAccessToken, generateRefreshToken, verifyRefreshToken}