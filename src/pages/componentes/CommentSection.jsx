import React, { useState, useEffect } from 'react';
import apiFetch from '../../api.js';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import './CommentSection.css';

const CommentSection = ({ postId, currentUser }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;

    // Esta función es la que no está funcionando correctamente
    const fetchComments = async () => {
        setIsLoading(true); // Se asegura de mostrar 'Cargando...'
        try {
            // Verifica que el postId sea válido antes de llamar
            if (!postId) return; 
            const data = await apiFetch(`/api/posts/${postId}/comentarios`);
            setComments(data);
        } catch (error) {
            console.error("Error al cargar comentarios:", error);
        } finally {
            // Esta línea es la que quita el mensaje de "Cargando..."
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const trimmedComment = newComment.trim();
        if (trimmedComment === '' || !currentUser) return;

        // Lógica de actualización optimista
        const tempComment = {
            id: Date.now(),
            autor_nombre: currentUser.nombre,
            autor_foto_url: currentUser.imagen,
            contenido: trimmedComment,
            fecha_creacion: new Date().toISOString(),
            isOptimistic: true,
        };
        
        setComments(prevComments => [...prevComments, tempComment]);
        setNewComment('');

        try {
            await apiFetch(`/api/posts/${postId}/comentarios`, {
                method: 'POST',
                body: JSON.stringify({
                    usuario_id: currentUser.id,
                    contenido: trimmedComment,
                }),
            });
            // Recarga los comentarios del servidor para tener los datos reales
            fetchComments();
        } catch (error) {
            console.error("Error al enviar comentario:", error);
            alert("No se pudo enviar el comentario.");
            setComments(prevComments => prevComments.filter(c => !c.isOptimistic));
        }
    };

    return (
        <div className="comment-section p-3 border-top">
            <form onSubmit={handleCommentSubmit} className="comment-form d-flex align-items-center mb-3">
                <img 
                    src={currentUser.imagen ? `${API_URL}${currentUser.imagen}` : '/petconnect.webp'} 
                    alt="Tu perfil" 
                    className="comment-avatar"
                />
                <input 
                    type="text"
                    className="form-control comment-input"
                    placeholder="Añade un comentario..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button 
                    type="submit" 
                    className="btn btn-link comment-submit-btn" 
                    disabled={!newComment.trim()}
                >
                    Publicar
                </button>
            </form>

            <div className="comment-list">
                {isLoading && <p className="text-muted text-center">Cargando comentarios...</p>}
                {!isLoading && comments.map(comment => (
                    <div key={comment.id} className={`comment d-flex mb-3 ${comment.isOptimistic ? 'optimistic' : ''}`}>
                        <img 
                            src={comment.autor_foto_url ? `${API_URL}${comment.autor_foto_url}` : '/petconnect.webp'} 
                            alt={comment.autor_nombre}
                            className="comment-avatar"
                        />
                        <div className="comment-body">
                            <a href="#" className="comment-author">{comment.autor_nombre}</a>
                            <p className="comment-text mb-0">{comment.contenido}</p>
                            <small className="comment-timestamp text-muted">
                                {formatDistanceToNow(new Date(comment.fecha_creacion), { locale: es })}
                            </small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;