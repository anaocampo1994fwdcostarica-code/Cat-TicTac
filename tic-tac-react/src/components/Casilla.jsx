export default function Casilla({ valor, posicion, ganadora, deshabilitado = false, onClick }) {
  const clases = [
    'casilla',
    valor ? 'ocupada' : '',
    valor || '',
    ganadora ? 'ganadora' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={clases}
      onClick={() => onClick(posicion)}
      disabled={valor !== null || deshabilitado}
      aria-label={`Casilla ${posicion + 1}`}
    >
      {valor === 'X' ? <span className="simbolo-x" aria-label="X">×</span> : valor === 'O' ? (
        <span className="simbolo-o" aria-label="Huella de gato">
          <i className="huella-dedo huella-dedo-1" />
          <i className="huella-dedo huella-dedo-2" />
          <i className="huella-dedo huella-dedo-3" />
          <i className="huella-dedo huella-dedo-4" />
          <i className="huella-almohadilla" />
        </span>
      ) : <span className="casilla-vacia" aria-hidden="true" />}
    </button>
  )
}