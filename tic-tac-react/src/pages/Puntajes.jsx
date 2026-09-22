import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { obtenerPartidas } from '../services/api.js'

export default function Puntajes() {
  const [partidas, setPartidas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const datos = await obtenerPartidas()
        setPartidas(datos)
      } catch {
        setError('No se pudieron cargar las partidas.')
      } finally {
        setCargando(false)
      }
    }

    cargar()
  }, [])

  return (
    <div className="pagina">
      <Navbar />
      <main className="puntajes">
        <h1 className="titulo-pagina">Puntajes</h1>

        {cargando && <p className="mensaje">Cargando partidas...</p>}

        {!cargando && error && <p className="mensaje-error">{error}</p>}

        {!cargando && !error && partidas.length === 0 && (
          <p className="mensaje">No hay partidas registradas.</p>
        )}

        {!cargando && !error && partidas.length > 0 && (
          <div className="tabla-contenedor">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Jugador</th>
                  <th>Resultado</th>
                  <th>Movimientos</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {partidas.map((partida) => (
                  <tr key={partida.id}>
                    <td>{partida.jugador}</td>
                    <td>{partida.resultado}</td>
                    <td>{partida.movimientos}</td>
                    <td>{partida.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}