const router = require("express").Router();
const {isUserAuthenticated} = require("../middlewares/auth");

router.get("/", isUserAuthenticated, (req, res) => {
  res.send("Welcome to the secret route!!!");
});

module.exports = router