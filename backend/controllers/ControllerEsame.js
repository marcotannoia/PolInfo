// gli permetto di ricercalo 
const Esame = require('../models/Esame');
const {verificaCineca} = require('./authController');

exports.aggiuntaRecensione = async (req, res) => {
    try {
        const { idEsame } = req.params;
        const {
            usernameCineca, //prendiamo username e pw per poter fare la verifica del login
            passwordCineca,
            difficolta,
            tempo_di_studio_settimane,
            tempi_di_correzione,
            commento
        } = req.body;
        try {
            await verificaCineca(usernameCineca,passwordCineca); // andiamo in auth controller
        } catch {
            return res.status(401).json({ message: "Credenziali Cineca non valide"});
        }
        const userId = req.user.id;
        const esameAggiornato =
            await Esame.findByIdAndUpdate(idEsame,
                    {$push: {
                        recensioni: {
                            userId,
                            difficolta,
                            tempo_di_studio_settimane,
                            tempi_di_correzione,
                            commento
                        }
                    }},
                {new: true,runValidators: true}); // i validators ci permettono di non accettare recensioni che non abbiano tutti icampi
        if (!esameAggiornato) {
            return res.status(404).json({message: "Esame non trovato"});
        }
        return res.status(200).json({message: "Recensione inserita con successo",esame: esameAggiornato});
    } catch {
        return res.status(500).json({message:"Errore durante l'inserimento della recensione"});
    }
};

exports.ricercaEsame = async (req, res) => {
    try {
        const nome = req.query.nome?.trim();

        if (!nome) {
            return res.status(400).json({message: "Inserire un esame"});
        }

        const esame = await Esame
            .findOne({ nome })
            .collation({
                locale: 'it',
                strength: 2
            });

        if (!esame) {
            return res.status(404).json({
                message: "Esame non trovato"
            });
        }

        return res.status(200).json(esame);
    } catch (err) {
        return res.status(500).json({
            message: "Errore generico"
        });
    }
};


// SOLO PER ADMIN
exports.inserimentoEsame  = async (req, res) => {
    try {
        const { nome, descrizione, professore, corsoDiStudi } = req.body; 
        
        const nuovoEsame = new Esame({
            nome,
            descrizione,
            professore,
            corsoDiStudi, 
            tempo_di_studio_settimane,
            tempi_di_correzione,
            difficolta,
            recensioni: [] 
        });

        await nuovoEsame.save();
        res.status(201).json({ message: "Esame inserito con successo", esame: nuovoEsame });
    } catch (error) {
        res.status(500).json({ message: "Errore durante l'inserimento", error });
    }
};

exports.suggerimentiEsami = async(req, res) => {
    const nome = req.query.nome.trim();
    if (!nome) res.json([]);
    const esami = await Esame.find().filter((esame) => esame.nome.toLowerCase().includes(nome.toLowerCase()));
    res.json(esami);
}