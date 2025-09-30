const express = require('express');
const router = express.Router();
const db = require('../db');
const verificarToken = require('../middleware/auth');

// --- OBTENER TODAS LAS PUBLICACIONES (EL FEED PRINCIPAL) ---
// GET /api/posts
router.get('/', verificarToken, async (req, res) => {
    const currentUserId = req.usuario.id;
    try {
        const query = `
            SELECT
                p.*,
                u.nombre AS autor_nombre,
                u.imagen AS autor_foto_url,
                (SELECT COUNT(*) FROM likes WHERE publicacion_id = p.id) AS likes_count,
                -- ESTA LÍNEA ES LA QUE PROBABLEMENTE TE FALTA --
                (SELECT COUNT(*) FROM comentarios WHERE publicacion_id = p.id) AS comentarios_count,
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


// --- OBTENER SOLO LAS PUBLICACIONES DEL USUARIO AUTENTICADO ---
// GET /api/posts/mis-publicaciones
router.get('/mis-publicaciones', verificarToken, async (req, res) => {
    const usuarioId = req.usuario.id; // Obtenemos el ID del token

    try {
        // La consulta es similar a la del feed, pero con un WHERE para filtrar por usuario
        const query = `
            SELECT
                p.*,
                u.nombre AS autor_nombre,
                u.imagen AS autor_foto_url,
                (SELECT COUNT(*) FROM likes WHERE publicacion_id = p.id) AS likes_count,
                (SELECT COUNT(*) FROM comentarios WHERE publicacion_id = p.id) AS comentarios_count,
                EXISTS(SELECT 1 FROM likes WHERE publicacion_id = p.id AND usuario_id = ?) AS liked_by_user
            FROM
                publicaciones p
            JOIN
                usuarios u ON p.usuario_id = u.id
            WHERE
                p.usuario_id = ? 
            ORDER BY
                p.fecha_creacion DESC;
        `;
        // Pasamos el ID del usuario dos veces a la consulta
        const [posts] = await db.query(query, [usuarioId, usuarioId]);

        const postsWithBooleanLikes = posts.map(post => ({
            ...post,
            liked_by_user: !!post.liked_by_user
        }));

        res.json(postsWithBooleanLikes);
    } catch (error) {
        console.error('Error obteniendo mis publicaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- ELIMINAR UNA PUBLICACIÓN ---
// DELETE /api/posts/:postId
router.delete('/:postId', verificarToken, async (req, res) => {
    const { postId } = req.params;
    const usuarioId = req.usuario.id;

    try {
        // Primero, verificamos que la publicación exista y pertenezca al usuario
        const [rows] = await db.query('SELECT usuario_id FROM publicaciones WHERE id = ?', [postId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Publicación no encontrada.' });
        }

        // ¡Paso de seguridad! Asegurarnos de que el usuario que borra es el dueño
        if (rows[0].usuario_id !== usuarioId) {
            return res.status(403).json({ error: 'No tienes permiso para eliminar esta publicación.' });
        }

        // Si todo está bien, la eliminamos
        await db.query('DELETE FROM publicaciones WHERE id = ?', [postId]);

        res.status(200).json({ message: 'Publicación eliminada correctamente.' });
    } catch (error) {
        console.error('Error al eliminar la publicación:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- CREAR UNA NUEVA PUBLICACIÓN ---
// POST /api/posts
router.post('/', async (req, res) => {
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
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- DAR LIKE A UNA PUBLICACIÓN ---
// POST /api/posts/:postId/like
router.post('/:postId/like', async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;

    try {
        const query = 'INSERT INTO likes (usuario_id, publicacion_id) VALUES (?, ?)';
        await db.query(query, [userId, postId]);
        res.status(201).json({ message: 'Like añadido correctamente.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Ya le has dado like a esta publicación.' });
        }
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
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- OBTENER LOS COMENTARIOS DE UNA PUBLICACIÓN ---
// GET /api/posts/:postId/comentarios
router.get('/:postId/comentarios', async (req, res) => {
    const { postId } = req.params;
    try {
        //Añadimos un JOIN para traer la imagen del autor del comentario
        const query = `
            SELECT 
                c.id,
                c.contenido,
                c.fecha_creacion,
                c.usuario_id AS autor_id,  -- <<< ¡ESTA LÍNEA ES LA SOLUCIÓN!
                u.nombre AS autor_nombre,
                u.imagen AS autor_foto_url
            FROM 
                comentarios c
            JOIN 
                usuarios u ON c.usuario_id = u.id
            WHERE 
                c.publicacion_id = ?
            ORDER BY 
                c.fecha_creacion ASC;
        `;
        const [comments] = await db.query(query, [postId]);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// --- ELIMINAR UN COMENTARIO ---
// DELETE /api/posts/:postId/comentarios/:commentId
router.delete('/:postId/comentarios/:commentId', verificarToken, async (req, res) => {
    const { commentId } = req.params;
    const usuarioId = req.usuario.id;

    try {
        const [rows] = await db.query('SELECT usuario_id FROM comentarios WHERE id = ?', [commentId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Comentario no encontrado.' });
        }
        if (rows[0].usuario_id !== usuarioId) {
            return res.status(403).json({ error: 'No tienes permiso para eliminar este comentario.' });
        }

        await db.query('DELETE FROM comentarios WHERE id = ?', [commentId]);
        res.status(200).json({ message: 'Comentario eliminado correctamente.' });

    } catch (error) {
        console.error('Error al eliminar comentario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;