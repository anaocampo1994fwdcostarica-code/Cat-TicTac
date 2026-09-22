import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Cat-TicTac</Link>
      <div className="navbar-enlaces">
        <Link to="/">Inicio</Link>
        <Link to="/juego">Juego</Link>
        <Link to="/puntajes">Puntajes</Link>
      </div>
    </nav>
  )
}