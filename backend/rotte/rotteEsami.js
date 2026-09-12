const express = require('express');
const router = express.Router();
const ControllerEsame = require('../controllers/ControllerEsame'); // Il tuo controller con le logiche
const authMiddleware = require('../controllers/authMiddleware'); // Il tuo middleware di autenticazione
const adminMiddleware = require('../controllers/adminMiddleware');

router.get('/ricerca-esame', ControllerEsame.ricercaEsame);

router.post('/:idEsame/recensione', authMiddleware, ControllerEsame.aggiuntaRecensione);

router.post('/aggiungi', authMiddleware, adminMiddleware, ControllerEsame.inserimentoEsame);

router.get('/suggerimenti', ControllerEsame.suggerimentiEsami);


module.exports = router;
