// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

/**
 * Middleware para verificar el token JWT
 * Uso: Añadir como segundo parámetro en rutas protegidas
 * Ejemplo: router.get("/perfil", authMiddleware, controlador)
 */
const authMiddleware = (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: "Acceso denegado. No se proporcionó token" 
      });
    }

    // El formato esperado es: "Bearer TOKEN"
    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: "Formato de token inválido" 
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agregar información del usuario a la request
    req.user = {
      id: decoded.id,
      username: decoded.username
    };
    
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        message: "Token expirado. Por favor inicia sesión nuevamente" 
      });
    }
    
    return res.status(401).json({ 
      message: "Token inválido" 
    });
  }
};

module.exports = authMiddleware;