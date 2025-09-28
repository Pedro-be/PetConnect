const db = require("../db");
const path = require("path");

// --- 1. Agregar una nueva mascota ---
const agregarMascota = async (req, res) => {
  try {
    const { nombre, tipo, raza, edad, peso } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;
    const usuario_id = req.usuario.id;

    if (!nombre || !tipo) {
      return res.status(400).json({ message: "Nombre y tipo son requeridos" });
    }

    const [result] = await db.query(
      `INSERT INTO mascotas (nombre, tipo, raza, edad, peso, imagen, usuario_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, tipo, raza, edad || null, peso || null, imagen, usuario_id]
    );

    res.status(201).json({
      message: "Mascota agregada exitosamente",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al agregar mascota",
      error: error.message,
    });
  }
};

// --- 2. Obtener todas las mascotas de un usuario ---
const obtenerMascotas = async (req, res) => {
  try {
    if (!req.usuario || !req.usuario.id) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const [mascotas] = await db.query(
      "SELECT * FROM mascotas WHERE usuario_id = ?",
      [req.usuario.id]
    );

    res.json(mascotas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener mascotas",
      error: error.message,
    });
  }
};

// --- 3. Actualizar una mascota existente ---
const actualizarMascota = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo, raza, edad, peso } = req.body;
    const usuario_id = req.usuario.id;

    const [mascotaActual] = await db.query(
      "SELECT imagen FROM mascotas WHERE id = ? AND usuario_id = ?",
      [id, usuario_id]
    );

    if (mascotaActual.length === 0) {
      return res.status(404).json({ message: "Mascota no encontrada o no pertenece al usuario" });
    }

    const imagen = req.file ? `/uploads/${req.file.filename}` : mascotaActual[0].imagen;

    await db.query(
      `UPDATE mascotas SET 
        nombre = ?, tipo = ?, raza = ?, edad = ?, peso = ?, imagen = ? 
      WHERE id = ? AND usuario_id = ?`,
      [nombre, tipo, raza, edad, peso, imagen, id, usuario_id]
    );

    const [mascotaActualizada] = await db.query("SELECT * FROM mascotas WHERE id = ?", [id]);

    res.json({
      message: "Mascota actualizada exitosamente",
      mascota: mascotaActualizada[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar mascota",
      error: error.message,
    });
  }
};

// En tu archivo de controlador (ej: mascotasController.js)

const eliminarMascota = async (req, res) => {
  try {
    const { id } = req.params; // ID de la mascota desde la URL
    const usuario_id = req.usuario.id; // ID del usuario desde el token

    // Verificamos que la mascota exista y pertenezca al usuario antes de borrarla
    const [result] = await db.query(
      'DELETE FROM mascotas WHERE id = ? AND usuario_id = ?',
      [id, usuario_id]
    );

    // `affectedRows` nos dice si se borró alguna fila.
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Mascota no encontrada o no tienes permiso para eliminarla" });
    }

    res.json({ message: "Mascota eliminada exitosamente" });

  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la mascota",
      error: error.message,
    });
  }
};


// --- 4. Obtener perfil de usuario (lo mantendremos aquí por ahora) ---
const obtenerPerfil = async (req, res) => {
  try {
    const [usuario] = await db.query(
      "SELECT id, nombre, email, telefono, ciudad, direccion, imagen FROM usuarios WHERE id = ?",
      [req.usuario.id]
    );

    if (usuario.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuario[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil" });
  }
};

// --- Exportamos TODAS las funciones en un solo objeto al final ---
module.exports = {
  agregarMascota,
  obtenerMascotas,
  actualizarMascota,
  eliminarMascota,
  obtenerPerfil
};