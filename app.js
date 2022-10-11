const express = require("express");
const expressHandlebars = require("express-handlebars");
const data = require("./data.js");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const expressSession = require("express-session");
const { request } = require("express");
const SQLiteStore = require('connect-sqlite3')(expressSession);

const MIN_TITLE_LENGHT = 3;
MIN_DESCRIPTION_LENGHT = 5;

const db = new sqlite3.Database("my-databas.db");

db.run(`

    CREATE TABLE IF NOT EXISTS books(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,  
        grade INTEGER,
        description TEXT
        )
    
        `);

const app = express();

app.use(
  expressSession({
    secret: "asjfnasfasfasafc",
    saveUninitialized: false,
    resave: false,
    store: new SQLiteStore()
})

);

const adminUsername = "talal";
const adminPassword = "123588";

app.engine(
  "hbs",
  expressHandlebars.engine({
    defaultLayout: "main.hbs",
  })
);

app.use(express.static("public"));

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

app.get("/", function (request, response) {
  response.render("start.hbs");
});

app.get("/home", function (request, response) {
  response.render("home.hbs");
});

app.get("/contact", function (request, response) {
  response.render("contact.hbs");
});

app.get("/books", function (request, response) {
  const query = "SELECT * FROM books ORDER BY id";

  db.all(query, function (error, books) {
    if (error) {
      console.log(error);

      const model = {
        dbError: true,
      };

      response.render("books.hbs", model);
    } else {
      const model = {
        books,
        dbError: false,
      };

      response.render("books.hbs", model);
    }
  });
});

app.get("/create-books", function (request, response) {
  if (request.session.isLoggedIn) {
    response.render("create-books.hbs");
  } else {
    response.redirect("/login");
  }
});

function getValidationErrorsForBooks(title, grade, description) {
  const validationErrors = [];

  if (title.length < MIN_TITLE_LENGHT) {
    validationErrors.push(
      "Title must contain at least " + MIN_TITLE_LENGHT + " characters"
    );
  }

  if (isNaN(grade)) {
    validationErrors.push("Grade must be a valid number.");
  } else if (grade < 0) {
    validationErrors.push("Grade can't be negative.");
  } else if (grade > 10) {
    validationErrors.push("Grade can't greater than 10.");
  }

  if (description.length <= MIN_DESCRIPTION_LENGHT) {
    validationErrors.push(
      "description must contain at least " +
        MIN_DESCRIPTION_LENGHT +
        " characters"
    );
  }

  return validationErrors;
}

//two parameters instead of 3
function getValidationErrorsForUpdateBooks(title, description) {
  const validationErrors = [];

  if (title.length < MIN_TITLE_LENGHT) {
    validationErrors.push(
      "Title must contain at least " + MIN_TITLE_LENGHT + " characters"
    );
  }

  if (description.length <= MIN_DESCRIPTION_LENGHT) {
    validationErrors.push(
      "description must contain at least " +
        MIN_DESCRIPTION_LENGHT +
        " characters"
    );
  }

  return validationErrors;
}


app.post("/create-books", function (request, response) {
  const title = request.body.title;
  const grade = parseInt(request.body.grade);
  const description = request.body.description;

  const errors = getValidationErrorsForBooks(title, grade, description);

  if (!request.session.isLoggedIn) {
    errors.push("You have to log in first");
  }

  if (errors == 0) {
    const query =
      "INSERT INTO books (title, grade, description) VALUES (?, ?, ?)";
    const values = [title, grade, description];

    db.run(query, values, function (error) {
      if (error) {
        console.log(error);
      } else {
        response.redirect("/books/" + this.lastID);
      }
    });
  } else {
    const model = {
      errors,
      title,
      grade,
      description,
    };
    response.render("create-books.hbs", model);
  }
});

app.get("/update-books/:id", function (request, response) {
  const id = request.params.id;

  const query = "SELECT * FROM books WHERE id = ?";
  const values = [id];

  if (request.session.isLoggedIn) {
    db.get(query, values, function (error, book) {
      if (error) {
        console.log(error);

        // TODO: Display error message.
      } else {
        const model = {
          book,
        };

        response.render("update-books.hbs", model);
      }
    });
  } else {
    response.redirect("/login");
  }
});

app.post("/update-books/:id", function (request, response) {
  const title = request.body.title;
  const description = request.body.description;
  const id = request.params.id;

  const errors = getValidationErrorsForUpdateBooks(title, description);

  if (!request.session.isLoggedIn) {
    errors.push("You have to be Logged In to be able to update this");
  }

  if (errors == 0) {
    const query = "UPDATE books SET title = ?, description = ? WHERE Id = ?";
    const values = [title, description, id];
    db.run(query, values, function (error, book) {
      if (error) {
        console.log(error);
      }
      response.redirect("/books/" + id);
    });
  } else {
    const model = {
      book: {
        id,
        title: title,
        description: description,
      },
      errors,
    };

    response.render("update-books.hbs", model);
  }
});

app.post("/delete-books/:id", function (request, response) {
  const id = request.params.id;

  const query = "DELETE FROM books WHERE id = ?";
  const values = [id];

  if (request.session.isLoggedIn) {
    db.run(query, values, function (error) {
      if (error) {
        console.log(error);
      } else {
        response.redirect("/books");
      }
    });
  } else {
    response.redirect("/login");
  }
});

app.get("/books/:id", function (request, response) {
  const id = request.params.id;

  const query = "SELECT * FROM books WHERE id = ?";
  const values = [id];

  db.get(query, values, function (error, book) {
    if (error) {
      console.log(error);
    } else {
      const model = {
        book,
      };

      response.render("book.hbs", model);
    }
  });
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
