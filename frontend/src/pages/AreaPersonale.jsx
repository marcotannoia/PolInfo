import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './AreaPersonale.css';

export default function AreaPersonale() { 
    const naviga = useNavigate();
    const [recensioni, setRecensioni] = useState([]);
    async function logout() { 
        const risposta = await fetch(`${process.env.REACT_APP_API_URL}/api/autenticazione/logout`,
                        {method: 'POST',credentials: 'include'});
        if (risposta.ok) {
            naviga('/login');
        } 
    }
    useEffect(() => {
      async function caricaRecensioni() {
        try {
          const risposta = await fetch(
            `${process.env.REACT_APP_API_URL}/api/esami/mie-recensioni`,
            {credentials: 'include'}
          );

          if (!risposta.ok) {
            naviga('/login');
            return;
          }

          const dati = await risposta.json();
          setRecensioni(dati);
        } catch {
          setRecensioni([]);
        }
      }

      caricaRecensioni();
    }, [naviga]);

    return (
        <main className="pagina-area-personale">
      <section className="area-personale">
        <h1>Area personale</h1>

        <p className="area-personale__descrizione">
          Ciao!
        </p>

        <section className="sezione-recensioni">
          <h2>Le mie Recensioni</h2>
          {
            recensioni.length === 0 ? (<p>Non hai ancora recensioni inserite</p>) : (
              recensioni.map((e) => (
              <article
                className="recensione"
                key={e.recensione._id}
              >
                <h3>{e.esame}</h3>
                <p>
                  <strong>Difficoltà:</strong>{' '}
                  {e.recensione.difficolta}/5
                </p>

                <p>
                  <strong>Tempo di studio:</strong>{' '}
                  {e.recensione.tempo_di_studio_settimane} settimane
                </p>

                <p>
                  <strong>Tempo di correzione:</strong>{' '}
                  {e.recensione.tempi_di_correzione} giorni
                </p>

                <p>
                  <strong>Commento:</strong>{' '}
                  {e.recensione.commento}
                </p>
              </article>
              ))
            )
          }
        </section>

        <div className="area-personale__azioni">
         <button type="button" onClick = {logout}> Logout </button>
        </div>
      </section>
    </main> 
    );
}
