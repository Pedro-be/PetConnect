const express = require('express');
const router = express.Router();
const db = require('../db');
const verificarToken = require('../middleware/auth');

// --- OBTENER TODAS LAS CITAS DEL USUARIO ---
// GET /api/citas
router.get('/', verificarToken, async (req, res) => {
    try {
        const [citas] = await db.query(
            'SELECT c.*, m.nombre as mascota_nombre FROM citas c JOIN mascotas m ON c.mascota_id = m.id WHERE c.usuario_id = ?', 
            [req.usuario.id]
        );
        res.json(citas);
    } catch (error) {
        console.error("Error al obtener citas:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- CREAR UNA NUEVA CITA ---
// POST /api/citas
router.post('/', verificarToken, async (req, res) => {
    const { mascota_id, titulo, tipo_cita, fecha_hora, ubicacion, notas } = req.body;
    try {
        await db.query(
            'INSERT INTO citas (usuario_id, mascota_id, titulo, tipo_cita, fecha_hora, ubicacion, notas) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.usuario.id, mascota_id, titulo, tipo_cita, fecha_hora, ubicacion, notas]
        );
        res.status(201).json({ message: 'Cita creada exitosamente.' });
    } catch (error) {
        console.error("Error al crear la cita:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// ---  RUTA PARA ACTUALIZAR (MODIFICAR) UNA CITA ---
// PUT /api/citas/:citaId
router.put('/:citaId', verificarToken, async (req, res) => {
    const { citaId } = req.params;
    const usuarioId = req.usuario.id;
    const { mascota_id, titulo, tipo_cita, fecha_hora, ubicacion, notas } = req.body;

    try {
        // La consulta SQL incluye "AND usuario_id = ?" por seguridad.
        // Esto asegura que un usuario solo pueda modificar sus propias citas.
        const query = `
            UPDATE citas SET 
                mascota_id = ?, titulo = ?, tipo_cita = ?, fecha_hora = ?, ubicacion = ?, notas = ? 
            WHERE id = ? AND usuario_id = ?;
        `;
        const [result] = await db.query(query, [mascota_id, titulo, tipo_cita, fecha_hora, ubicacion, notas, citaId, usuarioId]);

        // Si no se afectó ninguna fila, significa que la cita no existe o no le pertenece al usuario.
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cita no encontrada o no tienes permiso para modificarla.' });
        }

        res.status(200).json({ message: 'Cita actualizada correctamente.' });
    } catch (error) {
        console.error("Error al actualizar la cita:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


// --- RUTA PARA ELIMINAR UNA CITA ---
// DELETE /api/citas/:citaId
router.delete('/:citaId', verificarToken, async (req, res) => {
    const { citaId } = req.params;
    const usuarioId = req.usuario.id;

    try {
        // Al igual que en la actualización, añadimos "AND usuario_id = ?"
        // para asegurar que solo el dueño pueda borrar la cita.
        const query = 'DELETE FROM citas WHERE id = ? AND usuario_id = ?;';
        const [result] = await db.query(query, [citaId, usuarioId]);

        // Si no se afectó ninguna fila, la cita no existe o no es del usuario.
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cita no encontrada o no tienes permiso para eliminarla.' });
        }

        res.status(200).json({ message: 'Cita eliminada correctamente.' });
    } catch (error) {
        console.error("Error al eliminar la cita:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


module.exports = router;