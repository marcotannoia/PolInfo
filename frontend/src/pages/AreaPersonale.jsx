import { useNavigate } from 'react-router-dom';
import './AreaPersonale.css';

export default function AreaPersonale() { 
    const naviga = useNavigate();
    async function logout() { 
        const risposta = await fetch(`${process.env.REACT_APP_API_URL}/api/autenticazione/logout`,
                        {method: 'POST',credentials: 'include'});
        if (risposta.ok) {
            naviga('/login');
        } 
    }
    return (
        <main className="pagina-area-personale">
      <section className="area-personale">
        <h1>Area personale</h1>

        <p className="area-personale__descrizione">
          Ciao!
        </p>

        <div className="area-personale__azioni">
         <button type="button" onClick = {logout}> Logout </button>
        </div>
      </section>
    </main> 
    );
}