# Tic Tac React

Juego de Gato (Tic Tac Toe) hecho con **React**, **Vite** y **React Router DOM**.

El jugador ingresa su nombre, elige jugar contra la **IA** o en modo
**2 jugadores** en el mismo dispositivo, y al terminar la partida el resultado
se envía a un **Webhook de n8n** (que lo registra en JSON Server). Si n8n no
está activo, la app guarda la partida directamente en **JSON Server** como
respaldo. Se puede consultar el historial de partidas.

## Descripción

Aplicación web de una sola página (SPA) con tres vistas: inicio, juego y puntajes.

- El jugador escribe su nombre y elige el modo de juego (IA o 2 jugadores).
- Los turnos alternan entre X y O (X siempre empieza).
- Al terminar, se detecta ganador o empate automáticamente.
- El resultado se registra en JSON Server y se notifica a n8n.
- Puntajes muestra el historial de partidas guardadas.

## Características

- Tablero 3x3 responsive.
- Detección de ganador, empate y casillas ocupadas.
- Dos modos de juego: **vs IA Bot Gatuno** o **2 jugadores** (mismo dispositivo).
- Marcador con turno, victorias, derrotas, empates y movimientos.
- Guardado de partidas: n8n como vía principal y JSON Server como respaldo.
- Integración con n8n mediante Webhook.
- Diseño moderno con violeta, azul y blanco.
- Manejo de errores visuales (nombre vacío, carga de partidas, n8n caído, etc.).

> Si n8n no está disponible, la partida **no se pierde**: la app la guarda en
> JSON Server y se muestra: *"Partida guardada, pero no fue posible conectar con n8n."*

## Modos de juego

En el inicio se elige entre:

- **vs IA Bot Gatuno:** el jugador (X) compite contra la IA (O) en el mismo tablero.
- **2 Jugadores:** X y O se alternan en el mismo dispositivo; la API valida el
  turno y rechaza movimientos fuera de turno.

El modo se transmite como parámetro de la URL: `/juego/:jugador?modo=ia` o
`/juego/:jugador?modo=persona`.

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

| Ruta                    | Página    | Descripción                                         |
| ----------------------- | --------- | --------------------------------------------------- |
| `/`                     | Inicio    | Ingreso del nombre y selección del modo de juego    |
| `/juego/:jugador`       | Juego     | Tablero del juego (ruta dinámica con el nombre)     |
| `/juego/:jugador?modo=…`| Juego     | `modo=ia` (por defecto) o `modo=persona` (2 jugadores) |
| `/puntajes`             | Puntajes  | Historial de partidas                               |

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

Flujo para registrar y notificar el resultado de cada partida. La app envía el
resultado al Webhook de n8n; si la comunicación falla, repite el guardado
directamente en JSON Server como respaldo (por eso el historial nunca se pierde):

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
(ver `n8n/README-N8N.md` para los pasos de configuración). Consta de: el
Webhook de entrada, un nodo **IF** que ramifica según el resultado, dos nodos
**Set** que asignan el mensaje, un nodo **HTTP Request** que persiste la partida
en JSON Server (`POST http://localhost:3000/partidas`) y el nodo final
**Respond to Webhook** que devuelve `{ jugador, resultado, mensaje }`.

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

1. Entra a `/`, escribe tu nombre y elige el modo: **vs IA Bot Gatuno** o **2 Jugadores**.
2. Presiona **Comenzar juego**. X juega primero.
3. En modo 2 jugadores, los turnos alternan entre X y O en el mismo dispositivo.
4. Toca una casilla vacía para colocar tu símbolo.
5. Gana quien complete una fila, columna o diagonal con el mismo símbolo.
6. Si no queda ninguna casilla libre, es **empate**.
7. Puedes reiniciar la partida en cualquier momento con **Reiniciar partida**.

## Verificación rápida

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run api

# Terminal 3
npm run json-server
```

Con esto el juego funciona completo. n8n es opcional: si está activo, registra la
partida y responde el mensaje; si no, la app guarda la partida directamente y
muestra el aviso de que no fue posible conectarse.