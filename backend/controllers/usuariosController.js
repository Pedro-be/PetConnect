const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const usuariosModel = require("../models/usuarioModel");

const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Verificar si el usuario ya existe
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (usuarios.length > 0) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar nuevo usuario
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, hashedPassword]
        );

        res.status(201).json({ 
            message: 'Usuario registrado exitosamente',
            id: result.insertId 
        });

    } catch (error) {
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

    if (!match) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: usuario.id }, 
      'clave_secreta', 
      { expiresIn: '8h' }
    );

    res.json({ 
      token,
      message: "Login exitoso"
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const verificarEmail = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ 
                exists: false,
                message: 'Email no proporcionado' 
            });
        }

        const [usuarios] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        
        res.json({ 
            exists: usuarios.length > 0,
            message: usuarios.length > 0 ? 'Este email ya está registrado' : 'Email disponible'
        });

    } catch (error) {
        res.status(500).json({ 
            exists: false,
            message: 'Error al verificar email' 
        });
    }
};

const obtenerPerfil = async (req, res) => {
    try {
        // Verificar que tenemos el ID del usuario
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

        // Enviamos el primer usuario encontrado
        res.json(usuarios[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener perfil' });
    }
};

module.exports = { registrarUsuario, loginUsuario, verificarEmail, obtenerPerfil };
