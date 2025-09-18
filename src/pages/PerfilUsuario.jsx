import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import ModalMascostas from "./componentes/modal";
import Modal from 'react-bootstrap/Modal'
import axios from "axios";

function PerfilUsuario() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [imagenPerfil, setImagenPerfil] = useState(null);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const res = await fetch("http://localhost:5000/perfil", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.ok) {
          const usuario = await res.json();
          // Prellenar el formulario con los datos actuales
          setValue("nombre", usuario.nombre);
          setValue("email", usuario.email);
          setValue("telefono", usuario.telefono);
          setValue("direccion", usuario.direccion);
        }
      } catch (error) {
        toast.error("Error al cargar los datos del usuario");
      }
    };

    cargarDatosUsuario();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("email", data.email);
      formData.append("telefono", data.telefono);
      formData.append("ciudad", data.ciudad);
      formData.append("direccion", data.direccion);

      if (imagenPerfil) {
        formData.append("imagen", imagenPerfil);
      }

      const res = await fetch("http://localhost:5000/actualizar-perfil", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const resultado = await res.json();

      if (res.ok) {
        toast.success("Perfil actualizado exitosamente");
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
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ marginLeft: "250px", width: "80vw" }}>
          {/* Header con título y botones */}
          <div className=" d-flex justify-content-between align-items-center p-4 border-bottom ">
            <div>
              <h1
                className="mb-1"
                style={{
                  fontSize: "30px",
                }}
              >
                Editar Perfil
              </h1>
              <p className="text-muted mb-0">
                Actualiza tu información personal y la de tus mascotas
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn btn-light me-2"
                onClick={() => window.history.back()}
                style={{
                  border: "1px solid #dee2e6",
                  padding: "8px 20px",
                }}
              >
                Cancelar
              </button>
              <button
                className="btn"
                onClick={handleSubmit(onSubmit)}
                style={{
                  backgroundColor: "#F97316",
                  color: "white",
                  padding: "8px 20px",
                }}
              >
                Guardar Cambios
              </button>
            </div>
          </div>

          {/* Contenido del formulario */}
          <div
            className="container mt-4"
            style={{ display: "flex", gap: "20px", marginLeft: "5vh" }}
          >
            <div
              style={{
                height: "700px",
                width: "331px",
                backgroundColor: "#FFFFFF",
                borderRadius: "8px",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", // Increased shadow for elevation
                transform: "translateY(-20px)", // Slightly elevate the box
                marginTop: "2vh", // Add 25% margin from the top
                marginBottom: "25vh", // Add 25% margin from the bottom
              }}
            >
              <h3 className="fs-5 mt-4 ms-4">Tu Informacion</h3>
              <div
                style={{
                  height: "670px",
                  width: "331px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "8px",
                  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                  transform: "translateY(-20px)",
                  marginTop: "2vh",
                  marginBottom: "25vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "30px",
                  }}
                >
                  <img
                    src={
                      imagenPerfil
                        ? URL.createObjectURL(imagenPerfil)
                        : "/petconnect.webp"
                    }
                    alt="Foto de perfil"
                    style={{
                      height: "128px",
                      width: "128px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    className="mx-auto d-block mt-3"
                  />
                  <label
                    htmlFor="cambiarFoto"
                    style={{
                      color: "#F97316",
                      cursor: "pointer",
                      fontSize: "14px",
                      marginTop: "4px",
                    }}
                  >
                    Cambiar foto
                  </label>
                  <input
                    id="cambiarFoto"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files[0]) setImagenPerfil(e.target.files[0]);
                    }}
                  />
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="row g-3 mt-4 ms-4"
                >
                  {/* Nombre Completo */}
                  <div className="col-11">
                    <label className="form-label">Nombre Completo</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.nombre ? "is-invalid" : ""
                      }`}
                      {...register("nombre", {
                        required: "El nombre es requerido",
                        minLength: {
                          value: 3,
                          message: "El nombre debe tener al menos 3 caracteres",
                        },
                      })}
                    />
                    {errors.nombre && (
                      <div className="invalid-feedback">
                        {errors.nombre.message}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-11">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      {...register("email", {
                        required: "El email es requerido",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email inválido",
                        },
                      })}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="col-11">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      className={`form-control ${
                        errors.telefono ? "is-invalid" : ""
                      }`}
                      {...register("telefono", {
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Teléfono inválido (10 dígitos)",
                        },
                      })}
                    />
                    {errors.telefono && (
                      <div className="invalid-feedback">
                        {errors.telefono.message}
                      </div>
                    )}
                  </div>

                  {/* Ciudad */}
                  <div className="col-md-6">
                    <label className="form-label">Ciudad</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.ciudad ? "is-invalid" : ""
                      }`}
                      {...register("ciudad", {
                        required: "La ciudad es requerida",
                      })}
                    />
                    {errors.ciudad && (
                      <div className="invalid-feedback">
                        {errors.ciudad.message}
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div
              style={{
                height: "727px",
                width: "694px",
                backgroundColor: "#FFFFFF",
                borderRadius: "8px",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                transform: "translateY(-20px)",
                marginTop: "2vh",
                marginBottom: "25vh",
                padding: "24px",
              }}
            >
              <div className=" d-flex justify-content-between align-items-center ">
                <h3 className="fs-5 mb-4">Mis Mascotas</h3>
                <ModalMascostas />
              </div>
              <div>
                <p className="mt-4 text-muted">
                  Aún no has agregado ninguna mascota. Haz clic en "Agregar
                  Mascota" para comenzar.
                </p>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilUsuario;
