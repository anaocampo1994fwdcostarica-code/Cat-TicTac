import { useState } from 'react'

const COMBINACIONES_GANADORAS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export default function useJuego() {
  const [tablero, setTablero] = useState(Array(9).fill(null))
  const [turno, setTurno] = useState('X')
  const [ganador, setGanador] = useState(null)
  const [empate, setEmpate] = useState(false)
  const [movimientos, setMovimientos] = useState(0)

  function comprobarGanador(nuevoTablero) {
    for (const combinacion of COMBINACIONES_GANADORAS) {
      const [a, b, c] = combinacion
      if (
        nuevoTablero[a] &&
        nuevoTablero[a] === nuevoTablero[b] &&
        nuevoTablero[a] === nuevoTablero[c]
      ) {
        return nuevoTablero[a]
      }
    }
    return null
  }

  function comprobarEmpate(nuevoTablero) {
    return nuevoTablero.every((casilla) => casilla !== null)
  }

  function realizarMovimiento(posicion) {
    if (tablero[posicion] !== null || ganador || empate) return

    const nuevoTablero = [...tablero]
    nuevoTablero[posicion] = turno

    const nuevoGanador = comprobarGanador(nuevoTablero)
    const nuevoEmpate = comprobarEmpate(nuevoTablero)

    setTablero(nuevoTablero)
    setMovimientos((mov) => mov + 1)

    if (nuevoGanador) {
      setGanador(nuevoGanador)
    } else if (nuevoEmpate) {
      setEmpate(true)
    } else {
      setTurno((t) => (t === 'X' ? 'O' : 'X'))
    }
  }

  function reiniciarPartida() {
    setTablero(Array(9).fill(null))
    setTurno('X')
    setGanador(null)
    setEmpate(false)
    setMovimientos(0)
  }

  return {
    tablero,
    turno,
    ganador,
    empate,
    movimientos,
    realizarMovimiento,
    comprobarGanador,
    comprobarEmpate,
    reiniciarPartida,
  }
}