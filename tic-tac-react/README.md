# Tic Tac React

Juego de Gato (Tic Tac Toe) hecho con **React**, **Vite** y **React Router DOM**.

El jugador ingresa su nombre, juega al Gato 3x3 contra otra persona en el mismo
dispositivo, y al terminar la partida el resultado se guarda en **JSON Server**
y se envía a un **Webhook de n8n**. Se puede consultar el historial de partidas.

## Descripción

Aplicación web de una sola página (SPA) con tres vistas: inicio, juego y puntajes.

- El jugador escribe su nombre para comenzar.
- Los turnos alternan entre X y O (X siempre empieza).
- Al terminar, se detecta ganador o empate automáticamente.
- El resultado se registra en JSON Server y se notifica a n8n.
- Puntajes muestra el historial de partidas guardadas.

## Características

- Tablero 3x3 responsive.
- Detección de ganador, empate y casillas ocupadas.
- Marcador con turno, victorias, derrotas, empates y movimientos.
- Guardado de partidas con JSON Server (`GET` y `POST`).
- Integración con n8n mediante Webhook.
- Diseño moderno con violeta, azul y blanco.
- Manejo de errores visuales (nombre vacío, carga de partidas, n8n caído, etc.).

> Si n8n no está disponible, la partida **no se pierde**: se guarda en JSON
> Server y se muestra: *"Partida guardada, pero no fue posible conectar con n8n."*

## Tecnologías utilizadas

- React
- Vite
- JavaScript
- React Router DOM
- JSON Server
- Fetch API (n8n mediante Webhook)
- CSS normal (sin frameworks CSS)

No se utiliza TypeScript, Redux ni bases de datos externas.

## Requisitos previos

- Node.js 20.19 o superior (incluye `npm`).
- Opcional: [n8n](https://n8n.io) corriendo localmente.
- Opcional: [JSON Server](https://github.com/typicode/json-server) v0.17.4 (ya viene como dependencia).

## Instalación

```bash
npm install
```

## Ejecución del proyecto

En terminales separadas (cada comando se corre dentro de la carpeta del proyecto):

**1. Aplicación (Vite):**

```bash
npm run dev
```

Abre `http://localhost:5173`.

**2. API del juego:**

En otra terminal, desde `tic-tac-react/`, ejecuta:

```bash
npm run api
```

La API queda disponible en `http://localhost:4000` y expone las rutas
`POST /api/game/new`, `POST /api/game/:id/move` y `POST /api/game/:id/reset`.

**3. JSON Server (historial de partidas):**

```bash
npm run json-server
```

o su equivalente con npx:

```bash
npx json-server --watch db.json --port 3000
```

Abre `http://localhost:3000/partidas` para ver las partidas guardadas.

## Estructura del proyecto

```
tic-tac-react/
├── public/          # Archivos estáticos (favicon)
├── src/
│   ├── components/  # Componentes reutilizables (Navbar, Tablero, Casilla, Marcador, Resultado)
│   ├── pages/       # Páginas (Inicio, Juego, Puntajes)
│   ├── routes/      # Definición de rutas (Routing.jsx)
│   ├── services/    # Llamadas a la API y a n8n (api.js, n8n.js)
│   ├── hooks/       # Lógica del juego (useJuego.js)
│   ├── App.jsx      # Componente raíz
│   ├── main.jsx     # Punto de entrada
│   └── index.css    # Estilos globales
├── n8n/             # Workflow de n8n (JSON) y su documentación
├── db.json          # Base de datos local de JSON Server
├── README.md
├── package.json
└── vite.config.js
```

## Rutas

| Ruta              | Página    | Descripción                                   |
| ----------------- | --------- | --------------------------------------------- |
| `/`               | Inicio    | Ingreso del nombre del jugador                |
| `/juego/:jugador` | Juego     | Tablero del juego (ruta dinámica con el nombre) |
| `/puntajes`       | Puntajes  | Historial de partidas                         |

Si se visita `/juego` sin nombre, se redirige automáticamente al inicio.

## API

Servicio en `src/services/api.js` usando Fetch API contra JSON Server
(`http://localhost:3000`).

### GET /partidas — `obtenerPartidas()`

Devuelve todas las partidas registradas.

### POST /partidas — `guardarPartida(partida)`

Guarda una partida nueva. Cada partida tiene:

```json
{
  "id": 1,
  "jugador": "Ana",
  "resultado": "Victoria",
  "ganador": "X",
  "movimientos": 7,
  "fecha": "2026-09-21"
}
```

Ambas funciones manejan errores con `try/catch` y lanzan mensajes legibles.

## n8n

Flujo para registrar y notificar el resultado de cada partida:

```
Webhook
   ↓
Condición IF: ¿es "Victoria"?
   ↓ true / ↓ false
Mensaje (Set)
   ↓
Guardar en JSON Server (HTTP Request)
   ↓
Responder al Webhook
```

El workflow listo para importar está en `n8n/tic-tac-react-workflow.json`
(ver `n8n/README-N8N.md` para los pasos de configuración).

**Webhook inicial:**

```
http://localhost:5678/webhook/tic-tac-react
```

> **IMPORTANTE:** Esta URL debe reemplazarse por la URL real del webhook cuando
> se configure y active n8n. Está definida en la constante `N8N_WEBHOOK_URL`
> dentro de `src/services/n8n.js` con un comentario que lo indica.

## Hooks utilizados

- **useState:** maneja tablero, turno, ganador, empate, movimientos, nombre del jugador y marcador. Nunca se muta el estado directamente; siempre se usan los setters.
- **useEffect:** detecta el fin de la partida, prepara el registro del resultado y ejecuta las acciones de guardado (JSON Server + n8n). También enfoca el input en el inicio.
- **useRef:** en `Inicio.jsx` controla el campo de nombre (enfoque automático al cargar la página y al enviar el formulario vacío). En `Juego.jsx` evita registrar la misma partida dos veces.
- **useJuego (custom hook):** centraliza la lógica del juego: tablero, turno, ganador, movimientos, realizar movimiento, comprobar ganador/empate y reiniciar.

## Cómo jugar

1. Entra a `/`, escribe tu nombre y presiona **Comenzar juego**.
2. X juega primero; los turnos se alternan entre X y O en el mismo dispositivo.
3. Toca una casilla vacía para colocar tu símbolo.
4. Gana quien complete una fila, columna o diagonal con el mismo símbolo.
5. Si no queda ninguna casilla libre, es **empate**.
6. Puedes reiniciar la partida en cualquier momento con **Reiniciar partida**.

## Verificación rápida

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run json-server
```

Con esto el juego funciona completo. n8n es opcional para ver el mensaje de
felicitación; si no está activo, solo se muestra el aviso de que no fue posible
conectarse.