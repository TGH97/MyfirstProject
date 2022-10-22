const { request } = require("express");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("my-databas.db");



db.run(`

CREATE TABLE IF NOT EXISTS questionS(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,  
    answer TEXT
    )

    `);

    
    exports.getQuestions = function (callback) {
    const query = "SELECT * FROM questions ORDER BY id";
    db.all(query, function (error, questions) {
    callback(error, questions);
    });
    };  
    
    exports.createQuestions = function(question, answer, callback){
    
    const query = "INSERT INTO questions (question, answer) VALUES (?, ?)";
    const values = [question, answer];
    
    db.run(query, values, function (error) {
    callback (error, this.lastID);
    }); 
    };
    
    exports.getQuestionsByItsId=function(id, callback){
    const query = "SELECT * FROM questions WHERE id = ?";
    const values = [id];
    
    db.get(query, values, function (error, question) {
    callback(error, question);
    });
    };
    
    exports.updateQuestionsByItsId=function(question, answer, id, callback){
    const query = "UPDATE questions SET question = ?, answer = ? WHERE Id = ?";
    const values = [question, answer, id];
    
    db.run(query, values, function (error){ 
    callback(error);
    });
    };
    
    exports.deleteQuestionByItsId=function(id, callback){
    const query = "DELETE FROM questions WHERE id = ?";
    const values = [id];
    
    db.run(query, values, function (error) {
    callback(error);
    });
    };
          
