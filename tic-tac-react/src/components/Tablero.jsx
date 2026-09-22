import Casilla from './Casilla.jsx'

export default function Tablero({
  tablero,
  combinacionGanadora = [],
  deshabilitado = false,
  onClickCasilla,
}) {
  return (
    <div className="tablero">
      {tablero.map((valor, posicion) => (
        <Casilla
          key={posicion}
          valor={valor}
          posicion={posicion}
          ganadora={combinacionGanadora.includes(posicion)}
          deshabilitado={deshabilitado}
          onClick={onClickCasilla}
        />
      ))}
    </div>
  )
}