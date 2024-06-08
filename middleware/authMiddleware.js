const jwt = require("jsonwebtoken");
const auth = require("../config/auth");
const secret = auth.jwtSecret;

const authMiddleware = (requiredRole) => (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Usuario no autorizado." });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "No se pudo autenticar el token." });
    }
    if (decoded.role !== requiredRole) {
      return res.status(403).json({ error: "Privilegios insuficientes." });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
