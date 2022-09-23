const express = require('express')
const expressHandlebars = require('express-handlebars')

const app = express()
app.engine('hbs', expressHandlebars.engine({
    defaultLayout: 'main.hbs',
}))
app.get('/', function(request, response){
    response.render('start.hbs')
}) 

app.use(
    express.static('public')
)


app.listen(3000)

