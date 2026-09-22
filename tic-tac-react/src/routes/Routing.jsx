import { Navigate, Route, Routes } from 'react-router-dom'
import Inicio from '../pages/Inicio.jsx'
import Juego from '../pages/Juego.jsx'
import Puntajes from '../pages/Puntajes.jsx'

export default function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/juego" element={<Juego />} />
      <Route path="/juego/:jugador" element={<Juego />} />
      <Route path="/puntajes" element={<Puntajes />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}