const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "petconnect",
  waitForConnections: true,
  connectionLimit: 10,   // Máximo de conexiones abiertas
  queueLimit: 0          // Sin límite en la cola de espera
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error al conectar a MySQL:", err);
    return;
  }
  console.log("✅ Conectado a MySQL con pool");
  connection.release();
});

module.exports = db;