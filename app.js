'use strict';

const express = require('express');
const app = express();
const port = 3000;

// Gestionnaire de route pour la page d'accueil
app.get('/', (req, res) => {
  res.send('Bienvenue sur votre application Express !');
});

// Écoute du serveur sur le port spécifié
app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}`);
  console.log(`http://localhost:${port}/`);
});