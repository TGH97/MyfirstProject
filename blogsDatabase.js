
const { request } = require("express");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("my-databas.db");

db.run(`

CREATE TABLE IF NOT EXISTS blogs(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,  
    content TEXT
    )

`);

exports.getBlogs = function (callback) {
const query = "SELECT * FROM blogs ORDER BY id";
db.all(query, function (error, blogs) {
callback(error, blogs);
});
};  

exports.createBlogs = function(title, content, callback){

const query = "INSERT INTO blogs (title, content) VALUES (?, ?)";
const values = [title, content];

db.run(query, values, function (error) {
callback (error, this.lastID);
}); 
};

exports.getBlogsByItsId=function(id, callback){
const query = "SELECT * FROM blogs WHERE id = ?";
const values = [id];

db.get(query, values, function (error, blog) {
callback(error, blog);
});
};

exports.updateBlogsByItsId=function(title, content, id, callback){
const query = "UPDATE blogs SET title = ?, content = ? WHERE Id = ?";
const values = [title, content, id];

db.run(query, values, function (error){ 
callback(error);
});
};

exports.deleteBlogByItsId=function(id, callback){
const query = "DELETE FROM blogs WHERE id = ?";
const values = [id];

db.run(query, values, function (error) {
callback(error);
});
};
