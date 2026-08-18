# La bolsa de planes

App compartida para dos personas: juntan ideas de planes en un backlog y
sortean uno al azar para hacer. Ver `SPEC.md` para el spec completo.

## Stack

- React + Vite + Tailwind
- Supabase (Postgres + Realtime)
- Pensado para desplegarse en Vercel

## Poner a correr el proyecto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear el proyecto de Supabase

1. Crea un proyecto gratuito en [supabase.com](https://supabase.com).
2. Abre el **SQL Editor** y ejecuta el contenido de `supabase/schema.sql`.
   Esto crea la tabla `plans`, las políticas RLS (abiertas, pensadas para
   un link privado compartido solo entre ustedes dos) y agrega la tabla a
   la publicación `supabase_realtime` para que la sincronización en vivo
   funcione desde el día uno.
3. En **Project Settings → API**, copia la `Project URL` y la `anon
   public key`.

### 3. Variables de entorno

```bash
cp .env.example .env
```

Completa `.env` con la URL y la anon key del paso anterior.

### 4. Personalizar los dos usuarios

Edita `src/lib/users.js` y reemplaza `Persona 1` / `Persona 2` (y los
emojis) con sus nombres reales. Es el único lugar que hay que tocar para
la identidad — no hay Supabase Auth todavía (ver abajo).

### 5. Correr en local

```bash
npm run dev
```

## Deploy en Vercel

1. Sube este repo a GitHub (ya lo está) y conéctalo en [vercel.com](https://vercel.com).
2. Framework preset: **Vite**.
3. Agrega las variables de entorno `VITE_SUPABASE_URL` y
   `VITE_SUPABASE_ANON_KEY` en la configuración del proyecto en Vercel.
4. Deploy. Comparte el link solo con tu pareja — ver nota de seguridad
   abajo.

## Estructura

```
src/
  lib/supabaseClient.js   # cliente de Supabase
  lib/users.js            # los 2 usuarios hardcodeados + localStorage
  lib/format.js           # helpers de formato (fechas)
  hooks/useAuth.js        # selección de identidad persistida
  hooks/usePlans.js       # fetch + Supabase Realtime + CRUD de planes
  components/
    LoginGate.jsx          # "¿Quién eres?"
    Ticket.jsx              # tarjeta tipo boleto de rifa
    SorteoView.jsx          # "Buscar plan para hoy"
    BacklogView.jsx         # agregar / listar / eliminar (+ captura rápida)
    HistorialView.jsx       # completados con fecha y autor
  App.jsx                  # tabs: Sorteo / Bolsa / Historial
supabase/schema.sql        # tabla plans + RLS + realtime
```

## Funcionalidades (MVP)

1. Backlog de planes: agregar (nombre + nota opcional), listar, eliminar
2. "Buscar plan para hoy": sortea uno al azar del backlog pendiente
3. Marcar como completado → pasa a historial, nunca se borra
4. Historial de completados con fecha y quién lo hizo
5. Captura rápida: agregar varios planes de un jalón, uno por línea

## Sincronización en tiempo real

`usePlans` se suscribe a un canal de Supabase Realtime sobre la tabla
`plans`. Cualquier insert/update/delete —tuyo o de tu pareja, desde
cualquier pestaña— se refleja al instante sin recargar.

## Qué falta para producción real (fuera del MVP)

- **Auth real**: hoy la identidad es un selector local (no hay login de
  verdad) y las políticas RLS están abiertas para cualquiera con la anon
  key. Funciona bien para un link privado compartido solo entre ustedes
  dos, pero antes de exponerlo más ampliamente conviene Supabase Auth
  (magic link) + políticas RLS atadas a `auth.uid()`.
- Roadmap v2 del spec: nivel de esfuerzo/dificultad por plan (para filtrar
  el sorteo), notas enriquecidas (ubicación, fotos), filtro por zona,
  interacción conversacional sobre el backlog vía la API de Claude.
