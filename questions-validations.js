
const MIN_QUESTION_LENGHT = 9;
const MIN_ANSWER_LENGHT = 2;

exports.getValidationErrorsForQuestions = function(question, answer) {
    const validationErrors = [];
    const lastChar = question.charAt(question.length-1);

    if(lastChar!=='?'){
      validationErrors.push("Your question has to end with a question mark");
    }
    
    if (question.length < MIN_QUESTION_LENGHT) {
      validationErrors.push(
        "Title must contain at least " + MIN_QUESTION_LENGHT + " characters"
      );
    }
  
    if (answer.length <= MIN_ANSWER_LENGHT) {
      validationErrors.push(
        "content must contain at least " +
         MIN_ANSWER_LENGHT +
          " characters"
      );
    };
  
    return validationErrors;
  };
  