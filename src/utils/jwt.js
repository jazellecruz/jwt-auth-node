const jwt = require("jsonwebtoken");
const config = require("../config/config");

const generateAccessToken = (user) => {
  let accessToken = jwt.sign({user: user}, config.ACCESS_SECRET_KEY, { expiresIn: '10s' });
  return accessToken;
}

const generateRefreshToken = (user) => {
  let refreshToken = jwt.sign({user: user}, config.REFRESH_TOKEN_KEY);
  return refreshToken;
}
module.exports = {generateAccessToken, generateRefreshToken}