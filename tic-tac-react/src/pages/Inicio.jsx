import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

export default function Inicio() {
  const [nombre, setNombre] = useState('')
  const [modo, setModo] = useState('ia')
  const [error, setError] = useState('')
  const nombreRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    nombreRef.current?.focus()
  }, [])

  function comenzarJuego(evento) {
    evento.preventDefault()
    const nombreLimpio = nombre.trim()

    if (!nombreLimpio) {
      setError('Escribe tu nombre para comenzar.')
      nombreRef.current?.focus()
      return
    }

    setError('')
    navigate(`/juego/${encodeURIComponent(nombreLimpio)}?modo=${modo}`)
  }

  return (
    <div className="pagina">
      <Navbar />
      <main className="inicio">
        <h1 className="titulo">Cat-TicTac</h1>
        <p className="subtitulo">El clásico juego de Gato, ahora con React</p>

        <form className="formulario" onSubmit={comenzarJuego}>
          <label htmlFor="nombre">Nombre del jugador</label>
          <input
            id="nombre"
            ref={nombreRef}
            type="text"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            placeholder="Ej. Ana"
            maxLength="20"
          />
          {error && <p className="mensaje-error">{error}</p>}

          <fieldset className="modo-opciones">
            <legend>Modo de juego</legend>
            <label className="modo-opcion">
              <input
                type="radio"
                name="modo"
                value="ia"
                checked={modo === 'ia'}
                onChange={() => setModo('ia')}
              />
              <span>▣&nbsp; vs IA Bot Gatuno</span>
            </label>
            <label className="modo-opcion">
              <input
                type="radio"
                name="modo"
                value="persona"
                checked={modo === 'persona'}
                onChange={() => setModo('persona')}
              />
              <span>♟&nbsp; 2 Jugadores (mismo dispositivo)</span>
            </label>
          </fieldset>

          <button type="submit" className="boton boton-principal">
            Comenzar juego
          </button>
        </form>
      </main>
    </div>
  )
}