export default function Casilla({ valor, posicion, onClick }) {
  return (
    <button
      type="button"
      className={`casilla${valor ? ' ocupada' : ''}`}
      onClick={() => onClick(posicion)}
      disabled={valor !== null}
      aria-label={`Casilla ${posicion + 1}`}
    >
      {valor}
    </button>
  )
}