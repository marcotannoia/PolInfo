import SearchBar from '../components/Searchbar'
import './Landing.css' 
import {useState, useEffect} from 'react'

export  default function LandingPage() { 
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
  fetch(`${process.env.REACT_APP_API_URL}/api/autenticazione/me`, {
    credentials: 'include'
  })
    .then((risposta) => risposta.json())
    .then((dati) => {
      if (dati.user?.ruolo === 'admin') {
        setAdmin(true);
      }
    })
    .catch(() => setAdmin(false));
}, []);
async function inserisciEsame(event) {
  event.preventDefault();

  const form = event.target;

  const nuovoEsame = {
    nome: form.nome.value,
    descrizione: form.descrizione.value,
    professore: form.professore.value,
    corsoDiStudi: form.corsoDiStudi.value,
    tempo_di_studio_settimane: form.tempoStudio.value,
    tempi_di_correzione: Number(form.tempoCorrezione.value),
    difficolta: Number(form.difficolta.value)
  };

  const risposta = await fetch(
    `${process.env.REACT_APP_API_URL}/api/esami/aggiungi`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuovoEsame)
    }
  );

  const dati = await risposta.json();

  alert(dati.message);

  if (risposta.ok) {
    form.reset();
  }
}

    return ( 
        <main id="home" className="landing-page">
      <section className="hero">

        <h1 className="hero__title">
          POL<span>Info</span>
        </h1>

        <p className="hero__description">
          Cerca un esame e scopri informazioni, recensioni ed esperienze
          condivise dagli studenti.
        </p>

        <SearchBar />
        {admin && (
  <form className="form-esame" onSubmit={inserisciEsame}>
    <h2>Inserisci un nuovo esame</h2>

    <input
      name="nome"
      placeholder="Nome esame"
      required
    />

    <input
      name="descrizione"
      placeholder="Descrizione"
      required
    />

    <input
      name="professore"
      placeholder="Professore"
      required
    />

    <input
      name="corsoDiStudi"
      placeholder="Corso di studi"
      required
    />

    <input
      name="tempoStudio"
      placeholder="Tempo di studio in settimane"
      required
    />

    <input
      name="tempoCorrezione"
      type="number"
      min="0"
      placeholder="Tempo di correzione in giorni"
      required
    />

    <input
      name="difficolta"
      type="number"
      min="1"
      max="5"
      placeholder="Difficoltà da 1 a 5"
      required
    />

    <button type="submit">
      Inserisci esame
    </button>
  </form>
)}
      </section>
    </main>
    )
}