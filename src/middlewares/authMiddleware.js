// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // formato "Bearer <token>"

  if (!token) {
    return res.status(403).json({ error: "Token no proporcionado" });
  }

  try {
    const secretKey = process.env.JWT_SECRET || "clave_por_defecto";
    const decoded = jwt.verify(token, secretKey);

    // Guardamos los datos del usuario (id, email, rol) en la request
    req.usuario = decoded;
    next();
  } catch (error) {
    console.error("❌ Error verificando token:", error.message);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}

module.exports = verificarToken;
