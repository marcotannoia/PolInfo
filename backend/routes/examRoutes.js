const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController'); // Il tuo controller con le logiche
const authMiddleware = require('../controllers/authMiddleware'); // Il tuo middleware di autenticazione
const adminMiddleware = require('../controllers/adminMiddleware');

// Ricerca per nome
router.get('/:name', authMiddleware, examController.getExamByName);

// Aggiungi recensione
router.post('/:examId/review', authMiddleware, examController.addReview);

// Inserimento Admin
router.post('/add', authMiddleware, adminMiddleware, examController.insertExam);

module.exports = router;