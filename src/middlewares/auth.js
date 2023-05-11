const jwt = require("jsonwebtoken");
const config = require("../config/config");

const isUserAuthenticated = async(req, res, next) => {
  let accessToken;
   
  // the tokens we parsed and extracted from cookie and attached to req.auth
  if(req.auth.access_token) {
    accessToken = req.auth.access_token
  }

  // authorization through headers
  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    accessToken = req.headers.authorization.split(' ')[1]
  }

  // authorization through x-access-token
  if(req.headers["x-access-token"]) {
    accessToken = req.headers["x-access-token"]
  }

  // if there is no token found from req, token will be undefined
  if(!accessToken) { 
   res.redirect("/login");
   return;
  } 

  try{
    let decoded = jwt.verify(accessToken, config.ACCESS_SECRET_KEY);

    if(!decoded) {
      res.redirect("/login");
      return;
    }

    next();
  } catch(err) {
    if(err.name === "JsonWebTokenError") {
      res.redirect("/login");
      return;
    }
    
    if(err.name === "TokenExpiredError") {
      res.redirect("/refresh-tokens");
      return;
    }

    // use a logging library for err if you want,
    // this is just for demonstration purposes
    console.log("Error in authenticating access token:", err);
  }

}

const extractTokens = (req, res, next) => {
/* the tokens are stored in auth*/
  if(!req.cookies.auth){
    next();
    return;
  }

  try {
    /* the format of the stringed cookie: access_token;refresh_token 
    tokens are separated with a comma. Probably not a good idea but feel
    free to change :)*/
    let extractedTokens = req.cookies.auth.split(";");
    
    /* attach to as auth object to requests for other
    middlewares to use  */
    req.auth = {
      access_token: extractedTokens[0],
      refresh_token: extractedTokens[1] 
    }

    next();
  } catch(err) {
    console.log("Error in extracting token from cookie:", err);
  }

}

module.exports = {isUserAuthenticated, extractTokens}