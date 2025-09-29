import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from './componentes/PostCard';
import Sidebar from './Sidebar';
import apiFetch from '../api';
import { FaPaw } from 'react-icons/fa';
import './MisPublicaciones.css';

const MisPublicaciones = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtenemos los datos del usuario y sus publicaciones en paralelo
                const [userData, myPosts] = await Promise.all([
                    apiFetch('/api/usuario/perfil'),
                    apiFetch('/api/posts/mis-publicaciones')
                ]);
                setCurrentUser(userData);
                setPosts(myPosts);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDeletePost = async (postId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
            try {
                await apiFetch(`/api/posts/${postId}`, { method: 'DELETE' });
                setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
            } catch (err) {
                alert(`Error al eliminar la publicación: ${err.message}`);
            }
        }
    };

    if (loading) return <div>Cargando tus publicaciones...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    return (
      <div className="mis-publicaciones-page">
        <Sidebar />

        {/* Área de contenido principal que ocupa el espacio restante */}
        <main className="content-area">
          <header className="page-header">
            <div>
                <h2 className="page-title">Mis Publicaciones</h2>
                <p className="page-subtitle">Aquí puedes ver y gestionar todas tus publicaciones.</p>
            </div>
          </header>

          {/* Lógica para mostrar las publicaciones o el "empty state" */}
          {posts.length > 0 ? (
            <div className="posts-grid">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  postData={post}
                  currentUser={currentUser}
                  onDelete={handleDeletePost}
                  showDeleteButton={true}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FaPaw className="empty-state-icon" />
              <h3>No has compartido nada todavía</h3>
              <p>¡Tu próxima gran aventura está a una foto de distancia!</p>
              <button
                className="btn mt-2"
                style={{
                  backgroundColor: "#F97316",
                  color: "white",
                }}
                onClick={() => navigate("/header")}
              >
                Crear primera publicación
              </button>
            </div>
          )}
        </main>
      </div>
    );
};

export default MisPublicaciones;