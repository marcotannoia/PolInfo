import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const URL_API = process.env.REACT_APP_API_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const naviga = useNavigate();

  async function gestioneLogin(event) {
    event.preventDefault();
    const credenziali = {email,password};
    try {
      const risposta = await fetch(
        `${URL_API}/api/autenticazione/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(credenziali)
        }
      );

      const dati = await risposta.json();

      if (!risposta.ok) {
        alert(dati.error);
        return;
      }

      alert('Accesso effettuato.');
      naviga('/area-personale');
    } catch {
      alert('Impossibile contattare il server.');
    }
  }

  return (
    <main className="pagina-login">
      <section className="login">
        <h1>Accedi</h1>

        <p className="login__descrizione">
          Accedi per utilizzare la tua area personale e lasciare recensioni.
        </p>

        <form onSubmit={gestioneLogin}>
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
            Accedi
          </button>
        </form>

        <p className="login__registrazione">
          Non hai un account?{' '}
          <Link to="/sign-up">
            Registrati
          </Link>
        </p>
      </section>
    </main>
  );
}