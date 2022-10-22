const express = require('express')
const validations = require('../blogs-validations')
const db = require('../blogsDatabase')

const router = express.Router()


router.get("/blogs", function (request, response) {
  
    db.getBlogs(function (error, blogs) {
      if (error) {
        console.log(error);
  
        const model = {
          dbError: true,
        };
  
        response.render("blogs.hbs", model);
      } else {
        const model = {
            blogs,
          dbError: false,
      };
  
        response.render("blogs.hbs", model);
      }
    });
  });

  router.get("/blogs/:id", function (request, response) {
    const id = request.params.id;
  
    db.getBlogsByItsId(id, function (error, blog) {
      if (error) {
        error.push("Something went wrong")
        const model = {
          error,
          title,
          content  
            }
        response.render("/blogs/" + id, model)
      } else {
        const model = {
            blog
        };
  
        response.render("blog.hbs", model);
      }
    });
  });

  router.get("/create-blogs", function (request, response) {
    if (request.session.isLoggedIn) {
      response.render("create-blogs.hbs");
    } else {
      response.redirect("/login");
    }
  });

  router.post("/create-blogs", function (request, response) {
    const title = request.body.title;
    const content = request.body.content;
  
    const errors = validations.getValidationErrorsForBlogs(title, content);
  
    if (!request.session.isLoggedIn) {
      errors.push("You have to log in first");
    }
  
    if (errors.length == 0) {
      
      db.createBlogs(title, content, function (error, thisId) {
        if (error) {
          errors.push("something went wrong")
          const model={
            errors,
            title,
            content
          }
          response.render("create-blogs.hbs", model)
        } else {
          response.redirect("/blogs/" + thisId);
        }
      });
    } else {
      const model = {
        errors,
        title,
        content
      };
      response.render("create-blogs.hbs", model);
    }
  });

  router.get("/update-blogs/:id", function (request, response) {
    const id = request.params.id;

    if (request.session.isLoggedIn) {
      db.getBlogsByItsId(id, function (error, blog) {
        if (error) {
         error.push("something went wrong")
         const model = {
            error,
            title,
            content
          };
        } else {
          const model = {
            blog
          };
  
          response.render("update-blogs.hbs", model);
        }
      });
    } else {
      response.redirect("/login");
    }
  });

  router.post("/update-blogs/:id", function (request, response) {
    const title = request.body.title;
    const content = request.body.content;
    const id = request.params.id;
  
    const errors = validations.getValidationErrorsForBlogs(title, content);
  
    if (!request.session.isLoggedIn) {
      errors.push("You have to be Logged In to be able to update this");
    }
  
    if (errors == 0) {
   
      db.updateBlogsByItsId(title, content, id, function (error, blog) {
        if (error) {
          console.log(error);
        }
        response.redirect("/blogs/" + id);
      });
    } else {
      const model = {
        blog: {
          id,
          title: title,
          content: content,
        },
        errors,
      };
  
      response.render("update-blogs.hbs", model);
    }
  });

  router.post("/delete-blogs/:id", function (request, response) {
    const id = request.params.id;
  
  
    if (request.session.isLoggedIn) {
      db.deleteBlogByItsId(id, function (error) {
        if (error) {
            error.push("Something went wrong");
            const model = {
                error
            }
        } else {
          response.redirect("/blogs");
        }
      });
    } else {
      response.redirect("/login");
    }
  });

module.exports = router
