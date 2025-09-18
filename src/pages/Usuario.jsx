import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Usuario() {
    const [imagenPerfil, setImagenPerfil] = useState(null);

    useEffect(() => {
        const obtenerImagenPerfil = async () => {
            try {
                const res = await fetch("http://localhost:5000/obtener-imagen-perfil", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setImagenPerfil(data.imagenUrl);
                }
            } catch (error) {
                console.error("Error al obtener la imagen de perfil:", error);
            }
        };

        obtenerImagenPerfil();
    }, []);

    return (
        <>
            <button type="button" className="btn">
                <Link
                    to="/PerfilUsuario"
                    style={{ color: "#F97316", textDecoration: "none" }}
                >
                    <img 
                        src={imagenPerfil || "/petconnect.webp"} 
                        alt="PetConnect" 
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