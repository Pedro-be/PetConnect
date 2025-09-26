const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const db = require("../db");
const { registrarUsuario, loginUsuario, verificarEmail, obtenerPerfil } = require("../controllers/usuariosController");
const verificarToken = require("../middleware/auth");

// Configuración de multer para las imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Rutas de usuarios
router.post("/register", registrarUsuario);
router.post("/login", loginUsuario);
router.get('/check-email', verificarEmail);
router.get("/perfil", verificarToken, obtenerPerfil);

router.put('/actualizar', verificarToken, upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, email, telefono, ciudad, direccion } = req.body;
        const imagen = req.file ? `/uploads/${req.file.filename}` : null;

        const query = `
            UPDATE usuarios 
            SET nombre = ?, 
                email = ?, 
                telefono = ?, 
                ciudad = ?, 
                direccion = ?
                ${imagen ? ', imagen = ?' : ''}
            WHERE id = ?
        `;
        
        const values = imagen 
            ? [nombre, email, telefono, ciudad, direccion, imagen, req.usuario.id]
            : [nombre, email, telefono, ciudad, direccion, req.usuario.id];

        const [result] = await db.query(query, values);

        if (result.affectedRows > 0) {
            res.json({ message: 'Perfil actualizado exitosamente' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
});

module.exports = router;
