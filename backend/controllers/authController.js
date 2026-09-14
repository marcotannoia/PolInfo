const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // serve per fare chiamate http

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body; 
    const utenteEsistente = await User.findOne({email});
    if (utenteEsistente) { 
      res.status(400).json({error: "Email occupata"})
    }
    const newUser = new User({ email, password, ruolo: "user"}); // lo user non puo scegliere se essere admin
    await newUser.save();
    res.status(201).json({ messaggio: "Utente registrato" });
  } catch (err) {
    res.status(500).json({ error: "Errore, riprovare" });
  }
};

exports.login = async (req, res) => { 
  try {
    const { email, password } = req.body; 
    const user = await User.findOne({ email }); 
    if (!user) return res.status(404).json({ error: "Utente non trovato" });// e vedo se esiste o meno

    const match_pw = await bcrypt.compare(password, user.password); 
    if (!match_pw) return res.status(400).json({ error: "Password errata" }); 

    const token = jwt.sign(
      { id: user._id, ruolo: user.ruolo },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { id: user._id, ruolo: user.ruolo, refresh: true },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({ user: { id: user._id, email: user.email } }); //risposta: id user e email | ho tolto il token, lo carico dal middleware con il cookie 
  } catch (err) {
    res.status(500).json({ error: "Errore, riprovare" });
  }
};

exports.refresh = (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'Refresh token mancante' });

  try {
    const user = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (!user.refresh) {
      return res.status(401).json({ error: 'Refresh token non valido' });
    }

    const token = jwt.sign(
      { id: user.id, ruolo: user.ruolo },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000
    });

    return res.status(200).json({ message: 'Token aggiornato' });
  } catch (err) {
    return res.status(401).json({ error: 'Refresh token non valido o scaduto' });
  }
};

async function verificaCineca(username, password) {
  const credenziali = `${username}:${password}`;
  const authHeader ='Basic ' + Buffer.from(credenziali).toString('base64'); // le credenziali viaggiano in base 64
  const risposta = await axios.get(`${process.env.ESSE3_URL}/login`,
    {
      headers: {
        Authorization: authHeader
      }
    }
  );

  return risposta.data; 
}
exports.verificaCineca = verificaCineca;

exports.loginCineca = async (req, res) => {
  try {
    const { username, password } = req.body;
    const datiCineca = await verificaCineca(username,password);
    return res.status(200).json(datiCineca);
  } catch (error) {
    return res.json({error: 'Credenziali Cineca non valide'});
  }
};

// questo cookie è inutilizzato ma se vogliamo mettere altre cose ci serve per prendere il consenso e tenerlo per un anno
exports.cookieConenso = async (req, res) => {
  res.cookie("consensoCookie", "accepted", {
    httpOnly: true, 
    secure: true,
    sameSite: 'lax', 
    maxAge: 365 * 24 * 60 * 60 * 1000 // un anno
  });

  res.json({ message : "Consenso cookie salvato" });
};

exports.logout = async (req, res) => {
  const opzioniCookie = { httpOnly: true, secure: true, sameSite: 'none' };
  res.clearCookie('token', opzioniCookie);
  res.clearCookie('refreshToken', opzioniCookie);

  return res.status(200).json({message: 'Logout effettuato'});
};
