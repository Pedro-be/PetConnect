import React, { useState } from 'react';
import { FaHeart, FaRegComment, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { BsThreeDots, BsTrash } from 'react-icons/bs';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import apiFetch from '../../api';
import './PostCard.css';
import CommentSection from './CommentSection';

const PostCard = ({ postData, currentUser, showDeleteButton, onDelete }) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [isLiked, setIsLiked] = useState(postData.liked_by_user || false);
    const [likeCount, setLikeCount] = useState(postData.likes_count || 0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [commentsVisible, setCommentsVisible] = useState(false);

    const timeAgo = formatDistanceToNow(new Date(postData.fecha_creacion), {
        addSuffix: true,
        locale: es,
    });

    const handleLikeClick = async () => {
        const originalLikedState = isLiked;
        const originalLikeCount = likeCount;

        setIsLiked(!isLiked);
        setLikeCount(likeCount + (!isLiked ? 1 : -1));

        try {
            const method = !isLiked ? 'POST' : 'DELETE';
            await apiFetch(`/api/posts/${postData.id}/like`, {
                method: method,
                body: JSON.stringify({ userId: currentUser.id }) 
            });
        } catch (error) {
            console.error("Error al actualizar el like:", error);
            setIsLiked(originalLikedState);
            setLikeCount(originalLikeCount);
        }
    };

    return (
    <div className="post-card card shadow-sm mb-4">
        {/* Encabezado del Post (COMPLETO) */}
        <div className="post-header card-body d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
                <img 
                    src={postData.autor_foto_url ? `${API_URL}${postData.autor_foto_url}` : '/petconnect.webp'} 
                    alt={postData.autor_nombre}
                    className="post-author-img rounded-circle"
                />
                <div>
                    <a href="#" className="post-author-name fw-bold">{postData.autor_nombre}</a>
                    <small className="post-timestamp d-block text-muted">{timeAgo}</small>
                </div>
            </div>
            <button className="btn btn-light btn-icon">
                {showDeleteButton && (
                    <button className="btn btn-icon" onClick={() => onDelete(postData.id)}>
                        <BsTrash />
                    </button>
                )}
            </button>
        </div>

        {/* Contenido del Post */}
        {postData.contenido && (
            <div className="post-content card-body pt-0">
                <p className="card-text">{postData.contenido}</p>
            </div>
        )}

        {/* Imagen del Post (si existe) */}
        {postData.media_url && (
            <img 
                src={`${API_URL}${postData.media_url}`} 
                className="post-image" 
                alt="Contenido de la publicación"
            />
        )}

        {/* Acciones (Likes y Comentarios) */}
        <div className="post-actions card-body d-flex justify-content-between align-items-center">
            <div className="d-flex gap-3">
                <button className={`action-btn ${isLiked ? "liked" : ""}`} onClick={handleLikeClick}>
                    <FaHeart size={20} />
                    <span className="ms-2 fw-bold">{likeCount}</span>
                </button>
                <button type="button" className="action-btn" onClick={() => setCommentsVisible(!commentsVisible)}>
                    <FaRegComment size={20} />
                    <span className="ms-2 fw-bold">{postData.comentarios_count}</span>
                </button>
            </div>
        </div>

        {/* Sección de Comentarios */}
        {commentsVisible && (
            <CommentSection
                postId={postData.id}
                currentUser={currentUser}
            />
        )}
    </div>
);
};

export default PostCard;