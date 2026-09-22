const API_BASE = 'http://localhost:4000/api/game'

async function manejarRespuesta(respuesta) {
  if (!respuesta.ok) {
    throw new Error('La API del juego respondió con un error.')
  }
  return respuesta.json()
}

export const gameApi = {
  // Crear nueva partida
  startNewGame: async (playerName = 'Ana', mode = 'ia') => {
    try {
      const res = await fetch(`${API_BASE}/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName, mode }),
      })
      return await manejarRespuesta(res)
    } catch {
      throw new Error('No fue posible crear la partida.')
    }
  },

  // Hacer un tiro (0-8)
  makeMove: async (gameId, index, player = 'X') => {
    try {
      const res = await fetch(`${API_BASE}/${gameId}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index, player }),
      })
      return await manejarRespuesta(res)
    } catch {
      throw new Error('No fue posible realizar el movimiento.')
    }
  },

  // Reiniciar partida actual
  resetGame: async (gameId) => {
    try {
      const res = await fetch(`${API_BASE}/${gameId}/reset`, {
        method: 'POST',
      })
      return await manejarRespuesta(res)
    } catch {
      throw new Error('No fue posible reiniciar la partida.')
    }
  },
}