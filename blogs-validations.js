const MIN_TITLE_LENGHT = 3;
const MIN_CONTENT_LENGHT = 10;

exports.getValidationErrorsForBlogs = function(title, content) {
    const validationErrors = [];
  
    if (title.length < MIN_TITLE_LENGHT) {
      validationErrors.push(
        "Title must contain at least " + MIN_TITLE_LENGHT + " characters"
      );
    }
  
    if (content.length <= MIN_CONTENT_LENGHT) {
      validationErrors.push(
        "content must contain at least " +
         MIN_CONTENT_LENGHT +
          " characters"
      );
    };
  
    return validationErrors;
  };
  