/**
 * Pour installer tous les packages necessaire -> npm install
 */


const express = require('express')
const axios = require('axios')

//DB CONNECTION
const connectDB = require('./db/connect')

//ROUTES -> ./routes/
const users = require('./routes/users')

//.ENV -> hides informations like connection string
require('dotenv').config()

const path = require('path')
const app = express()
const port =  process.env.PORT || 3000

//Session
var session = require('express-session')
const { renderFile } = require('ejs')

app.use(session({
  secret: 'mysecret',
  cookie: {maxAge: 3600000}, //1 heure
  resave: false,
  saveUninitialized: false
}))

//MIDDLEWARE
app.use(express.json())

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')))

// API urls routes:
app.use('/api/v1/users', users)


// Gestionnaire de route pour la page d'accueil
app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'public/templates/index'))
})

// Gestionnaire de route pour la création d'un compte / connexion
app.get('/account/join' ,(req, res) => {
    res.render(path.join(__dirname, 'public/templates/join'))
})

app.post('/account/join/login', (req, res) => {
    const {connect_email, connect_password} = req.body

    const userData = {
      user_email : connect_email,
      user_password: connect_password
    }
    axios.post(`http://localhost:${port}/api/v1/users/connect`, userData)
    .then( response => {
      console.log(response.data)
    })
    .catch(error => {
      console.log(error)
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