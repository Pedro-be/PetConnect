import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Notificaciones from "./notificaciones.jsx";
import Mensajes from "./mensajes.jsx";
import Usuario from "./Usuario.jsx";
import CrearPublicacion from './componentes/CrearPublicacion.jsx';
import PostCard from './componentes/PostCard.jsx'; // ✅ 1. Importamos un nuevo componente para mostrar los posts

// =====================================================================
// Componente de la Barra de Navegación (Sin cambios)
// =====================================================================
function Cabecera() {
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
      <Perfil />
    </>
  );
}

// =====================================================================
// Componente del Perfil de Usuario (¡Actualizado!)
// =====================================================================
function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [posts, setPosts] = useState([]); // ✅ 2. Añadimos estado para guardar las publicaciones

  // ✅ 3. Creamos una función reutilizable para obtener las publicaciones
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error al obtener las publicaciones:", error);
    }
  };

  useEffect(() => {
    const obtenerDatosIniciales = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Peticiones de perfil y mascotas
        const [resPerfil, resMascotas] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/usuario/perfil`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${import.meta.env.VITE_API_URL}/api/mascotas`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (resPerfil.ok) setPerfil(await resPerfil.json());
        if (resMascotas.ok) setMascotas(await resMascotas.json());
        
      } catch (error) {
        console.error("Error al obtener los datos iniciales:", error);
      }
    };

    obtenerDatosIniciales();
    fetchPosts(); // ✅ 4. Obtenemos las publicaciones al cargar el componente
  }, []);

  // ✅ 5. Creamos la función para pasarla como prop. Se ejecutará cuando se cree un post.
  const handlePostCreated = () => {
    fetchPosts(); // Simplemente volvemos a pedir las publicaciones para actualizar la lista
  };

  if (!perfil) {
    return <div style={{ marginTop: "100px", marginLeft: "160px" }}>Cargando...</div>;
  }

  return (
    <div className="row" style={{ marginTop: "100px" }}>
      {/* === COLUMNA IZQUIERDA (Perfil y Mascotas) === */}
      <div className="col-md-4 fixed-top" style={{ marginTop: "100px" }}>
        {/* ... (Tu código para el perfil y la lista de mascotas no cambia) ... */}
        {/* Card 1: PERFIL DE USUARIO */}
        <div
          className="shadow-sm border-0 mb-4"
          style={{
            marginLeft: "160px",
            width: "262px",
            backgroundColor: "#fff",
            borderRadius: "15px",
          }}
        >
          <div className="card-body text-center p-4">
            <img
              src={
                perfil.imagen
                  ? `${import.meta.env.VITE_API_URL}${perfil.imagen}`
                  : "/petconnect.webp"
              }
              alt="Foto de perfil"
              className="rounded-circle mb-3"
              style={{ height: "90px", width: "90px", objectFit: "cover" }}
            />
            <h5 className="fw-bold mb-0">{perfil.nombre}</h5>
            <p className="text-muted" style={{ fontSize: "0.9rem" }}>
              {perfil.ciudad || "Amante de las mascotas"}
            </p>
            <div className="d-flex justify-content-center gap-4 mt-3">
              <div>
                <span className="h5 fw-bold d-block">{mascotas.length}</span>
                <small className="text-muted">Mascotas</small>
              </div>
            </div>
          </div>
        </div>
        {/* Card 2: LISTA DE MASCOTAS */}
        <div
          className="shadow-sm border-0"
          style={{
            marginLeft: "160px",
            width: "262px",
            backgroundColor: "#fff",
            borderRadius: "15px",
          }}
        >
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3">Mis Mascotas</h6>
            {mascotas.length > 0 ? (
              mascotas.map((pet, index) => (
                <div key={pet.id}>
                  <div className="d-flex align-items-center py-2">
                    <img
                      src={
                        pet.imagen
                          ? `${import.meta.env.VITE_API_URL}${pet.imagen}`
                          : "/petconnect.webp"
                      }
                      alt={pet.nombre}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "12px",
                      }}
                    />
                    <div>
                      <span
                        className="d-block fw-bolder"
                        style={{ lineHeight: "1.2" }}
                      >
                        {pet.nombre}
                      </span>
                      <small className="text-muted">{pet.raza}</small>
                    </div>
                  </div>
                  {/* Añade una línea separadora si no es el último elemento */}
                  {index < mascotas.length - 1 && <hr className="my-1" />}
                </div>
              ))
            ) : (
              <p className="text-muted small">No tienes mascotas agregadas.</p>
            )}
          </div>
        </div>
      </div>

      {/* === COLUMNA DERECHA (Publicaciones) === */}
      <div className="col-md-6 offset-md-4" style={{ marginLeft: "470px" }}>
        {/* --- Card 3: CREAR PUBLICACIÓN --- */}
        <CrearPublicacion
          // ✅ 6. Pasamos las props necesarias que diseñamos antes
          profileImageUrl={
            perfil.imagen
              ? `${import.meta.env.VITE_API_URL}${perfil.imagen}`
              : "/petconnect.webp"
          }
          userId={perfil.id}
          onPostCreated={handlePostCreated}
        />

        {/* ✅ 7. Mostramos la lista de publicaciones */}
        <div className="mt-4">
          {posts.map((post) => (
            <PostCard key={post.id} postData={post} currentUserId={perfil.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cabecera;