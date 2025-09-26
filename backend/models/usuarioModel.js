const db = require("../db");

const insertUsuario = (usuario, callback) => {
  db.query("INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)", 
    [usuario.nombre, usuario.email, usuario.password], callback);
};

const getUsuarioByEmail = (email, callback) => {
  db.query("SELECT * FROM usuarios WHERE email = ?", [email], callback);
};

const getPerfilById = (id, callback) => {
  db.query("SELECT id, nombre, email, telefono, direccion FROM usuarios WHERE id = ?", [id], callback);
};

module.exports = { insertUsuario, getUsuarioByEmail, getPerfilById };
