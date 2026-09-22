import { useState } from 'react'
import { gameApi } from '../services/gameApi.js'

export default function useJuego() {
  const [partida, setPartida] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const tablero = partida?.board ?? Array(9).fill(null)
  const turno = partida?.turn ?? 'X'
  const ganador = partida?.winner ?? null
  const partidaTerminada = partida != null && partida.status !== 'IN_PROGRESS'
  const empate = partidaTerminada && !ganador
  const movimientos = partida?.movesCount ?? 0
  const combinacionGanadora = partida?.winningLine ?? []
  const stats = partida?.stats ?? { wins: 0, losses: 0, draws: 0 }
  const modo = partida?.mode ?? 'ia'
  const gameId = partida?.gameId ?? null

  async function iniciar(jugador, modoJuego = 'ia') {
    setCargando(true)
    setError('')
    try {
      const datos = await gameApi.startNewGame(jugador, modoJuego)
      setPartida(datos)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  async function realizarMovimiento(posicion) {
    if (!gameId || partidaTerminada || tablero[posicion] !== null || cargando) return
    setError('')
    setCargando(true)
    try {
      const datos = await gameApi.makeMove(gameId, posicion, turno)
      setPartida(datos)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  async function reiniciarPartida() {
    if (!gameId) return
    setError('')
    setCargando(true)
    try {
      const datos = await gameApi.resetGame(gameId)
      setPartida(datos)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return {
    partida,
    gameId,
    tablero,
    turno,
    ganador,
    empate,
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
  }
}