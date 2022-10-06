const express = require('express')
const expressHandlebars = require('express-handlebars')
const data = require('./data.js')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3')

const db =  new sqlite3.Database("my-databas.db")

db.run(`

    CREATE TABLE IF NOT EXISTS books(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,  
        grade INTEGER,
        description TEXT
        )
    
        `)


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

    const query = "SELECT * FROM books ORDER BY id"


    db.all(query, function(error, books){

        if(error){
            console.log(error)

            const model={
                dbError: true
            }
            
        response.render('books.hbs', model)
    
        }else{

       

        const model = {
            books, 
            dbError:false
        }
    
        response.render('books.hbs', model)

    }
    }) 

  
}) 

app.get('/create-books', function(request, response){
    response.render("create-books.hbs")

}) 

app.post("/create-books", function(request, response){
    
    const title = request.body.title
    const grade = request.body.grade
    const description = request.body.description


    const query = "INSERT INTO books (title, grade, description) VALUES (?, ?, ?)"
    const values = [title, grade, description]

    db.run(query, values, function(error){
        if(error){
            console.log(error)
        }else{
            response.redirect("/books/"+this.lastID)
            
        }

    })

   /* const book = {
        title,
        grade,
        description,
        id: data.books.length + 1
    }

    data.books.push(book)*/

    //response.redirect("/books/"+data.books.length)

})

app.get("/update-books/:id", function(request, response){
   
    const id = request.params.id

	const query = "SELECT * FROM books WHERE id = ?"
	const values = [id]

	db.get(query, values, function(error, book){

		if(error){

			console.log(error)

			// TODO: Display error message.

		}else{

			const model = {
				book
			}

			response.render("update-books.hbs", model)

		}

	})



        
    //response.render("update-books.hbs")
        });

 app.post("/update-books/:id", function(request, response){

    const title = request.body.title
    const description = request.body.description
    const id = request.params.id

    const query = 'UPDATE books SET title = ?, description = ? WHERE Id = ?'
    const values = [title, description, id]
    db.run(query, values, (error)=> {
        if(error){
            console.log(error)
        }
            response.redirect("/books/"+id) 
        
    })
})



app.post("/delete-books/:id", function(request, response){

    const id = request.params.id


    const query = "DELETE FROM books WHERE id = ?"
	const values = [id]
	
	db.run(query, values, function(error){
        if(error){
            console.log(error)
        }else{
        response.redirect("/books")
            
        }
	})
    
   

   // const bookIndex = data.books.findIndex(
     //   b => b.id == id
    //)



})

app.get("/books/:id", function(request, response){

    const id = request.params.id


    const query = "SELECT * FROM books WHERE id = ?"
    const values=[id]

    db.get(query, values, function(error, book){
        if(error){
            console.log(error)
        }else{
            const model= {
                book
            }
        
            response.render('book.hbs', model)
        }
    })

   /* const books = data.books.find(m => m.id == id)*/

   
})


app.listen(3000)

