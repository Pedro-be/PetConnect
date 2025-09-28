import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaCamera, FaVideo } from 'react-icons/fa';
import './CrearPublicacion.css';

const CrearPublicacion = ({ profileImageUrl, userId, onPostCreated }) => {
    const [postText, setPostText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        return () => { if (previewUrl) { URL.revokeObjectURL(previewUrl); }};
    }, [previewUrl]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleMediaButtonClick = (acceptType) => {
        fileInputRef.current.accept = acceptType;
        fileInputRef.current.click();
    };

    const handleRemoveMedia = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const handlePublish = async () => {
        // Doble validación: aunque el padre ya lo garantiza, es buena práctica
        if (!userId) {
            alert("Error: No se ha podido identificar al usuario.");
            return;
        }
        if (!postText && !selectedFile) {
            alert('No puedes crear una publicación vacía.');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('contenido', postText);
        formData.append('usuario_id', userId);
        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/posts', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al publicar.');
            }

            setPostText('');
            setSelectedFile(null);
            setPreviewUrl(null);
            
            // Llama a la función del padre para actualizar el feed
            if (onPostCreated) {
                onPostCreated();
            }

        } catch (error) {
            console.error('Error:', error);
            alert(`Error al publicar: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="crear-publicacion-card">
            <div className="card-body">
                {/* ... tu JSX para el input y la previsualización ... */}
                {/* (No cambia nada en esta parte) */}
                <div className="input-area">
                    <img src={profileImageUrl || '/petconnect.webp'} alt="Tu perfil" className="profile-pic-small" />
                    <input type="text" className="post-input" placeholder="¿Qué está haciendo tu mascota hoy?" value={postText} onChange={(e) => setPostText(e.target.value)} />
                </div>
                {previewUrl && (
                    <div className="preview-container">
                        {selectedFile.type.startsWith('image/') ? (<img src={previewUrl} alt="Previsualización" className="preview-media" />) : (<video src={previewUrl} controls className="preview-media" />)}
                        <button onClick={handleRemoveMedia} className="remove-media-btn">&times;</button>
                    </div>
                )}
                <hr className="separator" />
                <div className="actions-area">
                    <div className="media-buttons">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                        <Button variant="light" className="media-btn" onClick={() => handleMediaButtonClick('image/*')}><FaCamera className="icon" /> Foto</Button>
                        <Button variant="light" className="media-btn" onClick={() => handleMediaButtonClick('video/*')}><FaVideo className="icon" /> Video</Button>
                    </div>
                    <Button className="publish-btn" onClick={handlePublish} disabled={isLoading}>
                        {isLoading ? 'Publicando...' : 'Publicar'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CrearPublicacion;