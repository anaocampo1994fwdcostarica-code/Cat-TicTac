import Casilla from './Casilla.jsx'

export default function Tablero({ tablero, onClickCasilla }) {
  return (
    <div className="tablero">
      {tablero.map((valor, posicion) => (
        <Casilla
          key={posicion}
          valor={valor}
          posicion={posicion}
          onClick={onClickCasilla}
        />
      ))}
    </div>
  )
}