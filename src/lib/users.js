// Identidad simple para 2 personas: sin Supabase Auth por ahora, solo un
// selector de "quién eres" persistido en localStorage. `id` es lo que se
// guarda en `plans.created_by` / `plans.completed_by`.
// Personaliza los nombres y el emoji con los de ustedes dos.
export const USERS = [
  { id: "persona-1", name: "Persona 1", emoji: "🌻" },
  { id: "persona-2", name: "Persona 2", emoji: "🌊" },
];

const STORAGE_KEY = "bolsa-de-planes:whoami";

export function getStoredUserId() {
  return localStorage.getItem(STORAGE_KEY);
}

export function setStoredUserId(id) {
  localStorage.setItem(STORAGE_KEY, id);
}

export function clearStoredUserId() {
  localStorage.removeItem(STORAGE_KEY);
}

export function userById(id) {
  return USERS.find((u) => u.id === id) || null;
}
