const jwt = require("jsonwebtoken");
const config = require("../config/config");

const isUserAuthenticated = async(req, res, next) => {
  let token;
   
  // authorization through cookies
  if(req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  // authorization through headers
  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(' ')[1]
  }

  // authorization through x-access-token
  if(req.headers["x-access-token"]) {
    token = req.headers["x-access-token"]
  }

  // if there is no token found from req, token will be undefined
  if(!token) { 
   res.redirect("/login"); 
   return;
  } 

  try{
    let decoded = jwt.verify(token, config.ACCESS_SECRET_KEY);

    if(!decoded) {
      res.redirect("/login");
      return;
    }

    next();
  } catch(err) {
    console.log(err)
  }

}

module.exports = {isUserAuthenticated}