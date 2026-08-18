import { USERS } from "../lib/users";

export function LoginGate({ onLogin }) {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-paper text-ink font-sans px-5">
      <div className="w-full max-w-xs text-center">
        <h1 className="font-display text-3xl font-bold mb-1">La bolsa de planes</h1>
        <p className="text-sm text-muted mb-8">¿Quién eres?</p>
        <div className="flex flex-col gap-3">
          {USERS.map((u) => (
            <button
              key={u.id}
              onClick={() => onLogin(u.id)}
              className="w-full py-3.5 rounded-full text-sm font-semibold bg-white shadow-[0_1px_2px_rgba(34,48,58,0.1)] flex items-center justify-center gap-2"
            >
              <span className="text-lg">{u.emoji}</span> {u.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
