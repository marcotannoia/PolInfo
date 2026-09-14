const jwt = require('jsonwebtoken'); 

module.exports = (req, res, next) => {
  const token = req.cookies?.token; 

  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      if (req.user.refresh) {
        return res.status(401).json({ error: "Token non valido" });
      }
      return next();
    } catch (err) {
    }
  }

  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: "Accesso negato" });

  try {
    const user = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (!user.refresh) {
      return res.status(401).json({ error: "Refresh token non valido" });
    }

    const nuovoToken = jwt.sign({ id: user.id, ruolo: user.ruolo },process.env.JWT_SECRET,{ expiresIn: '15m' });
    res.cookie('token', nuovoToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000
    });
    req.user = { id: user.id, ruolo: user.ruolo };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Refresh token non valido o scaduto" });
  }
};
