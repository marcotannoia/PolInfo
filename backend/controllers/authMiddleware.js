const jwt = require('jsonwebtoken'); 

module.exports = (req, res, next) => {
  const token = req.cookies?.token; 
  if (!token) return res.status(401).json({ error: "Accesso negato" });

  try {
    const verificato = jwt.verify(token, process.env.JWT_SECRET);  
    req.user = verificato;
    next(); 
  } catch (err) {
    res.status(400).json({ error: "Token non valido" });
  }
}; 

