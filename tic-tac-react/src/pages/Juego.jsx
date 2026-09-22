import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Marcador from '../components/Marcador.jsx'
import Navbar from '../components/Navbar.jsx'
import Resultado from '../components/Resultado.jsx'
import Tablero from '../components/Tablero.jsx'
import useJuego from '../hooks/useJuego.js'
import { guardarPartida } from '../services/api.js'
import { enviarResultadoN8N } from '../services/n8n.js'

export default function Juego() {
  const { jugador } = useParams()
  const [searchParams] = useSearchParams()
  const modoSeleccionado = searchParams.get('modo') === 'persona' ? 'persona' : 'ia'
  const navigate = useNavigate()
  const {
    tablero,
    turno,
    ganador,
    movimientos,
    combinacionGanadora,
    stats,
    modo,
    partidaTerminada,
    cargando,
    error,
    iniciar,
    realizarMovimiento,
    reiniciarPartida,
  } = useJuego()

  const [mensaje, setMensaje] = useState('')
  const iniciadaRef = useRef(false)
  const registradaRef = useRef(false)

  useEffect(() => {
    if (!jugador) {
      navigate('/', { replace: true })
      return
    }
    if (!iniciadaRef.current) {
      iniciadaRef.current = true
      iniciar(jugador, modoSeleccionado)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jugador, navigate])

  useEffect(() => {
    if (!partidaTerminada || registradaRef.current) return
    registradaRef.current = true

    let resultado = 'Empate'
    if (ganador) {
      resultado = ganador === 'X' ? 'Victoria' : 'Derrota'
    }

    const partida = {
      jugador,
      resultado,
      ganador: ganador || 'Empate',
      movimientos,
      fecha: new Date().toISOString().slice(0, 10),
    }

    async function registrarPartida() {
      try {
        await enviarResultadoN8N(partida)
        return
      } catch {
        // n8n no está disponible: se usa JSON Server como respaldo
      }

      try {
        await guardarPartida(partida)
      } catch {
        setMensaje('No fue posible guardar la partida.')
        return
      }

      setMensaje('Partida guardada, pero no fue posible conectar con n8n.')
    }

    registrarPartida()
  }, [partidaTerminada, ganador, movimientos, jugador])

  function nuevoJuego() {
    registradaRef.current = false
    setMensaje('')
    reiniciarPartida()
  }

  if (!jugador) return null

  const oponente = modo === 'ia' ? 'la IA' : 'el jugador O'

  return (
    <div className="pagina">
      <Navbar />
      <main className="juego">
        <div className="saludo-fila">
          <h1 className="titulo-pagina">¡Hola, <span>{jugador}!</span></h1>
          <span className="estado-partida"><i /> En juego</span>
        </div>

        <div className="turno-actual">
          <span>TURNO DE</span>
          <strong>{turno === 'X' ? jugador : oponente}</strong>
          <b>{turno}</b>
        </div>

        {error && <p className="mensaje-error">{error}</p>}

        {cargando && !tablero.some((celda) => celda !== null) && (
          <p className="mensaje">Cargando partida...</p>
        )}

        <Marcador
          jugador={jugador}
          turno={turno}
          victorias={stats.wins}
          derrotas={stats.losses}
          empates={stats.draws}
          movimientos={movimientos}
        />

        <Tablero
          tablero={tablero}
          combinacionGanadora={combinacionGanadora}
          deshabilitado={cargando}
          onClickCasilla={realizarMovimiento}
        />

        <div className="acciones">
          <div className="modo-partida" aria-label="Modo de juego">
            {modo === 'ia' ? (
              <span className="modo-activo">▣ &nbsp;vs IA Bot Gatuno</span>
            ) : (
              <span className="modo-activo">♟ &nbsp;2 Jugadores</span>
            )}
          </div>
          <button
            type="button"
            className="boton boton-reiniciar"
            onClick={nuevoJuego}
            disabled={cargando}
          >
            ↻ &nbsp; Reiniciar partida
          </button>
        </div>

        {mensaje && <p className="mensaje">{mensaje}</p>}

        {partidaTerminada && (
          <Resultado
            ganador={ganador}
            jugador={jugador}
            oponente={oponente}
            onReiniciar={nuevoJuego}
          />
        )}
      </main>
    </div>
  )
}