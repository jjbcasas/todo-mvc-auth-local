// requiring express, express is what we are using tp build our api, it handles everything between the request and response
const express = require('express')
// initializing express by wrapping it into app
const app = express()
//requiring mongoose to connect to mongodb. helps us interact with our db, helps us do with our model and helps us connect a bit easier
const mongoose = require('mongoose')
// for authentication or login. the package that helps us handle our authentication. passport has diff strategies for any type of login access you want to do.
const passport = require('passport')
//to make a session for our users to stay logged in and then store our session info in our mongo DB, , express-session creates the cookie, mongostore stores the session object in the db.
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
//for pop-up msg or errors when logging in or verification
const flash = require('express-flash')
//helps us log all the stuff thats happening, to see all the request thats coming through
const logger = require('morgan')
//connecting our server to the db from the config folder with a database file
const connectDB = require('./config/database')
//routes
const mainRoutes = require('./routes/main')
const todoRoutes = require('./routes/todos')

//telling express to use the environment variable, and putting the file path specifically to know where to go find the environment variables 
require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)

connectDB()
//using ejs for our views
app.set('view engine', 'ejs')
//public folder
app.use(express.static('public'))
//like a body parser, so we can pull something from the request
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//setting up morgan to run and log everything
app.use(logger('dev'))
// Sessions
//letting our app use the session, and have some structure and put it into our DB
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  
// Passport middleware
//we are letting it know passport is handling our authentication and...
app.use(passport.initialize())
//we are going to use session along with passport
app.use(passport.session())

//setting up the flash alert if there's error in our verification
app.use(flash())
  
app.use('/', mainRoutes)
app.use('/todos', todoRoutes)
 
app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    