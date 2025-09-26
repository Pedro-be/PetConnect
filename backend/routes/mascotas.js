const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ✅ #1: Importamos el middleware UNA SOLA VEZ y le damos un nombre.
const verificarToken = require('../middleware/auth'); 

// ✅ #2: Importamos TODAS las funciones que vamos a necesitar del controlador.
const { 
    obtenerMascotas, 
    agregarMascota, 
    actualizarMascota // <-- Faltaba esta función
} = require('../controllers/mascotasController');

// ✅ #3: Creamos la configuración y la variable 'upload' ANTES de usarla.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- AHORA DEFINIMOS TODAS LAS RUTAS ---

// Obtener todas las mascotas del usuario
router.get('/', verificarToken, obtenerMascotas);

// Agregar una nueva mascota
router.post('/', verificarToken, upload.single('imagen'), agregarMascota);

// Actualizar una mascota existente
router.put(
  '/:id', 
  verificarToken, // Usamos el mismo nombre de middleware para consistencia
  upload.single('imagen'), 
  actualizarMascota
);

module.exports = router;