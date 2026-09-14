const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../controllers/authMiddleware');

router.post('/registrazione', authController.register); // rotta registrazione

router.post('/login', authController.login); // rotta login

router.post('/refresh', authController.refresh); // crea un nuovo access token

router.get('/me', authMiddleware, (req, res) => { // rotta protetta, serve un token valido per accedervi
    res.json({ message: "Accesso consentito alla rotta protetta", user: req.user });
});

router.post('/login-cineca', authController.loginCineca);  // rotta esterna di cineca

router.post('/cookie-consenso', authController.cookieConenso); // rotta per il consenso dei cookie./ tecnicamente lho inserito in auth controller per facilita di scrittura
router.post('/logout', authController.logout);
// codice ma in realta anche gli utenti non loggati possono accedervi
module.exports = router;
