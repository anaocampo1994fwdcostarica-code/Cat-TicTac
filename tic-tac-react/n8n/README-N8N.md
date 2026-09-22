# n8n - Workflow de Tic Tac React

Este documento explica cómo configurar la integración con n8n para el juego de Gato.

## Flujo del workflow

```
Webhook (POST /webhook/tic-tac-react)
        ↓
Condición IF: ¿resultado === "Victoria"?
        ↓ (true)                        ↓ (false)
Mensaje de victoria            Mensaje de empate o derrota
        ↓                                    ↓
Guardar resultado en JSON Server (POST http://localhost:3000/partidas)
        ↓
Responder al Webhook (respuesta al frontend)
```

## Nodos incluidos

1. **Webhook** — Recibe el resultado enviado por el frontend con `POST`.
2. **Condición: ¿Victoria?** — Nodo IF que comprueba si `resultado === "Victoria"`.
3. **Mensaje de victoria** — Asigna `mensaje = "¡Felicidades! Ganaste la partida."`
4. **Mensaje de empate o derrota** — Asigna `mensaje = "Partida finalizada. ¡Sigue jugando!"`
5. **Guardar resultado en JSON Server** — Nodo HTTP Request que envía la partida
   a `http://localhost:3000/partidas` (JSON Server) incluyendo el `mensaje`
   asignado en el paso anterior.
6. **Responder al Webhook** — Devuelve al frontend `{ jugador, resultado, mensaje }`.

> **Respaldo en el frontend:** `src/pages/Juego.jsx` envía primero el resultado
> a este Webhook. Si n8n no está activo, la app guarda la partida directamente
> en JSON Server y muestra el aviso correspondiente, de modo que el historial
> nunca se pierde.

## Datos que recibe el Webhook

El frontend envía un JSON como el siguiente:

```json
{
  "jugador": "Ana",
  "resultado": "Victoria",
  "ganador": "X",
  "movimientos": 7
}
```

La respuesta del Webhook es:

```json
{
  "jugador": "Ana",
  "resultado": "Victoria",
  "mensaje": "¡Felicidades! Ganaste la partida."
}
```

## Cómo importar el workflow

1. Abre n8n (por defecto `http://localhost:5678`).
2. Ve a **Workflows** y elige **Import from file**.
3. Selecciona el archivo `n8n/tic-tac-react-workflow.json`.
4. Activa el workflow y observa el campo **Production URL** del nodo Webhook.

## URL del Webhook

La URL inicial configurada en el código es:

```
http://localhost:5678/webhook/tic-tac-react
```

**IMPORTANTE:** Cuando actives el workflow, n8n te mostrará la URL de producción real del Webhook.
Copia esa URL y reemplázala en el archivo `src/services/n8n.js` dentro de la constante
`N8N_WEBHOOK_URL` (ahí verás un comentario que te lo recuerda).

## Requisitos

- n8n corriendo (Docker o local).
- JSON Server corriendo en `http://localhost:3000`.
- Frontend corriendo con Vite (`http://localhost:5173`).

## Nota sobre CORS

Si n8n bloquea la petición por CORS, configura los encabezados permitidos en el
nodo **Webhook** (por ejemplo `*`) o usa la opción correspondiente del nodo
**Respond to Webhook** según la versión de n8n.