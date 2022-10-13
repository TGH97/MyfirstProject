
const MIN_TITLE_LENGHT = 3;
const MIN_DESCRIPTION_LENGHT = 4;


exports.getValidationErrorsForBooks = function(title, grade, description) {
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
  };

  return validationErrors;
};

//two parameters instead of 3
exports.getValidationErrorsForUpdateBooks=function(title, description) {
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
