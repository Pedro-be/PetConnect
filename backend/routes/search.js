// routes/search.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const verificarToken = require('../middleware/auth');

router.get('/', verificarToken, async (req, res) => {
    const queryTerm = req.query.q;
    const currentUserId = req.usuario.id;

    if (!queryTerm) {
        return res.json({ usuarios: [], publicaciones: [] });
    }

    try {
        const searchTerm = `%${queryTerm}%`;

        // Búsqueda de Usuarios
        const userSearchQuery = `
            SELECT 
                u.id, u.nombre, u.ciudad, u.imagen as foto_perfil_url,
                (SELECT COUNT(*) FROM mascotas WHERE usuario_id = u.id) as mascotas_count,
                (SELECT COUNT(*) FROM publicaciones WHERE usuario_id = u.id) as publicaciones_count
            FROM usuarios u
            WHERE u.nombre LIKE ?;
        `;

        // Búsqueda de Publicaciones
        const postSearchQuery = `
            SELECT
                p.*,
                u.nombre AS autor_nombre,
                u.imagen AS autor_foto_url,
                (SELECT COUNT(*) FROM likes WHERE publicacion_id = p.id) AS likes_count,
                (SELECT COUNT(*) FROM comentarios WHERE publicacion_id = p.id) AS comentarios_count,
                EXISTS(SELECT 1 FROM likes WHERE publicacion_id = p.id AND usuario_id = ?) AS liked_by_user
            FROM publicaciones p
            JOIN usuarios u ON p.usuario_id = u.id
            /* ✅ 1. La consulta ahora busca en el contenido O en el nombre del autor */
            WHERE p.contenido LIKE ? OR u.nombre LIKE ?
            ORDER BY p.fecha_creacion DESC;
        `;
        
        const [userResults] = await db.query(userSearchQuery, [searchTerm]);
        // Hay que pasar el término de búsqueda dos veces para la nueva consulta
        const [postResults] = await db.query(postSearchQuery, [currentUserId, searchTerm, searchTerm]);

        const postsWithBooleanLikes = postResults.map(post => ({
            ...post,
            liked_by_user: !!post.liked_by_user
        }));
        
        res.json({
            usuarios: userResults,
            publicaciones: postsWithBooleanLikes
        });

    } catch (error) {
        console.error("Error en la búsqueda avanzada:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;