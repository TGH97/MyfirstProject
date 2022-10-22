const express = require('express')
const validations = require('../questions-validations')
const db = require('../questionsDatabase')

const router = express.Router()

router.get('/questions', function(request, response){

    db.getQuestions(function (error, questions) {
        if (error) {
          console.log(error);
    
          const model = {
            dbError: true,
          };
    
          response.render("questions.hbs", model);
        } else {
          const model = {
            questions,
            dbError: false,
        };
    
          response.render("questions.hbs", model);
        }
      });
});


router.get("/questions/:id", function (request, response) {
  const id = request.params.id;

  db.getQuestionsByItsId(id, function (error, question) {
    if (error) {
      error.push("Something went wrong")
      const model = {
        error,
        question,
        answer  
          }
      response.render("/questions/" + id, model)
    } else {
      const model = {
        question
      };

      response.render("question.hbs", model);
    }
  });
});


router.get("/create-questions", function (request, response) {
  if (request.session.isLoggedIn) {
    response.render("create-questions.hbs");
  } else {
    response.redirect("/login");
  }
});

router.post("/create-questions", function (request, response) {
  const question = request.body.question;
  const answer = request.body.answer;

  const errors = validations.getValidationErrorsForQuestions(question, answer);

  if (!request.session.isLoggedIn) {
    errors.push("You have to log in first");
  }

  if (errors.length == 0) {
    
    db.createQuestions(question, answer, function (error, thisId) {
      if (error) {
        errors.push("something went wrong")
        const model={
          errors,
          question,
          answer
        }
        response.render("create-questions.hbs", model)
      } else {
        response.redirect("/questions/" + thisId);
      }
    });
  } else {
    const model = {
      errors,
      question,
      answer
    };
    response.render("create-questions.hbs", model);
  }
});


router.get("/update-questions/:id", function (request, response) {
  const id = request.params.id;

  if (request.session.isLoggedIn) {
    db.getQuestionsByItsId(id, function (error, question) {
      if (error) {
       error.push("something went wrong")
       const model = {
          error,
          question,
          answer
        };
      } else {
        const model = {
          question
        };

        response.render("update-questions.hbs", model);
      }
    });
  } else {
    response.redirect("/login");
  }
});


router.post("/update-questions/:id", function (request, response) {
  const question = request.body.question;
  const answer = request.body.answer;
  const id = request.params.id;

  const errors = validations.getValidationErrorsForQuestions(question, answer);

  if (!request.session.isLoggedIn) {
    errors.push("You have to be Logged In to be able to update this");
  }

  if (errors == 0) {
 
    db.updateQuestionsByItsId(question, answer, id, function (error) {
      if (error) {
        console.log(error);
      }
      response.redirect("/questions/" + id);
    });
  } else {
    const model = {
      question: {
        id,
        question: question,
        answer: answer,
      },
      errors,
    };

    response.render("update-questions.hbs", model);
  }
});

router.post("/delete-questions/:id", function (request, response) {
  const id = request.params.id;
  
  if (request.session.isLoggedIn) {
    db.deleteQuestionByItsId(id, function (error) {
      if (error) {
          error.push("Something went wrong");
          const model = {
              error
          }
      } else {
        response.redirect("/questions");
      }
    });
  } else {
    response.redirect("/login");
  }
});


module.exports = router;