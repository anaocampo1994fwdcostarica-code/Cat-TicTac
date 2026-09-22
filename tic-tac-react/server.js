import http from 'node:http'

const PORT = 4000
const partidas = new Map()
const estadisticas = new Map()
const lineasGanadoras = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function crearId() {
  return `game_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function obtenerEstadisticas(nombre) {
  return estadisticas.get(nombre) ?? { wins: 0, losses: 0, draws: 0 }
}

function revisarTablero(tablero) {
  for (const linea of lineasGanadoras) {
    const [primera, segunda, tercera] = linea
    if (
      tablero[primera] &&
      tablero[primera] === tablero[segunda] &&
      tablero[primera] === tablero[tercera]
    ) {
      return { winner: tablero[primera], winningLine: linea }
    }
  }

  if (tablero.every(Boolean)) {
    return { winner: null, winningLine: null }
  }

  return { winner: null, winningLine: null }
}

function terminarPartida(partida, resultado) {
  partida.status = resultado.winner || partida.board.every(Boolean) ? 'FINISHED' : 'IN_PROGRESS'
  partida.winner = resultado.winner
  partida.winningLine = resultado.winningLine

  if (partida.status === 'FINISHED' && !partida.resultadoRegistrado) {
    const stats = obtenerEstadisticas(partida.playerName)
    if (partida.winner === 'X') stats.wins += 1
    else if (partida.winner === 'O') stats.losses += 1
    else stats.draws += 1
    estadisticas.set(partida.playerName, stats)
    partida.resultadoRegistrado = true
  }
}

function movimientoIa(tablero) {
  const libres = tablero
    .map((valor, indice) => (valor === null ? indice : null))
    .filter((indice) => indice !== null)

  if (!libres.length) return null
  const preferidas = [4, 0, 2, 6, 8, 1, 3, 5, 7]
  return preferidas.find((indice) => libres.includes(indice))
}

function estadoPublico(partida) {
  return {
    gameId: partida.gameId,
    playerName: partida.playerName,
    mode: partida.mode,
    board: partida.board,
    turn: partida.turn,
    movesCount: partida.movesCount,
    status: partida.status,
    winner: partida.winner,
    winningLine: partida.winningLine,
    stats: obtenerEstadisticas(partida.playerName),
  }
}

function responder(respuesta, estado, datos) {
  respuesta.writeHead(estado, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  })
  respuesta.end(JSON.stringify(datos))
}

function leerCuerpo(req) {
  return new Promise((resolve, reject) => {
    let cuerpo = ''
    req.on('data', (trozo) => {
      cuerpo += trozo
    })
    req.on('end', () => {
      try {
        resolve(cuerpo ? JSON.parse(cuerpo) : {})
      } catch {
        reject(new Error('JSON inválido'))
      }
    })
    req.on('error', reject)
  })
}

const servidor = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    })
    res.end()
    return
  }

  const url = new URL(req.url, `http://${req.headers.host}`)
  const partes = url.pathname.split('/').filter(Boolean)

  try {
    if (req.method === 'POST' && partes.length === 3 && partes[0] === 'api' && partes[1] === 'game' && partes[2] === 'new') {
      const cuerpo = await leerCuerpo(req)
      const partida = {
        gameId: crearId(),
        playerName: String(cuerpo.playerName || 'Ana'),
        mode: cuerpo.mode === 'persona' ? 'persona' : 'ia',
        board: Array(9).fill(null),
        turn: 'X',
        movesCount: 0,
        status: 'IN_PROGRESS',
        winner: null,
        winningLine: null,
        resultadoRegistrado: false,
      }
      partidas.set(partida.gameId, partida)
      responder(res, 201, estadoPublico(partida))
      return
    }

    if (partes.length === 4 && partes[0] === 'api' && partes[1] === 'game') {
      const partida = partidas.get(partes[2])
      if (!partida) {
        responder(res, 404, { error: 'Partida no encontrada.' })
        return
      }

      if (req.method === 'POST' && partes[3] === 'reset') {
        partida.board = Array(9).fill(null)
        partida.turn = 'X'
        partida.movesCount = 0
        partida.status = 'IN_PROGRESS'
        partida.winner = null
        partida.winningLine = null
        partida.resultadoRegistrado = false
        responder(res, 200, estadoPublico(partida))
        return
      }

      if (req.method === 'POST' && partes[3] === 'move') {
        const cuerpo = await leerCuerpo(req)
        const indice = Number(cuerpo.index)
        const jugador = String(cuerpo.player || '')

        if (
          !Number.isInteger(indice) ||
          indice < 0 || indice > 8 ||
          partida.board[indice] !== null ||
          partida.status !== 'IN_PROGRESS'
        ) {
          responder(res, 400, { error: 'Movimiento no válido.' })
          return
        }

        if ((jugador !== 'X' && jugador !== 'O') || jugador !== partida.turn) {
          responder(res, 400, { error: 'No es tu turno.' })
          return
        }

        partida.board[indice] = jugador
        partida.movesCount += 1
        let resultado = revisarTablero(partida.board)
        if (resultado.winner || partida.board.every(Boolean)) {
          terminarPartida(partida, resultado)
        } else if (partida.mode === 'ia') {
          const indiceIa = movimientoIa(partida.board)
          if (indiceIa !== null) {
            partida.board[indiceIa] = 'O'
            partida.movesCount += 1
            resultado = revisarTablero(partida.board)
            if (resultado.winner || partida.board.every(Boolean)) {
              terminarPartida(partida, resultado)
            } else {
              partida.turn = 'X'
            }
          }
        } else {
          partida.turn = partida.turn === 'X' ? 'O' : 'X'
        }

        responder(res, 200, estadoPublico(partida))
        return
      }
    }

    responder(res, 404, { error: 'Ruta no encontrada.' })
  } catch (error) {
    responder(res, 400, { error: error.message })
  }
})

servidor.listen(PORT, () => {
  console.log(`API del juego disponible en http://localhost:${PORT}`)
})
