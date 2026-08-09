import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Searchbar.css';
import { Search } from 'lucide-react';

const URL_RICERCA =`${process.env.REACT_APP_API_URL}/api/esami/ricerca-esame`;

export default function SearchBar() {
  const [testo, setTesto] = useState('');
  const naviga = useNavigate();

  async function gestisciRicerca(event) {
    event.preventDefault()  ;

    const nomeEsame = testo.trim();

    if (!nomeEsame) {
      alert('Inserisci il nome di un esame.');
      return;
    }

    try {
      const risposta = await fetch(
        `${URL_RICERCA}?nome=${encodeURIComponent(nomeEsame)}`
      );

      const dati = await risposta.json();

      if (!risposta.ok) {
        alert(dati.message);
        return;
      }

      naviga('/dettagli', {
        state: {
          esame: dati
        }
      });
    } catch {
      alert('Impossibile contattare il server.');
    }
  }

  return (
    <div className="search-area">
      <form className="search-bar" onSubmit={gestisciRicerca}>
        <Search
          className="search-bar__icon"
          size={30}
          aria-hidden="true"
        />

        <input
          type="text"
          value={testo}
          onChange={(event) => setTesto(event.target.value)}
          placeholder="Cerca un esame..."
        />

        <button type="submit">
          Cerca
        </button>
      </form>
    </div>
  );
}