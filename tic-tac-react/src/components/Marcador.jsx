export default function Marcador({
  jugador,
  turno,
  victorias,
  derrotas,
  empates,
  movimientos,
}) {
  return (
    <div className="marcador" aria-label="Marcador de la partida">
      <div className="marcador-item">
        <span className="marcador-label">Jugador</span>
        <span className="marcador-valor">{jugador}</span>
      </div>
      <div className="marcador-item">
        <span className="marcador-label">Turno de</span>
        <span className="marcador-valor">{turno}</span>
      </div>
      <div className="marcador-item">
        <span className="marcador-label">Victorias</span>
        <span className="marcador-valor">{victorias}</span>
      </div>
      <div className="marcador-item">
        <span className="marcador-label">Derrotas</span>
        <span className="marcador-valor">{derrotas}</span>
      </div>
      <div className="marcador-item">
        <span className="marcador-label">Empates</span>
        <span className="marcador-valor">{empates}</span>
      </div>
      <div className="marcador-item">
        <span className="marcador-label">Movs</span>
        <span className="marcador-valor">{movimientos}</span>
      </div>
    </div>
  )
}