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

const ModelComments = require('./models/Comments')
const ModelProjects = require('./models/Projects')
const ModelSubtasks = require('./models/Subtasks')
const ModelTasks = require('./models/Tasks')
const ModelUsers = require('./models/Users')

//ROUTES -> ./routes/
const comments = require('./routes/comments')
const joins = require('./routes/join')
const project = require('./routes/projects')
const subtasks = require('./routes/subtasks')
const tasks = require('./routes/tasks')
const users = require('./routes/users')


//.ENV -> hides informations like connection string
require('dotenv').config()

const path = require('path');
const port = process.env.PORT || 3000

//MIDDLEWARE
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/v1/comments', comments)
app.use('/join', joins)
app.use('/project', project)
app.use('/api/v1/subtasks', subtasks)
app.use('/api/v1/tasks', tasks)
app.use('/api/v1/users', users)

// set the view engine to ejs
app.set('view engine', 'ejs');

// Gestionnaire de route pour la page d'accueil
app.get('/', async (req, res) => {
  if (req.session.authenticated) {
    res.redirect('/projects');
  } else {
    res.redirect('/join');
  }
});

app.get('/projects', async (req, res) => {
  if (req.session.authenticated) {
    try {
      const user = await ModelUsers.findById(req.session.user).populate({
        path: "projects",
        model: ModelProjects
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

app.get('/projects/:id', async (req, res) => {
  if (req.session.authenticated) {
    const projectId = req.params.id;
    const project = await ModelProjects.findById(projectId);
    const user = await ModelUsers.findById(req.session.user);

    const userHasAccess = user.projects.some((userProject) =>
      userProject._id.toString() === projectId.toString()
    );

    if (userHasAccess) {
      res.render(path.join(__dirname, 'public/templates/project'), { user, project });
    } else {
      res.redirect('/projects');
    }
  } else {
    res.redirect('/join');
  }
});

app.get('/projects/:projectid/:taskid', async (req, res) => {
  try {
    if (req.session.authenticated) {

      const projectid = req.params.projectid
      const taskid = req.params.taskid

      const user = await ModelUsers.findById(req.session.user);

      const project = await ModelProjects.findById(projectid);

      const task = await ModelTasks.findById(taskid);
      

      const userHasAccess = user.projects.some((userProject) =>
        userProject._id.toString() === projectid.toString()
      );

      const taskInProject = project.tasks.some((taskProject) =>
        taskProject._id.toString() === taskid.toString()
      );

      if (userHasAccess && taskInProject) {
        res.render(path.join(__dirname, 'public/templates/task'), { user, project, task });
      } else {
        res.redirect('/projects');
      }
    } else {
      res.redirect('/join');
    }
  } catch (error) {
    console.error(error)
  }
});


app.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log("Erreur lors de la déconnexion: ", error)
      res.status(400).redirect('/')
    }
    else {
      console.log("Utilisateur déconnecter")
      res.status(201).redirect('/join?logout=true')
    }
  })
})

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    // Écoute du serveur sur le port spécifié
    app.listen(port, () => {
      console.log(`Le serveur écoute sur le port ${port}`)
      console.log(`---> http://localhost:${port}/ <---`)
      console.log(`CTRL + C to STOP code`)
    })
  } catch (err) {
    console.log(err)
  }
}

start()
module.exports = {
  port
}