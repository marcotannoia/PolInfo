const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // praticamente importiamo cookie-parser per poter introdurre i cookie 
require('dotenv').config();
const rotteAutenticazione = require('./rotte/rotteAutenticazione');
const rotteEsami = require('./rotte/rotteEsami'); 
const app = express();
const PORT = process.env.PORT;
const http = require('http'); // importiamo il protocollo
const httpServer = http.createServer(app); // dove lavorano express e websocket
const {Server} = require('socket.io'); // importo la classe

app.use(express.json());
app.use(cookieParser());

app.use(cors({ 
  origin: process.env.FRONTEND_URL, // poi ci mettiamo il nostro url del sito 
  credentials: true,
}));

const websocket = new Server(httpServer, {
  cors:{
    origin:process.env.FRONTEND_URL,
    credentials:true
  }
});
app.set(websocket)

async function accendiServer() {
  const connessione = await mongoose.connect(process.env.MONGO_URI)
  if (connessione) { 
    app.listen(PORT, '0.0.0.0') // 0.0.0.0 serve a render
  } else { 
    process.exit(1);
  }
}

accendiServer();
app.use('/api/autenticazione', rotteAutenticazione);
app.use('/api/esami', rotteEsami); 


