import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="marca" aria-label="Ir al inicio de Cat-TicTac">
        <span className="marca-icono" aria-hidden="true">🐾</span>
        <span>
          <strong><span>Cat-</span>TicTac</strong>
          <small>REACT EDITION</small>
        </span>
      </Link>
      <div className="navbar-acciones">
        <Link to="/puntajes" className="icono-boton" aria-label="Ver puntajes" title="Ver puntajes">☷</Link>
        <Link to="/" className="icono-boton" aria-label="Volver al inicio" title="Volver al inicio">⌂</Link>
      </div>
    </nav>
  )
}