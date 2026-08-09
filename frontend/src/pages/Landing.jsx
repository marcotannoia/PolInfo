import SearchBar from '../components/Searchbar'
import './Landing.css' 

export  default function LandingPage() { 

    return ( 
        <main id="home" className="landing-page">
      <section className="hero">
        <p className="hero__eyebrow">
          Informazioni sugli esami universitari
        </p>

        <h1 className="hero__title">
          POL<span>Info</span>
        </h1>

        <p className="hero__description">
          Cerca un esame e scopri informazioni, recensioni ed esperienze
          condivise dagli studenti.
        </p>

        <SearchBar />
      </section>
    </main>
    )
}