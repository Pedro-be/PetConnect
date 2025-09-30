import React from 'react';
import { Link } from 'react-router-dom';
import { FaPaw, FaEdit } from 'react-icons/fa';
import './UserSearchResultCard.css';

const UserSearchResultCard = ({ user }) => {
    const API_URL = import.meta.env.VITE_API_URL;

    return (
        <div className="user-card-result">
            <img 
                src={user.foto_perfil_url ? `${API_URL}${user.foto_perfil_url}` : '/petconnect.webp'}
                alt={user.nombre}
                className="user-card-avatar"
            />
            <div className="user-card-info">
                <h5 className="user-card-name">{user.nombre}</h5>
                <p className="user-card-city text-muted">{user.ciudad}</p>
                <div className="user-card-stats">
                    <span><FaPaw /> {user.mascotas_count} Mascotas</span>
                    <span><FaEdit /> {user.publicaciones_count} Publicaciones</span>
                </div>
            </div>
            
        </div>
    );
};

export default UserSearchResultCard;