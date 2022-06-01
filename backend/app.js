const express = require ('express');
const mongoose = require('mongoose'); // Facilite les interactions avec la db
const path = require('path');
//const bodyParser = require('body-parser');
const helmet = require("helmet");
const xss = require('xss-clean');
const cors = require("cors");

require("dotenv").config({ path: "./config/.env" }); //Charge la variable d'environnement

// appel du fichier de mongodb qui permet la connection à mongodb
require("./config/db");

const clean = require('xss-clean/lib/xss').clean
 
const cleaned = clean('<script></script>')
// will return "&lt;script>&lt;/script>"



const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// Connection de l'API au cluster de mongoDB
mongoose.connect('mongodb+srv://username01:A01234567@Cluster0.fpais.mongodb.net/Cluster0?retryWrites=true&w=majority', {

  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.error(error));


const app = express(); // Création d'une application express


app.use(helmet());

app.use(xss())

// Middleware appliqué à toutes les routes, permettant l'envoie de requête et d'accéder à l'API 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); //résoud le pb de restriction CrossOrigin pour l'affichage d'image dans Chrome
  next();
});


app.use(express.json());
//app.use(bodyParser.json());
app.use(
  cors()
);

app.use('/images', express.static(path.join(__dirname,'images')));

app.use('/api/auth', userRoutes);

app.use('/api/sauces', sauceRoutes); // Va enregistrer toutes les demandes de api/sauces

module.exports = app; // Donne l'accès depuis les autres fichiers, notamment le serveur Node
