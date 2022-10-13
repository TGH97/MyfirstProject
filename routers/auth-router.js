const express = require("express");

const router = express.Router();


const adminUsername = "talal";
const adminPassword = "123588";

router.get("/login", function (request, response) {
    response.render("login.hbs");
  });

  
router.post("/login", function (request, response) {
    const enteredUsername = request.body.username;
    const enteredPassword = request.body.password;
  
  
    if (enteredUsername == adminUsername && enteredPassword == adminPassword) {
      request.session.isLoggedIn = true;
      response.redirect("/books");
    } else {
      response.redirect("/login");
    }
  });
  
router.post("/logout", function (request, response) {
    request.session.isLoggedIn = false;
    response.redirect("/");
  });

module.exports = router;
