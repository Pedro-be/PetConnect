import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registrar = async () => {
    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });

    const data = await res.json();
    alert(data.message);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
  try {
    // Primero verificamos si el email existe
    const checkEmail = await fetch("http://localhost:5000/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    });

    const emailCheck = await checkEmail.json();

    if (emailCheck.exists) {
      toast.error("Este correo ya está registrado", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Si el email no existe, procedemos con el registro
    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      toast.success('¡Registro exitoso!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => navigate("/Header"), 2000);
    } else {
      toast.error(result.message || "Error al registrar", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
    }
  } catch (error) {
    console.error("Error al conectar con backend:", error);
      toast.error("Error al conectar con el servidor", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
  }
};

const validateEmail = async (email) => {
  try {
    const res = await fetch("http://localhost:5000/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return !data.exists || "Este correo ya está registrado";
  } catch (error) {
    return true; // Permitir continuar si hay error de conexión
  }
};

  return (
    <div
      style={{
        backgroundColor: "#E5E7EB",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px", // Añadido padding para evitar que toque los bordes en móvil
      }}
    >
      <ToastContainer />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          width: "100%",
          maxWidth: "896px", // Máximo ancho en desktop
          height: "auto",
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
          transform: "translateY(-20px)",
          overflow: "hidden", // Evita desbordamiento en móvil
        }}
      >
        <div className="d-flex w-100 flex-column flex-md-row"> {/* Cambio a columna en móvil */}
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ 
              width: "100%", // Full width en móvil
              padding: "20px",
              minHeight: "400px" // Altura mínima para mantener proporción
            }}
          >
            <img
              src="/petconnect.webp"
              alt="PetConnect"
              width="64"
              height="64"
              className="mb-2"
            />
            <h1 className="text-center mb-2" style={{ fontSize: "clamp(24px, 4vw, 30px)" }}>
              PetConnect
            </h1>
            <h2 className="text-center mb-3" style={{ fontSize: "clamp(20px, 3vw, 24px)" }}>
              Crear una cuenta
            </h2>
            <p className="text-center mb-4" style={{ fontSize: "clamp(14px, 2vw, 16px)" }}>
              Únete a nuestra comunidad de amantes de mascotas
            </p>

            <form className="w-100 px-3 px-md-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Nombre */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Nombre completo
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "El nombre es obligatorio",
                  })}
                  className="form-control rounded-3"
                  id="name"
                  placeholder="Tu nombre"
                  onChange={e => setNombre(e.target.value)}
                />
                {errors.name && (
                  <p className="text-danger">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "El email es obligatorio",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Formato de email inválido",
                    },
                    validate: validateEmail
                  })}
                  className="form-control rounded-3"
                  id="email"
                  placeholder="tu@email.com"
                  onChange={e => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p className="text-danger">{errors.email.message}</p>
                )}
              </div>

              {/* Contraseña */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  })}
                  className="form-control rounded-3"
                  id="password"
                  placeholder="Crea tu contraseña"
                  onChange={e => setPassword(e.target.value)}
                />
                {errors.password && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Por favor confirma tu contraseña",
                    validate: (val) => {
                      if (watch("password") !== val) {
                        return "Las contraseñas no coinciden";
                      }
                    },
                  })}
                  className="form-control rounded-3"
                  id="confirmPassword"
                  placeholder="Confirma tu contraseña"
                />
                {errors.confirmPassword && (
                  <p className="text-danger">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn w-100 rounded-3"
                style={{ backgroundColor: "#F97316", color: "#ffff" }}
              >
                Registrarse
              </button>

              <p className="text-center mt-3">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/login"
                  style={{ color: "#F97316", textDecoration: "none" }}
                >
                  Inicia sesión
                </Link>
              </p>
            </form>
          </div>

          {/* Parte naranja - Se oculta en móvil */}
          <div
            className="d-none d-md-flex flex-column justify-content-center align-items-center"
            style={{
              width: "80%",
              padding: "20px",
              backgroundColor: "#F97316",
              borderRadius: "0 8px 8px 0",
            }}
          >
            <img
              className="img-fluid rounded-4 mb-4"
              src="/ChatGPT Image 24 ago 2025, 13_58_34.png"
              alt="Descripción"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <p className="text-center text-white">
              Únete a PetConnect y forma parte de nuestra comunidad de amantes de mascotas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
