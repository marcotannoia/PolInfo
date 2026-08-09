import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { House } from 'lucide-react';
import { UserRound } from 'lucide-react';

function Navbar() {
  const URL_API = process.env.REACT_APP_API_URL;
  const naviga = useNavigate(); 

    async function verificaLogin() { 
    const risposta = await fetch(
        `${URL_API}/api/autenticazione/me`,
        {method: 'GET',credentials: 'include',});

    if (!risposta.ok) { 
      naviga('/login')
    } else { 
      naviga('/area-personale')
    }
    return;
  }

  function tornaAllaHome() { 
    naviga('/')
  }

  return (
    <nav className="navbar" aria-label="Navigazione principale">
      <a
        onClick={tornaAllaHome}
        className="navbar__link"
        aria-label="Torna alla home"
        title="Home"
      >
      <House
        size={22}
        aria-hidden="true"
/>
      </a>

      <a
        onClick={verificaLogin}
        className="navbar__link"
        aria-label="Torna alla home"
        title="Home"
      >
      <UserRound
        size={22}
        aria-hidden="true"
/>
      </a>
    </nav>
  );
}

export default Navbar;