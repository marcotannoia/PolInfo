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
      fetch(`${process.env.REACT_APP_API_URL}/api/esami/mie-recensioni`, {credentials:'include'})
      .then((risposta) => risposta.json())
      .then((dati) => setRecensioni(dati))
      .catch(() => setRecensioni([]));
    }, []);

    return (
        <main className="pagina-area-personale">
      <section className="area-personale">
        <h1>Area personale</h1>

        <p className="area-personale__descrizione">
          Ciao!
        </p>

        <section>
          <h2>Le mie recensioni</h2>
          {
            recensioni.length === 0 ? (<p>Non hai ancora recensioni inserite</p>) : (
              recensioni.map((e) => {
                <article key={e.id}>
                  <h3>{e.esame}</h3>
                  <p>Difficoltà: {e.difficolta}</p>
                  <p>Tempo di Studio in settimane: {e.tempo_di_studio_settimane}</p>
                  <p>Tempi di correzione: {e.tempi_di_correzione}</p>
                  <p>Commento: {e.commento}</p>
                </article>
              })
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