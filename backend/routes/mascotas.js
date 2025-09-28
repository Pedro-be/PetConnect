const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// 1. Importamos el middleware de autenticación UNA SOLA VEZ.
const verificarToken = require('../middleware/auth'); 

// 2. Importamos TODAS las funciones que vamos a usar, incluyendo la de eliminar.
const { 
    obtenerMascotas, 
    agregarMascota, 
    actualizarMascota,
    eliminarMascota // <-- Se añade la función que faltaba
} = require('../controllers/mascotasController');

// 3. Creamos la configuración de 'upload' antes de definir las rutas.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- DEFINICIÓN DE RUTAS ---

// Obtener todas las mascotas del usuario (GET)
router.get('/', verificarToken, obtenerMascotas);

// Agregar una nueva mascota (POST)
router.post('/', verificarToken, upload.single('imagen'), agregarMascota);

// Actualizar una mascota existente (PUT)
router.put(
  '/:id', 
  verificarToken,
  upload.single('imagen'), 
  actualizarMascota
);

// Eliminar una mascota (DELETE)
router.delete(
  '/:id',
  verificarToken,
  eliminarMascota // <-- 4. Usamos la función directamente, sin "mascotasController."
);

module.exports = router;