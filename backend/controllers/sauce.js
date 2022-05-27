const Sauce = require('../models/sauce');
const fs = require('fs');
const {error} = require("console");

// Create Sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: '',
    usersDisliked: '',
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
    /*title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    userId: req.body.userId,
    likes: 0,
    dislikes: 0,
    usersLiked: '',
    usersDisliked: '',*/
  sauce.save()
    .then(() => res.status(201).json({ message: 'Nouvelle sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Get specific Sauce (id)
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id // Methode pour trouver une sauce unique
  }).then(
    sauce => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({ 
        error: error 
      });
    }
  );
};

// Modify Sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      likes: 0,
      dislikes: 0,
      usersLiked: '',
      usersDisliked: '',
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    /*_id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    userId: req.body.userId,
    likes: 0,
    dislikes: 0,
    usersLiked: '',
    usersDisliked: ''
  });*/
  Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }));
};

// Delete Sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
      /*if (!sauce) {
        return res.status(404).json({
          error: new Error('Sauce non trouvée !')
        });
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(400).json({
          error: new Error('Requête non autorisée !')
        });
      }
      Sauce.deleteOne({_id: req.params.id}).then(
        () => {
          res.status(200).json({ 
            message: 'Sauce supprimée !'
          });*/
    })
    .catch(error => res.status(500).json({ error }));
};

// Get all Sauces in database
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then( // Methode renvoie un tableau contenant toutes les sauces dans la base de données
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({ 
        error: error 
      });
    }
  );
};

// Like Or Dislike 
// Un seul like ou dislike par user 
exports.likeOrNot = (req, res, next) => {
  if (req.body.like === 1) {
    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
          .then((sauce) => res.status(200).json({ message: 'Ajout Like' }))
          .catch(error => res.status(400).json({ error }))
  } else if (req.body.like === -1) {
      Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
          .then((sauce) => res.status(200).json({ message: 'Ajout Dislike' }))
          .catch(error => res.status(400).json({ error }))
  } else {
      Sauce.findOne({ _id: req.params.id })
          .then(sauce => {
              if (sauce.usersLiked.includes(req.body.userId)) {
                  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                      .then((sauce) => { res.status(200).json({ message: 'Suppression Like' }) })
                      .catch(error => res.status(400).json({ error }))
              } else if (sauce.usersDisliked.includes(req.body.userId)) {
                  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                      .then((sauce) => { res.status(200).json({ message: 'Suppression Dislike' }) })
                      .catch(error => res.status(400).json({ error }))
              }
          })
          .catch(error => res.status(400).json({ error }))
  }
}