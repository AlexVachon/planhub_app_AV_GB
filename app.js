

const express = require('express')

//DB CONNECTION
const connectDB = require('./db/connect')

//ROUTES -> ./routes/
const users = require('./routes/users')

//.ENV -> hides informations like connection string
require('dotenv').config()

const path = require('path')
const app = express()
const port = 3000

//MIDDLEWARE
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))


app.use('/api/v1/users', users)




// Gestionnaire de route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/templates/index.html'))
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