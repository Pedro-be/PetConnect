import Container from "react-bootstrap/esm/Container";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetch("http://localhost:5000/api/usuario/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    alert(data.message);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  // función al enviar formulario
  const onSubmit = async (data) => {
  try {
    const res = await fetch("http://localhost:5000/api/usuario/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      // Guardamos el token
        localStorage.setItem("token", result.token);
      toast.success(result.message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
  
    setTimeout(() => navigate("/Header"), 2000);
    } else {
      toast.error(result.message || "Credenciales incorrectas", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
    }
  } catch (error) {
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

  return (
    <div
      style={{
        backgroundColor: "#E5E7EB",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ToastContainer />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          width: "896px",
          height: "80%",
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", // Increased shadow for elevation
          transform: "translateY(-20px)", // Slightly elevate the box
          marginTop: "25vh", // Add 25% margin from the top
          marginBottom: "25vh", // Add 25% margin from the bottom
        }}
      >
        <div className="d-flex w-100 h-100">
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ width: "50%", padding: "20px" }}
          >
            {/* Add your login form or inputs here */}
            <img
              src="/petconnect.webp"
              alt="PetConnect"
              width="64"
              height="64"
            />
            <h1 className="mt-2" style={{ fontSize: "30px" }}>
              PetConnect
            </h1>
            <p className="mt-1">Conecta con el amor de tu mascota</p>
            <h2 style={{ fontSize: "24px" }}>¡Bienvenido de vuelta!</h2>
            <p style={{ fontSize: "16px" }}>
              Inicia sesión para continuar cuidando a tu mascota
            </p>
            <form
              className="mt-4"
              style={{ width: "100%" }}
              onSubmit={handleSubmit(onSubmit)}
            >
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
                  })}
                  className="form-control rounded-3"
                  id="email"
                  placeholder=" tu@email.com"
                  onChange={e => setEmail(e.target.value)}
                />
                {errors.email && <p>{errors.email.message}</p>}
              </div>
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
                  placeholder="Ingresa tu contraseña"
                  onChange={e => setPassword(e.target.value)}
                />
                {errors.password && <p>{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                className="btn w-100 rounded-3"
                style={{ backgroundColor: "#F97316", color: "#ffff" }}
              >
                Iniciar Sesión
              </button>
              <p className="text-center mt-3">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/register"
                  style={{ color: "#F97316", textDecoration: "none" }}
                >
                  Regístrate aquí
                </Link>
              </p>
            </form>
          </div>

          {/* Right Side: Image and Text Section */}
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{
              width: "50%",
              padding: "20px",
              backgroundColor: "#F97316",
              borderRadius: "0 8px 8px 0",
            }}
          >
            <img
              className="rounded-4"
              src="/ChatGPT Image 24 ago 2025, 13_58_34.png"
              alt="Descripción"
              style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
            />

            <p style={{ textAlign: "center", color: "#f3f4f5ff" }}>
              Bienvenido a PetConnect, la mejor plataforma para conectarte con
              otros amantes de las mascotas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
