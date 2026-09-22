import { useNavigate } from 'react-router-dom'

export default function Resultado({ ganador, jugador, oponente = 'el jugador O', onReiniciar }) {
  const navigate = useNavigate()
  const esEmpate = ganador === null

  return (
    <div className="resultado">
      {esEmpate ? (
        <p className="resultado-titulo">¡Empate!</p>
      ) : (
        <p className="resultado-titulo">
          {ganador === 'X' ? `${jugador} gana la partida` : `Gana ${oponente}`}
        </p>
      )}
      <p className="resultado-mensaje">
        {esEmpate
          ? 'No quedaron casillas libres.'
          : `La combinación ganadora es de ${ganador}.`}
      </p>
      <div className="resultado-acciones">
        <button type="button" className="boton boton-principal" onClick={onReiniciar}>
          Jugar nuevamente
        </button>
        <button type="button" className="boton" onClick={() => navigate('/puntajes')}>
          Ir a puntajes
        </button>
      </div>
    </div>
  )
}