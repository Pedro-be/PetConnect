const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const Usuario = require('./models/Usuario'); // Cambiado a ruta relativa correcta
const multer = require("multer");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexión MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "petconnect"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Conectado a MySQL");
});

// Ruta registro
app.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Las contraseñas no coinciden" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";
    
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("❌ Error SQL:", err);
        return res.status(500).send(err);
      }
      console.log("✅ Usuario insertado:", result);
      res.json({ message: "Usuario registrado con éxito" });
    });
  } catch (error) {
    console.error("❌ Error servidor:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM usuarios WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length === 0) return res.status(401).json({ message: "Usuario no encontrado" });

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ message: "Contraseña incorrecta" });

    res.json({ message: "Login exitoso ✅", usuario: user });
  });
});

// Ruta para verificar email
app.post("/check-email", async (req, res) => {
    try {
        const { email } = req.body;
        const sql = "SELECT * FROM usuarios WHERE email = ?";
        
        db.query(sql, [email], (err, result) => {
            if (err) {
                console.error("Error al verificar email:", err);
                return res.status(500).json({ 
                    message: 'Error al verificar el email',
                    error: err.message 
                });
            }
            
            res.json({ exists: result.length > 0 });
        });
    } catch (error) {
        console.error('Error al verificar email:', error);
        res.status(500).json({ 
            message: 'Error al verificar el email',
            error: error.message 
        });
    }
});


// Ruta para obtener datos del usuario
const jwt = require("jsonwebtoken");

// Middleware para verificar token
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  jwt.verify(token, "clave_secreta", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }
    req.user = user;
    next();
  });
}

// Ruta para obtener perfil del usuario autenticado
app.get("/perfil", verificarToken, (req, res) => {
  const userId = req.user.id; // viene del token

  const sql = "SELECT id, nombre, email, telefono, direccion FROM usuarios WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error en el servidor" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(result[0]);
  });
});



// Configuración de multer (donde se guardan las imágenes)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Ruta para subir imágenes
app.post("/upload", upload.single("imagen"), (req, res) => {
  const nombre = req.body.nombre;
  const ruta = `/uploads/${req.file.filename}`;

  db.query("INSERT INTO imagenes (nombre, ruta) VALUES (?, ?)", [nombre, ruta], (err, result) => {
    if (err) throw err;
    res.json({ mensaje: "Imagen subida correctamente", ruta });
  });
});

// Ruta para obtener imágenes
app.get("/imagenes", (req, res) => {
  db.query("SELECT * FROM imagenes", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


// Levantar servidor
app.listen(5000, () => {
  console.log("Servidor corriendo en http://localhost:5000");
});