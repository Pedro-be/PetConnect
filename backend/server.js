const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer"); // Añadir esta línea

// Configuración de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // asegúrate que esta carpeta existe
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
const Usuario = require("./models/usuarioModel");
const usuarioRoutes = require("./routes/usuario");
app.use("/api/usuario", usuarioRoutes);

app.use('/api/mascotas', require('./routes/mascotas'));

const imagenesRoutes = require("./routes/imagenes");
app.use("/api/imagenes", imagenesRoutes);



// TODO: agregar mascotas e imágenes de la misma manera

app.listen(5000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:5000");
});
