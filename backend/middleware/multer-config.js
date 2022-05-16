const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    // Indique à multer dans quel dossier engistrer les fichiers
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        callback(null, Date.now() + '.' + extension);
    } // Indique à multer de remplacer le nom d'origine par un timestamp 
});
// Importation de multer et indique qu'on gère uniquement les téléchargements de fichiers image
module.exports = multer({storage:storage}).single('image');