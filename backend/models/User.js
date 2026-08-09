// costruire la struttura dei dati degli user
const mongoose = require('mongoose'); // sarebbero gli import di python
const bcrypt = require('bcrypt');


const SchemaUser = new mongoose.Schema({
  email: { type: String, 
           required: true, 
           unique: true 
        },
  password: { type: String,
             required: true
             },
  ruolo: { type: String,  // in realta ho creato uno user admin dalla dashboard
    enum: ['user', 'admin'], default: 'user' }
});


// questo qui sotto sarebbe un middleware, cioe quando creamo l utente noi facciamo .save ma automaticamente 
// mongo deve andare a criptare la password per non salvarla in chiaro, una volta fatto lo salva
SchemaUser.pre('save', async function(next) { 
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// esporto il modello per le rotte
module.exports = mongoose.model('User', SchemaUser);
