const User = requiew('../models/User');

module.exports = async (req, res, next) => {
    try{
        const user = await User.findById(req.user.id).select('ruolo');
        if( !user ) return res.status(401).json('Utente non trovato');
        if(user.ruolo !== 'admin') return res.status(403).json('Accesso riservato agli amministratori');
        next();
    }catch(error){
        return res.status(500).json('Errore nel controllo');
    }
}