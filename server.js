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
const createFlAliasRoutes = require('./routes/createFLAlias')
const createTxAliasRoutes = require('./routes/createTxAlias')

dotenv.config({path: './config/.env'})

//Passport config
require('./config/passport')(passport)

connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(express.json())
app.use(logger('dev'))
app.use(cors())

// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      /*store: MongoStore.create({ mongooseConnection: mongoose.connection,*/
      //mongoUrl: process.env.DB_STRING,
      secret: 'thisisasecret',
      // touchAfter: 24 * 60 * 60 }),
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use('/', homeRoutes)
app.use('/templates', templateRoutes)
app.use('/editTemplate', editTemplateRoutes)
app.use('/createFlAlias', createFlAliasRoutes)
app.use('/createTxAlias', createTxAliasRoutes)

 
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on Port ${process.env.PORT}`)
})    