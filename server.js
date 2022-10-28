const express = require('express')
const methodOverride = require('method-override')
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')
const logger = require('morgan')
const fs = require('fs')
const cors = require('cors');
// const ejs = require('ejs');
const connectDB = require('./config/database')
const homeRoutes = require('./routes/home')
const templateRoutes = require('./routes/templates')
const editTemplateRoutes = require('./routes/editTemplate')
const createFlAliasRoutes = require('./routes/createFlAlias')
const createTxAliasRoutes = require('./routes/createTxAlias')

dotenv.config({path: './config/.env'})

//Passport config
require('./config/passport')(passport)

connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))

//Body parsing -- allows us to pull information out of a form so it can be sent to the server
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Use forms for put/delete
app.use(methodOverride("_method"))

app.use(logger('dev'))
app.use(cors())

// Sessions -- allows users to stay logged in (can close browser and come back and will still be logged in) and saves sessions to mongo
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )

  //app.use( session({ secret: "keyboard cat", resave: false, saveUninitialized: false, store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, }), }) );


// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use('/', homeRoutes)
app.use('/templates', templateRoutes)
app.use('/editTemplate', editTemplateRoutes)
app.use('/createFlAlias', createFlAliasRoutes)
app.use('/createTxAlias', createTxAliasRoutes)

 
app.listen(process.env.PORT || 3000, ()=>{
    console.log(`Server is running on Port ${process.env.PORT}`)
})    