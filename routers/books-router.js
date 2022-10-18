const express = require('express')
const validations = require('../books-validations')
const db = require('../booksDatabase')

const router = express.Router()


  router.get("/books", function (request, response) {
  
    db.getBooks(function (error, books) {
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

  router.get("/books/:id", function (request, response) {
    const id = request.params.id;
  
    db.getBooksByItsId(id, function (error, book) {
      if (error) {
        error.push("Something went wrong")
        const model = {
          error,
          title,
          description
        }
        response.render("/books/" + id, model)
      } else {
        const model = {
          book,
        };
  
        response.render("book.hbs", model);
      }
    });
  });




  router.get("/create-books", function (request, response) {
    if (request.session.isLoggedIn) {
      response.render("create-books.hbs");
    } else {
      response.redirect("/login");
    }
  });

  router.post("/create-books", function (request, response) {
    const title = request.body.title;
    const grade = parseInt(request.body.grade);
    const description = request.body.description;
  
    const errors = validations.getValidationErrorsForBooks(title, grade, description);
  
     if (!request.session.isLoggedIn) {
       errors.push("You have to log in first");
     }
  
    if (errors.length == 0) {
      
      db.createBooks(title, grade, description, function (error, thisId) {
        if (error) {
          errors.push("something went wrong")
          const model={
            errors,
            title,
            grade,
            description
          }
          response.render("create-books.hbs", model)
        } else {
          response.redirect("/books/" + thisId);
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

  router.get("/update-books/:id", function (request, response) {
    const id = request.params.id;

    if (request.session.isLoggedIn) {
      db.getBooksByItsId(id, function (error, book) {
        if (error) {
         error.push("something went wrong")
         const model = {
            error,
            title,
            description
          };
        } else {
          const model = {
            book
          };
  
          response.render("update-books.hbs", model);
        }
      });
    } else {
      response.redirect("/login");
    }
  });

  router.post("/update-books/:id", function (request, response) {
    const title = request.body.title;
    const description = request.body.description;
    const id = request.params.id;
  
    const errors = validations.getValidationErrorsForUpdateBooks(title, description);
  
    if (!request.session.isLoggedIn) {
      errors.push("You have to be Logged In to be able to update this");
    }
  
    if (errors == 0) {
   
      db.updateBooksByItsId(title, description, id, function (error, book) {
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

  router.post("/delete-books/:id", function (request, response) {
    const id = request.params.id;
  

  
    if (request.session.isLoggedIn) {
      db.deleteBookByItsId(id, function (error) {
        if (error) {
            error.push("Something went wrong");
            const model = {
                error
            }
        } else {
          response.redirect("/books");
        }
      });
    } else {
      response.redirect("/login");
    }
  });

module.exports = router