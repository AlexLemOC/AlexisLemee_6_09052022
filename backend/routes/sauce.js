const express = require('express');
const router = express.Router(); // Implémentation des routes
//const homeController =  require("../controllers/home");
//const uploadController = require("../controllers/upload");

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.get('/', auth, sauceCtrl.getAllSauces); // Renvoie toutes les sauces
router.post('/', auth, multer, sauceCtrl.createSauce); //Enregistre une sauce dans la base de données
router.get('/:id', auth, sauceCtrl.getOneSauce); // Récupération d'une sauce spécifique
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Mettre à jour une sauce existante 
router.delete('/:id', auth, multer, sauceCtrl.deleteSauce); // Supprimer une sauce
router.post ('/:id/like', auth, sauceCtrl.likeOrNot);

module.exports = router;

/*let routes = app => {
    router.get("/", homeController.getHome);
    router.post("/upload", uploadController.uploadFiles);
    router.get("/files", uploadController.getListFiles);
    router.get("/files/:name", uploadController.download);
    return app.use("/", router);
  };
  module.exports = routes;*/