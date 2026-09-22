import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Marcador from '../components/Marcador.jsx'
import Navbar from '../components/Navbar.jsx'
import Resultado from '../components/Resultado.jsx'
import Tablero from '../components/Tablero.jsx'
import useJuego from '../hooks/useJuego.js'
import { guardarPartida } from '../services/api.js'
import { enviarResultadoN8N } from '../services/n8n.js'

export default function Juego() {
  const { jugador } = useParams()
  const navigate = useNavigate()
  const {
    tablero,
    turno,
    ganador,
    empate,
    movimientos,
    realizarMovimiento,
    reiniciarPartida,
  } = useJuego()

  const [marcador, setMarcador] = useState({ victorias: 0, derrotas: 0, empates: 0 })
  const [mensaje, setMensaje] = useState('')
  const registradaRef = useRef(false)

  useEffect(() => {
    if (!jugador) {
      navigate('/', { replace: true })
    }
  }, [jugador, navigate])

  const partidaTerminada = ganador !== null || empate

  useEffect(() => {
    if (!partidaTerminada || registradaRef.current) return
    registradaRef.current = true

    let resultado = 'Empate'
    if (ganador) {
      resultado = ganador === 'X' ? 'Victoria' : 'Derrota'
    }

    setMarcador((actual) => ({
      victorias: actual.victorias + (resultado === 'Victoria' ? 1 : 0),
      derrotas: actual.derrotas + (resultado === 'Derrota' ? 1 : 0),
      empates: actual.empates + (resultado === 'Empate' ? 1 : 0),
    }))

    const partida = {
      jugador,
      resultado,
      ganador: ganador || 'Empate',
      movimientos,
      fecha: new Date().toISOString().slice(0, 10),
    }

    async function registrarPartida() {
      try {
        await guardarPartida(partida)
      } catch {
        setMensaje('No fue posible guardar la partida.')
        return
      }

      try {
        await enviarResultadoN8N(partida)
      } catch {
        setMensaje('Partida guardada, pero no fue posible conectar con n8n.')
      }
    }

    registrarPartida()
  }, [partidaTerminada, jugador, movimientos]) // eslint-disable-line react-hooks/exhaustive-deps

  function nuevoJuego() {
    registradaRef.current = false
    setMensaje('')
    reiniciarPartida()
  }

  if (!jugador) return null

  return (
    <div className="pagina">
      <Navbar />
      <main className="juego">
        <h1 className="titulo-pagina">Hola, {jugador}!</h1>

        <Marcador
          jugador={jugador}
          turno={turno}
          victorias={marcador.victorias}
          derrotas={marcador.derrotas}
          empates={marcador.empates}
          movimientos={movimientos}
        />

        <Tablero tablero={tablero} onClickCasilla={realizarMovimiento} />

        <div className="acciones">
          <button type="button" className="boton" onClick={nuevoJuego}>
            Reiniciar partida
          </button>
        </div>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        {partidaTerminada && (
          <Resultado ganador={ganador} jugador={jugador} onReiniciar={nuevoJuego} />
        )}
      </main>
    </div>
  )
}