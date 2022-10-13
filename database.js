const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("my-databas.db");

db.run(`

    CREATE TABLE IF NOT EXISTS books(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,  
        grade INTEGER,
        description TEXT
        )
    
        `);

exports.getBooks=function(callback){
    const query = "SELECT * FROM books ORDER BY id";
    db.all(query, function (error, books) {
        callback(error, books);
    });

};   

exports.createBooks = function(title, grade, description, callback){
    const query =
      "INSERT INTO books (title, grade, description) VALUES (?, ?, ?)";
    const values = [title, grade, description];

    db.run(query, values, function (error) {
        callback (error, this.lastID);
        }); 
};

exports.getBooksByItsId=function(id, callback){
    const query = "SELECT * FROM books WHERE id = ?";
    const values = [id];

    db.get(query, values, function (error, book) {
        callback(error, book);
    });
};

exports.updateBooksByItsId=function(title, description, id, callback){
    const query = "UPDATE books SET title = ?, description = ? WHERE Id = ?";
    const values = [title, description, id];

    db.run(query, values, function (error){ //book?
        callback(error);
    });
};

exports.deleteBookByItsId=function(id, callback){
    const query = "DELETE FROM books WHERE id = ?";
    const values = [id];
    
    db.run(query, values, function (error) {
        callback(error);
      });
};



