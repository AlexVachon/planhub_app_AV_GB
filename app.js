/**
 * Pour installer tous les packages necessaire -> npm install
 */


const express = require('express')
const app = express()

const session = require('express-session')

app.use(session({
  secret: process.env.SESSION_SECRET || "v57UkuLUUejo4yE0AGM8zlqd40dsiLbu",
  cookie: {maxAge: 3600000}, //1 heure
  resave: false,
  saveUninitialized: false
}))

const cookieParser = require('cookie-parser')

const axios = require('axios')

//DB CONNECTION
const connectDB = require('./db/connect')

//ROUTES -> ./routes/
const users = require('./routes/users')
const joins = require('./routes/join')

//.ENV -> hides informations like connection string
require('dotenv').config()

const path = require('path')
const { renderFile } = require('ejs')

const port =  process.env.PORT || 3000




//MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())



// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/api/v1/users', users)
app.use('/join', joins)


// Gestionnaire de route pour la page d'accueil
app.get('/', (req, res) => {
  if (req.session.authenticated)
    res.render(path.join(__dirname, 'public/templates/index'))
  else
    res.redirect('/join')
})

app.get('/logout', (req, res) =>{
  req.session.destroy((error) => {
    if (error){
      console.log("Erreur lors de la déconnexion: ", error)
      res.status(400).redirect('/')
    }
    else{
      console.log("Utilisateur déconnecté")
      console.log(__dirname)
      res.status(201).render(path.join(__dirname, '/public/templates/join'), {message: "Déconnecté avec succès", success: true})
    }
  })
})

const start = async () =>{
  try{
    await connectDB(process.env.MONGO_URI)
    // Écoute du serveur sur le port spécifié
  app.listen(port, () => {
      console.log(`Le serveur écoute sur le port ${port}`)
      console.log(`---> http://localhost:${port}/ <---`)
      console.log(`CTRL + C to STOP code`)
    })
  }catch(err){
    console.log(err)
  }
}

start()
module.exports = {
  port
}