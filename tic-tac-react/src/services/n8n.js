// Reemplaza esta URL con la URL real del webhook cuando configures n8n.
const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/tic-tac-react'

export async function enviarResultadoN8N(resultado) {
  try {
    const respuesta = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resultado),
    })
    if (!respuesta.ok) {
      throw new Error('Error al comunicarse con n8n')
    }
    return await respuesta.json()
  } catch {
    throw new Error('No fue posible conectar con n8n.')
  }
}