import React, { useState } from 'react';
// ✅ 1. Importamos los iconos y la función para formatear la fecha
import { FaHeart, FaRegComment, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import apiFetch from '../../api';
import './PostCard.css';

const PostCard = ({ postData, currentUserId }) => {
    const API_URL = import.meta.env.VITE_API_URL;

    // ✅ 2. Añadimos estado para la interactividad
    const [isLiked, setIsLiked] = useState(postData.liked_by_user || false);
    const [likeCount, setLikeCount] = useState(postData.likes_count || 0);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // ✅ 3. Formateamos la fecha a un formato relativo (ej: "hace 5 minutos")
    const timeAgo = formatDistanceToNow(new Date(postData.fecha_creacion), {
        addSuffix: true,
        locale: es,
    });

    // ✅ 4. Esta es la nueva función para manejar el click en "Me gusta"
    const handleLikeClick = async () => {
        // Actualización optimista: Cambia la UI inmediatamente
        const originalLikedState = isLiked;
        const originalLikeCount = likeCount;

        setIsLiked(!isLiked);
        setLikeCount(likeCount + (!isLiked ? 1 : -1));

        try {
            // Llama a la API para registrar el cambio
            if (!isLiked) {
                // Dar Like
                await apiFetch(`/api/posts/${postData.id}/like`, {
                    method: 'POST',
                    body: JSON.stringify({ userId: currentUserId }) // Envía el ID del usuario
                });
            } else {
                // Quitar Like
                await apiFetch(`/api/posts/${postData.id}/like`, {
                    method: 'DELETE',
                    body: JSON.stringify({ userId: currentUserId })
                });
            }
        } catch (error) {
            console.error("Error al actualizar el like:", error);
            // Si la API falla, revierte el cambio en la UI
            setIsLiked(originalLikedState);
            setLikeCount(originalLikeCount);
            alert("No se pudo actualizar el 'Me gusta'. Inténtalo de nuevo.");
        }
    };

    return (
      <div className="post-card card shadow-sm mb-4">
        {/* Encabezado del Post */}
        <div className="post-header card-body d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <img
              src={
                postData.autor_foto_url
                  ? `${API_URL}${postData.autor_foto_url}`
                  : "/petconnect.webp"
              }
              alt={postData.autor_nombre}
              className="post-author-img rounded-circle"
            />
            <div>
              <a href="#" className="post-author-name fw-bold">
                {postData.autor_nombre}
              </a>
              <small className="post-timestamp d-block text-muted">
                {timeAgo}
              </small>
            </div>
          </div>
          <button className="btn btn-light btn-icon">
            <BsThreeDots />
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
            <button
              className={`action-btn ${isLiked ? "liked" : ""}`}
              onClick={handleLikeClick}
            >
              <FaHeart size={20} />
              <span className="ms-2 fw-bold">{likeCount}</span>
            </button>
            <button className="action-btn">
              <FaRegComment size={20} />
              <span className="ms-2 fw-bold">{postData.comentarios_count}</span>
            </button>
          </div>
          <button
            className="action-btn"
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            {isBookmarked ? (
              <FaBookmark size={20} />
            ) : (
              <FaRegBookmark size={20} />
            )}
          </button>
        </div>
      </div>
    );
};

export default PostCard;