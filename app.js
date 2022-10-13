const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const booksRouter = require("./routers/books-router");
const expressSession = require("express-session");
const SQLiteStore = require('connect-sqlite3')(expressSession);

const { request } = require("express");
const app = express();


app.use(express.static("public"));


app.use(
  expressSession({
    secret: "asjfnasfasfasafc",
    saveUninitialized: false,
    resave: false,
    store: new SQLiteStore()
})

);

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const adminUsername = "talal";
const adminPassword = "123588";

app.use(function (request, response, next) {
  const isLoggedIn = request.session.isLoggedIn;
  response.locals.isLoggedIn = isLoggedIn;
  next();
});

app.engine(
  "hbs",
  expressHandlebars.engine({
    defaultLayout: "main.hbs",
  })
);


app.use( booksRouter);

app.get("/", function (request, response) {
  response.render("start.hbs");
});

app.get("/home", function (request, response) {
  response.render("home.hbs");
});

app.get("/contact", function (request, response) {
  response.render("contact.hbs");
});

app.get("/login", function (request, response) {
  response.render("login.hbs");
});

app.post("/login", function (request, response) {
  const enteredUsername = request.body.username;
  const enteredPassword = request.body.password;


  if (enteredUsername == adminUsername && enteredPassword == adminPassword) {
    request.session.isLoggedIn = true;
    response.redirect("/books");
  } else {
    response.redirect("/login");
  }
});

app.post("/logout", function (request, response) {
  request.session.isLoggedIn = false;
  response.redirect("/");
});



app.listen(3000);
