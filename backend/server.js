const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");

// Configuración de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
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

const postsRoutes = require('./routes/posts');
app.post("/api/posts", upload.single('file'), postsRoutes); 
app.use("/api/posts", postsRoutes);
app.post('/api/posts', upload.single('file'), postsRoutes);
const citasRoutes = require('./routes/citas');
app.use('/api/citas', citasRoutes);

const searchRoutes = require('./routes/search'); // Importa
app.use('/api/search', searchRoutes);

app.use('/api/medicamentos', require('./routes/medicamentos'));




app.listen(5000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:5000");
});
