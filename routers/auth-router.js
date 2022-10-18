const express = require("express");
const bcrypt = require("bcrypt");


const router = express.Router();


const adminUsername = "talal";
const adminPassword = "$2b$10$5P8y97OBgmGAbvUzFNC7Suznd3opGM7cVigJPIR3HJGzQouT68Z12";


router.get("/login", function (request, response) {
    response.render("login.hbs");
  });

  
router.post("/login", function (request, response) {
  const enteredUsername = request.body.username;
  const enteredPassword = request.body.password;

  bcrypt.compare(enteredPassword, adminPassword, function (error, result) {
    if (error) {
      error = "Something went wrong, please try again later";
      const model = {
        error,
      };
      response.render("login.hbs", model);
    } else {
      if (result && enteredUsername == adminUsername) {
        request.session.isLoggedIn = true;
        response.redirect("/home");
      } else {
        error = "Wrong Username or password";
        const model = {
          error,
        };
        response.render("login.hbs", model);
        return;
      }
    }
  });
});

router.post("/logout", function (request, response) {
    request.session.isLoggedIn = false;
    response.redirect("/");
  });

module.exports = router;
