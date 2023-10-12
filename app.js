/**
 * Pour installer tous les packages necessaire -> npm install
 */


const express = require('express')
const app = express()

const session = require('express-session')

app.use(session({
  name: 'connect.sid',
  secret: 'votre_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'Lax', 
      maxAge: 3600000,
  }
}));
const cookieParser = require('cookie-parser')

//DB CONNECTION
const connectDB = require('./db/connect')

//MODÈLES -> ./models/
const ModelUsers = require('./models/Users')
const ModelProjects = require('./models/Projects')

//ROUTES -> ./routes/
const users = require('./routes/users')
const joins = require('./routes/join')
const taches = require('./routes/taches')
const project = require('./routes/projects')

//.ENV -> hides informations like connection string
require('dotenv').config()

const path = require('path')

const port =  process.env.PORT || 3000




//MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/v1/users', users)
app.use('/join', joins)
app.use('/project', project)
app.use('/:projet', taches)

// set the view engine to ejs
app.set('view engine', 'ejs');


// Gestionnaire de route pour la page d'accueil
app.get('/', async (req, res) => {
  if (req.session.authenticated) {
    try {
      const user = await ModelUsers.findById(req.session.user).populate({
        path : "projects", 
        model : ModelProjects
    });
      res.render(path.join(__dirname, 'public/templates/index'), { user });
    } catch (err) {
      console.log("Erreur lors de la recherche de l'utilisateur avec l'ID : " + req.session.user, err);
      res.status(500).redirect('/join');
    }
  } else {
    res.redirect('/join');
  }
});

app.get('/logout', (req, res) =>{
  req.session.destroy((error) => {
    if (error){
      console.log("Erreur lors de la déconnexion: ", error)
      res.status(400).redirect('/')
    }
    else{
      console.log("Utilisateur déconnecter")
      console.log(__dirname)
      res.status(201).redirect('/join')
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