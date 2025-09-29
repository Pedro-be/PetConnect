const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const db = require("../db");

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });


// Subir imagen de perfil
router.post("/perfil", upload.single("imagen"), (req, res) => {
  // Verificamos que se haya subido un archivo
  if (!req.file) {
    return res.status(400).json({ message: "No se proporcionó ninguna imagen." });
  }

  const userId = req.body.userId; // Debe venir del frontend
  
  // Construimos la ruta completa para la URL
  const imagenPath = `/uploads/${req.file.filename}`;

  const sql = "UPDATE usuarios SET imagen = ? WHERE id = ?";
  
  // Usamos la nueva variable `imagenPath` para guardarla en la base de datos
  db.query(sql, [imagenPath, userId], (err, result) => {
    if (err) {
      console.error("Error al actualizar la base de datos:", err);
      return res.status(500).json({ message: "Error al subir imagen" });
    }
    
    // Devolvemos la ruta completa al frontend
    res.json({ message: "Imagen subida correctamente", imagen: imagenPath });
  });
});

// Obtener imagen de perfil de un usuario
//Ahora devolverá la ruta completa que guardamos.
router.get("/perfil/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "SELECT imagen FROM usuarios WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error en el servidor" });
    if (result.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    
    res.json({ imagen: result[0].imagen });
  });
});

module.exports = router;