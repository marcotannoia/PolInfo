import { Route, Routes } from 'react-router-dom';

import './App.css';
import LandingPage from './pages/Landing';
import Dettagli from './pages/Dettagli';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Registrazione from './pages/Registrazione';
import AreaPersonale from './pages/AreaPersonale';
function App() {
  return (
    <>
      <Navbar />

      <Routes>
  <Route
    path="/"
    element={<LandingPage />}
  />

  <Route
    path="/dettagli"
    element={<Dettagli />}
  />

  <Route
    path="/login"
    element={<Login />}
  />

  <Route
    path="/sign-up"
    element={<Registrazione />}
  />
  <Route 
    path="/area-personale"
    element={<AreaPersonale />}
    />
</Routes>
    </>
  );
}

export default App;