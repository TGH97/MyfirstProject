const express = require('express')
const expressHandlebars = require('express-handlebars')
const data = require('./data.js')
const bodyParser = require('body-parser')

const app = express()


app.engine('hbs', expressHandlebars.engine({
    defaultLayout: 'main.hbs',
}))


app.use(express.static('public'))

app.use(bodyParser.urlencoded({
   extended: false 
}))

app.get('/home', function(request, response){

    response.render('home.hbs')
})  

app.get('/contact', function(request, response){

    response.render('contact.hbs')
}) 

app.get('/', function(request, response){
    response.render('start.hbs')
}) 

app.get('/books', function(request, response){
    const model = {
        books: data.books
    }

    response.render('books.hbs', model)
}) 

app.get('/create-books', function(request, response){
    response.render("create-books.hbs")

}) 

app.post("/create-books", function(request, response){
    
    const title = request.body.title
    const grade = request.body.grade
    const description = request.body.desc

    const book = {
        title,
        grade,
        description,
        id: data.books.length + 1
    }

    data.books.push(book)

    response.redirect("/books/"+data.books.length)

})

app.get("/update-books/:id", function(request, response){
    const id = request.params.id

    const book = data.books.find(
        b => b.id = id
    )

    const model = {
        book
    }

    response.render("update-books.hbs", model)
})

app.post("/update-books/:id", function(request, response){

    const id = request.params.id

    const newTitle = request.body.title
    const newDesc = request.body.desc

    const book = data.books.find(
        b => b.id == id
    )

    book.title=newTitle
    book.description=newDesc

   // response.redirect("/update-books/"+id)
    //response.redirect("/books")
    response.redirect("/books/"+id)



})

app.post("/delete-books/:id", function(request, response){

    const id = request.params.id

    const bookIndex = data.books.findIndex(
        b => b.id == id
    )

    data.books.splice(bookIndex, 1)

    response.redirect("/books")

})

app.get("/books/:id", function(request, response){

    const id = request.params.id

    const books = data.books.find(m => m.id == id)

    const model= {
        book: books,
    }

    response.render('book.hbs', model)
})


app.listen(3000)

