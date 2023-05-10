const router = require("express").Router();
const {isUserAuthenticated} = require("../middlewares/auth");

router.get("/secret", isUserAuthenticated, (req, res) => {
  res.render("secret");
});

module.exports = router