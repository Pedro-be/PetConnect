const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    
    // Si no hay cabecera de autorización, negamos el acceso
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Acceso denegado: formato de token inválido o inexistente." });
    }

    const token = authHeader.split(" ")[1];

    // Si después de extraer, el token está vacío o es inválido
    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ message: "Acceso denegado: no se proporcionó token." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, usuarioDecodificado) => {
        if (err) {
            console.error("Error de autenticación:", err.name);
            return res.status(403).json({ message: "Token inválido o expirado." });
        }
        
        req.usuario = usuarioDecodificado;
        next();
    });
};

module.exports = verificarToken;