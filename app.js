const express = require('express')
const expressHandlebars = require('express-handlebars')
const data = require('./data.js')

const app = express()
app.engine('hbs', expressHandlebars.engine({
    defaultLayout: 'main.hbs',
}))
app.get('/', function(request, response){
    response.render('start.hbs')
}) 

app.get('/movies', function(request, response){
    const model = {
        movies: data.movies
    }

    response.render('movies.hbs', model)
}) 


app.use(
    express.static('public')
)

app.get("/movies/:id", function(request, response){

    const id = request.params.id

    const movie = data.movies.find(m => m.id == id)

    const model= {
        movie: movie,
    }

    response.render('movie.hbs', model)
})


app.listen(3000)

