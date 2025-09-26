const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Token no proporcionado" });
        }

        // Decodificar el token y verificar
        const decoded = jwt.verify(token, "clave_secreta");
        
        // Asegurarnos de que decoded.id existe
        if (!decoded.id) {
            return res.status(401).json({ message: "Token inválido - no contiene ID" });
        }

        // Agregar la información del usuario decodificada a la request
        req.usuario = { id: decoded.id };
        
        next();
    } catch (error) {
        console.error("Error de autenticación:", error);
        return res.status(403).json({ message: "Token inválido" });
    }
};

module.exports = verificarToken;
