import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar.jsx";
import ModalMascostas from "./componentes/modal";
import PetCard from "./componentes/PetCard.jsx";

function PerfilUsuario() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("/petconnect.webp");
  const [mascotas, setMascotas] = useState([]);

  // ✅ Función para cargar los datos del usuario, movida fuera de useEffect
  const cargarDatosUsuario = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:5000/api/usuario/perfil", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setValue("nombre", data.nombre);
        setValue("email", data.email);
        setValue("telefono", data.telefono);
        setValue("ciudad", data.ciudad);
        if (data.imagen) {
          setProfileImageUrl(`${import.meta.env.VITE_API_URL}${data.imagen}`);
        }
      } else {
        toast.error("No se pudieron cargar los datos del perfil.");
      }
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
      toast.error("Error de conexión al cargar el perfil.");
    }
  }, [setValue]);

  const fetchMascotas = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:5000/api/mascotas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setMascotas(data || []);
      } else {
        toast.error("No se pudieron cargar las mascotas.");
      }
    } catch (error) {
      console.error("Error al obtener mascotas:", error);
      toast.error("Error de conexión al cargar mascotas.");
    }
  }, []);

  // ✅ Función para actualizar la UI de mascotas, movida fuera de useEffect
  const handlePetUpdate = useCallback((mascotasActualizadas) => {
    setMascotas((mascotasPrevias) =>
      mascotasPrevias.map((pet) =>
        pet.id === mascotasActualizadas.id ? mascotasActualizadas : pet
      )
    );
  }, []);

  // useEffect ahora solo se encarga de llamar a las funciones al cargar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Por favor, inicia sesión para ver tu perfil.");
      navigate("/login");
      return;
    }
    cargarDatosUsuario();
    fetchMascotas();
  }, [navigate, cargarDatosUsuario, fetchMascotas]);

  // Función para manejar el envío del formulario de actualización de perfil
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No hay sesión activa");
        return;
      }

      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("email", data.email);
      formData.append("telefono", data.telefono);
      formData.append("ciudad", data.ciudad);
      formData.append("direccion", data.direccion || '');

      if (imagenPerfil) {
        formData.append("imagen", imagenPerfil);
      }

      const res = await fetch("http://localhost:5000/api/usuario/actualizar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const resultado = await res.json();

      if (res.ok) {
        toast.success("Perfil actualizado exitosamente");
        // Vuelve a cargar los datos para reflejar los cambios (como la nueva foto)
        await cargarDatosUsuario();
      } else {
        toast.error(resultado.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al conectar con el servidor");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "250px", flexGrow: 1, padding: "2rem" }}>
        {/* Header con título y botones */}
        <div className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
          <div>
            <h1 className="h2 mb-0">Editar Perfil</h1>
            <p className="text-muted mb-0">
              Actualiza tu información personal y la de tus mascotas
            </p>
          </div>
          <div>
            <button
              className="btn btn-light me-2"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit(onSubmit)}
              style={{ backgroundColor: "#F97316", borderColor: "#F97316" }}
            >
              Guardar Cambios
            </button>
          </div>
        </div>

        {/* Contenido principal en dos columnas */}
        <div className="row">
          {/* --- Columna de Información del Usuario --- */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">Tu Información</h5>
                <div className="text-center mb-4">
                  <img
                    src={
                      imagenPerfil
                        ? URL.createObjectURL(imagenPerfil)
                        : profileImageUrl
                    }
                    alt="Foto de perfil"
                    className="rounded-circle"
                    style={{
                      height: "128px",
                      width: "128px",
                      objectFit: "cover",
                    }}
                  />
                  <label
                    htmlFor="cambiarFoto"
                    className="d-block mt-2"
                    style={{ color: "#F97316", cursor: "pointer" }}
                  >
                    Cambiar foto
                  </label>
                  <input
                    id="cambiarFoto"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => setImagenPerfil(e.target.files[0])}
                  />
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Nombre Completo */}
                  <div className="mb-3">
                    <label className="form-label">Nombre Completo</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                      {...register("nombre", { required: "El nombre es requerido" })}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      {...register("email", { required: "El email es requerido" })}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                  </div>

                  {/* Teléfono */}
                  <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                      {...register("telefono")}
                    />
                    {errors.telefono && <div className="invalid-feedback">{errors.telefono.message}</div>}
                  </div>

                  {/* Ciudad */}
                  <div className="mb-3">
                    <label className="form-label">Ciudad</label>
                    <input
                      type="text"
                      className={`form-control ${errors.ciudad ? "is-invalid" : ""}`}
                      {...register("ciudad")}
                    />
                    {errors.ciudad && <div className="invalid-feedback">{errors.ciudad.message}</div>}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* --- Columna de Mascotas --- */}
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Mis Mascotas</h5>
              <ModalMascostas actualizarMascotas={fetchMascotas} />
            </div>

            {mascotas.length === 0 ? (
              <p className="text-muted text-center mt-5">
                Aún no has agregado ninguna mascota.
              </p>
            ) : (
              <div className="row">
                {mascotas.map((pet) => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    onPetUpdate={handlePetUpdate} // <-- Pasamos la función aquí
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilUsuario;