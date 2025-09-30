// routes/medicamentos.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const verificarToken = require('../middleware/auth');

// --- OBTENER TODOS LOS MEDICAMENTOS DEL USUARIO ---
router.get('/', verificarToken, async (req, res) => {
    try {
        const [medicamentos] = await db.query(
            'SELECT m.*, mas.nombre as mascota_nombre FROM medicamentos m JOIN mascotas mas ON m.mascota_id = mas.id WHERE m.usuario_id = ?',
            [req.usuario.id]
        );
        res.json(medicamentos);
    } catch (error) {
        console.error("Error al obtener medicamentos:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- AÑADIR UN NUEVO MEDICAMENTO ---
router.post('/', verificarToken, async (req, res) => {
    const { mascota_id, nombre_medicamento, dosis, frecuencia, fecha_inicio, fecha_fin, notas } = req.body;
    try {
        await db.query(
            'INSERT INTO medicamentos (usuario_id, mascota_id, nombre_medicamento, dosis, frecuencia, fecha_inicio, fecha_fin, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [req.usuario.id, mascota_id, nombre_medicamento, dosis, frecuencia, fecha_inicio, fecha_fin, notas]
        );
        res.status(201).json({ message: 'Medicamento añadido correctamente.' });
    } catch (error) {
        console.error("Error al añadir el medicamento:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- ACTUALIZAR UN MEDICAMENTO EXISTENTE ---
// PUT /api/medicamentos/:medId
router.put('/:medId', verificarToken, async (req, res) => {
    const { medId } = req.params;
    const usuarioId = req.usuario.id;
    const { mascota_id, nombre_medicamento, dosis, frecuencia, fecha_inicio, fecha_fin, notas } = req.body;

    try {
        const query = `
            UPDATE medicamentos SET 
                mascota_id = ?, nombre_medicamento = ?, dosis = ?, frecuencia = ?, 
                fecha_inicio = ?, fecha_fin = ?, notas = ? 
            WHERE id = ? AND usuario_id = ?;
        `;
        const [result] = await db.query(query, [mascota_id, nombre_medicamento, dosis, frecuencia, fecha_inicio, fecha_fin, notas, medId, usuarioId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Medicamento no encontrado o no tienes permiso para modificarlo.' });
        }
        res.status(200).json({ message: 'Medicamento actualizado correctamente.' });
    } catch (error) {
        console.error("Error al actualizar el medicamento:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


// --- ELIMINAR UN MEDICAMENTO ---
// DELETE /api/medicamentos/:medId
router.delete('/:medId', verificarToken, async (req, res) => {
    const { medId } = req.params;
    const usuarioId = req.usuario.id;

    try {
        const query = 'DELETE FROM medicamentos WHERE id = ? AND usuario_id = ?;';
        const [result] = await db.query(query, [medId, usuarioId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Medicamento no encontrado o no tienes permiso para eliminarlo.' });
        }
        res.status(200).json({ message: 'Medicamento eliminado correctamente.' });
    } catch (error) {
        console.error("Error al eliminar el medicamento:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;