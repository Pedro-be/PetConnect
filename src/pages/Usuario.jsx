import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Usuario() {
    const [imagenPerfil, setImagenPerfil] = useState(null);

    useEffect(() => {
        // Función para obtener los datos del perfil del usuario
        const obtenerDatosPerfil = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    // Si no hay token, no se hace la petición
                    return;
                }

                // Hacemos la petición al endpoint que devuelve los datos del perfil
                const res = await fetch("http://localhost:5000/api/usuario/perfil", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    // Verificamos si el usuario tiene una imagen de perfil
                    if (data && data.imagen) {
                        // Construimos la URL completa de la imagen
                        setImagenPerfil(`http://localhost:5000${data.imagen}`);
                    }
                } else {
                    console.error("Error al obtener el perfil:", await res.text());
                }
            } catch (error) {
                console.error("Error al obtener la imagen de perfil:", error);
            }
        };

        obtenerDatosPerfil();
    }, []); // El array vacío asegura que se ejecute solo una vez

    return (
        <>
            <button type="button" className="btn">
                <Link
                    to="/PerfilUsuario"
                    style={{ color: "#F97316", textDecoration: "none" }}
                >
                    {/* La imagen de perfil del usuario o una por defecto */}
                    <img 
                        src={imagenPerfil || "/petconnect.webp"} 
                        alt="Foto de perfil" 
                        width="32" 
                        height="32" 
                        style={{
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }}
                    />
                </Link>
            </button>
        </>
    );
}

export default Usuario;