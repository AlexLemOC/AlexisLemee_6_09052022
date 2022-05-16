//bcrpyt permet un cryptage sécurisé
const bcrypt = require('bcrypt');
//jwt permet l'échange sécurisé de jetons (tokens)
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// Creation fonctions signup et login

// Créer compte utilisateur
exports.signup = (req, res, next) => {
  const regexPasswordHard = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  if (regexPasswordHard.test(req.body.password)){
      
      bcrypt.hash(req.body.password, 10)
      .then(hash => {
          const user = new User({
              email: req.body.email,
              password: hash
          });
          user.save()
              .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
              .catch( error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  }
  else {
      res.status(400).json({ message : 'Mot de passe invalide, veuillez mettre au minimum 8 caractères, dont 1 majuscule et un nombre'})
  }
};

// Connexion à un compte utilisateur
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
      .then(user => {
          if(!user) {
              return res.status(401).json({ message: 'Utilisateur non trouvé !'});
          }
          bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                  if (!valid) {
                      return res.status(401).json({ message: 'Mot de passe incorrect !'});
                  }
                  res.status(200).json({
                      userId: user._id,
                      token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };