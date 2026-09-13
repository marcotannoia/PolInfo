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

    const token = jwt.sign({ id: user._id , ruolo : user.ruolo }, process.env.JWT_SECRET, { expiresIn: '3h' }); //creo il token che dura una sett, serve cookie parser per o per leggere i cookie ricevuti dal btowser, cioe la res
    res.cookie('token', token, {
       httpOnly: true,
       secure: true,
       sameSite: 'none',
       maxAge: 3 * 60 * 60 * 1000
    });
    res.json({ user: { id: user._id, email: user.email } }); //risposta: id user e email | ho tolto il token, lo carico dal middleware con il cookie 
  } catch (err) {
    res.status(500).json({ error: "Errore, riprovare" });
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
  res.clearCookie('token', { 
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });

  return res.status(200).json({message: 'Logout effettuato'});
};

