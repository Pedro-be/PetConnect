import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Notificaciones from "./notificaciones.jsx";
import Mensajes from "./mensajes.jsx";
import Usuario from "./Usuario.jsx";

// =====================================================================
// Componente de la Barra de Navegación
// =====================================================================
function Cabecera() {
  // Los imports que no se usan aquí han sido eliminados.
  return (
    <>
      <nav className="navbar bg-body-tertiary fixed-top" id="navbar">
        <Container className="d-flex align-items-center justify-content-between">
          <Link to="/" className="navbar-brand">
            <img src="/petconnect.webp" alt="PetConnect" width="33" height="32" />
          </Link>
          <h1 className="navbar-brand mb-0">PetConnect</h1>
          <form className="d-flex rounded-pill mx-auto" role="search" style={{ flex: 1, maxWidth: "500px" }}>
              <input
                className="form-control rounded-pill"
                type="search"
                placeholder="Buscar mascotas, dueños..."
                aria-label="Buscar mascotas, dueños.."
              />
          </form>
          <Notificaciones />
          <Mensajes />
          <Usuario />
        </Container>
      </nav>
      {/* Es posible que este componente Perfil deba ir en otra página, 
          pero por ahora lo dejamos aquí para que funcione como pediste. */}
      <Perfil />
    </>
  );
}

// =====================================================================
// Componente del Perfil de Usuario (Corregido)
// =====================================================================
function Perfil() {
  const [perfil, setPerfil] = useState(null);
  // ✅ 1. Nos aseguramos de tener el estado para el ARRAY de mascotas
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [resPerfil, resMascotas] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/usuario/perfil`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/mascotas`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (resPerfil.ok) {
          const dataPerfil = await resPerfil.json();
          setPerfil(dataPerfil);
        }

        if (resMascotas.ok) {
          const dataMascotas = await resMascotas.json();
          // ✅ Guardamos el array completo
          setMascotas(dataMascotas);
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    obtenerDatos();
  }, []);

  if (!perfil) {
    return (
      <div style={{ marginTop: "100px", marginLeft: "160px" }}>Cargando...</div>
    );
  }

  return (
    <>
      {/* --- CAJA 1: PERFIL DE USUARIO --- */}
      <div
        style={{
          marginTop: "100px",
          marginLeft: "160px",
          width: "262px",
          height: "auto",
          backgroundColor: "#fff",
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ padding: "20px" }}
        >
          <img
            src={
              perfil.imagen
                ? `${import.meta.env.VITE_API_URL}${perfil.imagen}`
                : "/petconnect.webp"
            }
            alt="Foto de perfil"
            className="rounded-circle"
            style={{
              height: "120px",
              width: "120px",
              objectFit: "cover",
            }}
          />
          <h5 className="mt-3 mb-1">{perfil.nombre}</h5>
          <p className="text-muted" style={{ fontSize: "0.9rem" }}>
            {perfil.ciudad}
          </p>

          <div className="mt-2 text-center">
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                color: "#343a40",
              }}
            >
              {mascotas.length}
            </span>
            <p className="text-muted" style={{ fontSize: "0.8rem", margin: 0 }}>
              Mascotas
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* --- CAJA 2: LISTA DE MASCOTAS (código nuevo) --- */}
      {/* ============================================================= */}
      <div
        style={{
          marginTop: "30px",
          marginLeft: "160px",
          width: "262px",
          height: "auto", // La altura se ajustará al contenido
          backgroundColor: "#fff",
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "20px", // Añadimos padding para el contenido
        }}
      >
        <h5
          style={{
            paddingTop: "0", // Ajustado
            marginLeft: "0", // Ajustado
            marginBottom: "15px", // Espacio debajo del título
            fontWeight: "600",
          }}
        >
          Mis Mascotas
        </h5>

        {/* Aquí renderizamos la lista de mascotas */}
        <div>
          {mascotas.length > 0 ? (
            mascotas.map((pet, index) => (
              <div key={pet.id}>
                {/* Contenedor de cada mascota con layout flex */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 0",
                  }}
                >
                  <img
                    src={
                      pet.imagen
                        ? `${import.meta.env.VITE_API_URL}${pet.imagen}`
                        : "/petconnect.webp"
                    }
                    alt={pet.nombre}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "15px",
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: "500" }}>{pet.nombre}</span>
                    <span style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                      {pet.raza}
                    </span>
                  </div>
                </div>
                {/* Línea separadora (si no es el último) */}
                {index < mascotas.length - 1 && (
                  <hr
                    style={{
                      border: "none",
                      borderTop: "1px solid #e9ecef",
                      margin: "0",
                    }}
                  />
                )}
              </div>
            ))
          ) : (
            <p style={{ fontSize: "0.9rem", color: "#6c757d" }}>
              No tienes mascotas agregadas.
            </p>
          )}
        </div>
      </div>
    </>
  );
}


export default Cabecera;