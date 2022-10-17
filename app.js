const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const booksRouter = require("./routers/books-router");
const blogssRouter = require("./routers/blogs-router");
const authRouter = require("./routers/auth-router")
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
app.use( blogssRouter);
app.use(authRouter);

app.get("/", function (request, response) {
  response.render("start.hbs");
});

app.get("/home", function (request, response) {
  response.render("home.hbs");
});

app.get("/contact", function (request, response) {
  response.render("contact.hbs");
});


app.listen(3000);
