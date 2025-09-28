const express = require('express');
const router = express.Router();
const db = require('../db'); // Tu conexión a la base de datos (pool de mysql2)
const verificarToken = require('../middleware/auth'); // ✅ 1. Importa tu middleware de autenticación

// --- OBTENER TODAS LAS PUBLICACIONES (EL FEED PRINCIPAL) ---
// GET /api/posts
router.get('/', verificarToken, async (req, res) => {
    const currentUserId = req.usuario.id;
    try {
        // ✅ 3. Esta es la nueva consulta SQL
        const query = `
            SELECT
                p.*,
                u.nombre AS autor_nombre,
                u.imagen AS autor_foto_url,
                (SELECT COUNT(*) FROM likes WHERE publicacion_id = p.id) AS likes_count,
                -- Esta subconsulta devuelve TRUE si el usuario actual ha dado like, y FALSE si no.
                EXISTS(SELECT 1 FROM likes WHERE publicacion_id = p.id AND usuario_id = ?) AS liked_by_user
            FROM
                publicaciones p
            JOIN
                usuarios u ON p.usuario_id = u.id
            ORDER BY
                p.fecha_creacion DESC;
        `;
        const [posts] = await db.query(query, [currentUserId]);
        // Convertimos el resultado de liked_by_user (0 o 1) a un booleano (false o true)
        const postsWithBooleanLikes = posts.map(post => ({
            ...post,
            liked_by_user: !!post.liked_by_user
        }));

        res.json(postsWithBooleanLikes);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- CREAR UNA NUEVA PUBLICACIÓN ---
// POST /api/posts
// NOTA: El middleware de multer se debe aplicar a esta ruta en tu archivo server.js
router.post('/', async (req, res) => {
    // Los datos de texto vienen en req.body
    const { usuario_id, contenido } = req.body;
    
    // La información del archivo subido por multer está en req.file
    const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!usuario_id) {
        return res.status(400).json({ error: 'El ID del usuario es requerido.' });
    }

    try {
        const query = `
            INSERT INTO publicaciones (usuario_id, contenido, media_url, fecha_creacion)
            VALUES (?, ?, ?, NOW());
        `;
        const [result] = await db.query(query, [usuario_id, contenido, mediaUrl]);
        
        // Devolvemos un objeto con el ID de la nueva publicación
        res.status(201).json({ 
            message: 'Publicación creada exitosamente',
            newPostId: result.insertId 
        });
    } catch (error) {
        console.error('Error al crear la publicación:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- AÑADIR UN NUEVO COMENTARIO A UNA PUBLICACIÓN ---
// POST /api/posts/:postId/comentarios
router.post('/:postId/comentarios', async (req, res) => {
    const { postId } = req.params;
    const { usuario_id, contenido } = req.body;

    if (!usuario_id || !contenido) {
        return res.status(400).json({ error: 'Faltan datos para crear el comentario.' });
    }

    try {
        const query = 'INSERT INTO comentarios (publicacion_id, usuario_id, contenido) VALUES (?, ?, ?)';
        await db.query(query, [postId, usuario_id, contenido]);
        res.status(201).json({ message: 'Comentario creado exitosamente.' });
    } catch (error) {
        console.error('Error al crear comentario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- DAR LIKE A UNA PUBLICACIÓN ---
// POST /api/posts/:postId/like
router.post('/:postId/like', async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;

    // ✅ --- AÑADE ESTAS LÍNEAS PARA DEPURAR ---
    console.log('--- INTENTO DE DAR LIKE ---');
    console.log('ID de la Publicación:', postId);
    console.log('ID del Usuario recibido en el body:', userId);
    // -----------------------------------------

    try {
        const query = 'INSERT INTO likes (usuario_id, publicacion_id) VALUES (?, ?)';
        await db.query(query, [userId, postId]);
        res.status(201).json({ message: 'Like añadido correctamente.' });
    } catch (error) {
        console.error('Error de base de datos al dar like:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ya le has dado like a esta publicación.' });
        }
        console.error('Error al añadir like:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- QUITAR UN LIKE DE UNA PUBLICACIÓN ---
// DELETE /api/posts/:postId/like
router.delete('/:postId/like', async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;

    try {
        const query = 'DELETE FROM likes WHERE usuario_id = ? AND publicacion_id = ?';
        const [result] = await db.query(query, [userId, postId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Like no encontrado.' });
        }
        res.status(200).json({ message: 'Like eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar like:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;