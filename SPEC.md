# La bolsa de planes — Spec v1

## Contexto
Migración de un MVP validado como artifact de Claude.ai (React + storage
key-value exclusivo del entorno de artifacts) a una app standalone real, con
control total, sincronización en tiempo real y sin las limitaciones del
entorno de artifacts.

## Objetivo
App web para dos personas donde juntan ideas de planes en un backlog
compartido y pueden "sortear" uno al azar para hacer. Rápida, casual, sin
fricción — no un gestor de tareas corporativo.

## Stack
- React + Vite + Tailwind
- Supabase (Postgres + Realtime) para persistencia y sincronización en vivo
- Deploy en Vercel

## Modelo de datos (mínimo viable)
Tabla `plans` (ver `supabase/schema.sql`):
- `id` (uuid)
- `name` (text)
- `note` (text, opcional)
- `status` (enum: `pendiente` | `completado`)
- `created_at` (timestamp)
- `completed_at` (timestamp, nullable)
- `created_by` (id de usuario hardcodeado, quién lo agregó)
- `completed_by` (id de usuario hardcodeado, quién lo marcó como hecho)

## Funcionalidades del MVP
1. Backlog de planes: agregar (nombre + nota opcional), listar, eliminar
2. Botón "Buscar plan para hoy": elige uno al azar del backlog pendiente
3. Marcar plan como completado → pasa a historial, nunca se borra
4. Historial de completados con fecha y quién lo hizo
5. Modo de captura rápida: agregar varios planes de un jalón, uno por línea

## Sincronización e identidad
- **Tiempo real**: Supabase Realtime sobre la tabla `plans` — inserts,
  updates y deletes de cualquiera de los dos se reflejan sin recargar.
- **Identidad**: 2 usuarios fijos hardcodeados en `src/lib/users.js`
  (nombre + emoji), seleccionados una vez y persistidos en localStorage.
  No hay Supabase Auth todavía — ver "Qué falta para producción real" en
  el README antes de compartir el link públicamente.

## Diseño visual
Papel/boleto de rifa: fondo cálido tipo papel, tarjetas blancas con
"muescas" perforadas a los lados y ligera inclinación (pila de boletos),
tipografía Fraunces (display) + Work Sans (texto), paleta cálida
(marigold, brick, sage sobre paper/ink). Tono juguetón, no dashboard
corporativo.

## Roadmap v2 (no implementado, pero el diseño de datos no lo bloquea)
- Nivel de esfuerzo/dificultad por plan, para filtrar el sorteo según el
  contexto del día
- Notas enriquecidas: ubicación (link de Google Maps), fotos
- Filtro/búsqueda por zona
- Interacción conversacional sobre el backlog vía API de Claude

## Siguiente paso práctico
1. Crear proyecto en Supabase y correr `supabase/schema.sql`
2. Completar `.env` con las credenciales (ver README)
3. `npm install && npm run dev`
4. Deploy en Vercel
