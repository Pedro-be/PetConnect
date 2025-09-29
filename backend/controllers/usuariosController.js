const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ message: "Todos los campos son requeridos." });
        }

        // Verificar si el usuario ya existe
        const [usuarios] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (usuarios.length > 0) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `
            INSERT INTO usuarios (nombre, email, password) 
            VALUES (?, ?, ?);
        `;
        const [result] = await db.query(query, [nombre, email, hashedPassword]);
        const nuevoUsuarioId = result.insertId;

        // Crear y enviar el token
        const payload = { id: nuevoUsuarioId, nombre: nombre };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

        res.status(201).json({
            message: "Usuario registrado exitosamente",
            token: token,
        });

    } catch (error) {
        console.error("Error detallado en el registro:", error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (usuarios.length === 0) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const usuario = usuarios[0];
        const match = await bcrypt.compare(password, usuario.password);

        if (!match) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const payload = { id: usuario.id, nombre: usuario.nombre };

        
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );

        res.json({ 
            token,
            message: "Login exitoso"
        });

    } catch (error) {
        console.error("Error detallado en el login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

const verificarEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        exists: false,

        message: "Email no proporcionado",
      });
    }

    const [usuarios] = await db.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    res.json({
      exists: usuarios.length > 0,

      message:
        usuarios.length > 0
          ? "Este email ya está registrado"
          : "Email disponible",
    });
  } catch (error) {
    res.status(500).json({
      exists: false,

      message: "Error al verificar email",
    });
  }
};

const obtenerPerfil = async (req, res) => {
    try {
        if (!req.usuario || !req.usuario.id) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        const [usuarios] = await db.query(
            'SELECT id, nombre, email, telefono, ciudad, direccion, imagen FROM usuarios WHERE id = ?',
            [req.usuario.id]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(usuarios[0]);

    } catch (error) {
        console.error("Error al obtener perfil:", error);
        res.status(500).json({ message: 'Error al obtener perfil' });
    }
};

module.exports = { registrarUsuario, loginUsuario, verificarEmail, obtenerPerfil };
