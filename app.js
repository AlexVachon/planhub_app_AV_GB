
const express = require('express');

//Access all methods in the mongoDB.js file
const db = require('./mongoDB')

const users = require('./routes/users')

const path = require('path');
const app = express();
const port = 3000;

//middleware
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/v1/users', users)




// Gestionnaire de route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/templates/index.html'));
});

// Écoute du serveur sur le port spécifié
app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}`);
  console.log(`---> http://localhost:${port}/ <---`);
  console.log(`CTRL + C to STOP code`);
});