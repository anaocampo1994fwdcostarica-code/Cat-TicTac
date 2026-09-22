const API_URL = 'http://localhost:3000/partidas'

export async function obtenerPartidas() {
  try {
    const respuesta = await fetch(API_URL)
    if (!respuesta.ok) {
      throw new Error('Error al obtener las partidas')
    }
    return await respuesta.json()
  } catch {
    throw new Error('No se pudieron cargar las partidas.')
  }
}

export async function guardarPartida(partida) {
  try {
    const respuesta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partida),
    })
    if (!respuesta.ok) {
      throw new Error('Error al guardar la partida')
    }
    return await respuesta.json()
  } catch {
    throw new Error('No fue posible guardar la partida.')
  }
}