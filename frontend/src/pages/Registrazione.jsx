import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const URL_API = process.env.REACT_APP_API_URL;

export default function Registrazione() { 
    const naviga = useNavigate(); 
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');

    async function gestisciRegistrazione(e) { 
        e.preventDefault(); 

        try { 
            const risposta = await fetch(`${URL_API}/api/autenticazione/registrazione`, {
              method : 'POST',
              headers : { 
                'Content-Type' : 'application/json'
                }, 
              body : JSON.stringify({
                email, password
              })
              });
            const dati = await risposta.json(); 

            if (!risposta.ok) {
                alert(dati.error);
                return;
            }

        alert('Registrazione effettuata.');
        naviga('/');

        } catch  (err) { 
            alert('Impossibile contattare il server.');
        }

    }
    return (
    <main className="pagina-login">
      <section className="login">
        <h1>Registrati</h1>

        <p className="login__descrizione">
          Registrati per utilizzare la tua area personale e lasciare recensioni.
        </p>

        <form onSubmit={gestisciRegistrazione}>
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          <button type="submit">
            Registrati
          </button>
        </form>
      </section>
    </main>
  );
}