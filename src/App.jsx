import { useState } from "react";
import { Shuffle, ListChecks, Archive, LogOut } from "lucide-react";
import { useAuth } from "./hooks/useAuth";
import { usePlans } from "./hooks/usePlans";
import { LoginGate } from "./components/LoginGate";
import { SorteoView } from "./components/SorteoView";
import { BacklogView } from "./components/BacklogView";
import { HistorialView } from "./components/HistorialView";

const TABS = [
  { id: "sorteo", label: "Sorteo", icon: Shuffle },
  { id: "backlog", label: "Bolsa", icon: ListChecks },
  { id: "historial", label: "Historial", icon: Archive },
];

export default function App() {
  const { userId, user, login, logout } = useAuth();
  const [tab, setTab] = useState("sorteo");
  const { plans, pending, completed, error, reload, addPlan, addPlans, removePlan, completePlan } =
    usePlans();

  if (!userId) {
    return <LoginGate onLogin={login} />;
  }

  return (
    <div className="min-h-screen w-full flex justify-center bg-paper text-ink font-sans">
      <div className="w-full max-w-md px-5 pt-8 pb-24">
        <header className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">La bolsa de planes</h1>
            <p className="text-sm mt-1 text-muted">Un lugar compartido para juntar ideas y sacar una al azar.</p>
          </div>
          <button
            onClick={logout}
            title={`Salir (${user?.name})`}
            className="shrink-0 mt-1 p-1.5 rounded-full text-muted"
          >
            <LogOut size={16} />
          </button>
        </header>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg text-sm flex items-center justify-between bg-[#F6E4E1] text-brick">
            <span>{error}</span>
            <button onClick={reload} className="underline shrink-0 ml-2">
              reintentar
            </button>
          </div>
        )}

        {plans === null && !error ? (
          <p className="text-sm text-muted">Cargando planes…</p>
        ) : (
          <>
            {tab === "sorteo" && (
              <SorteoView
                pending={pending}
                completePlan={completePlan}
                currentUserId={userId}
                onGoToBacklog={() => setTab("backlog")}
              />
            )}
            {tab === "backlog" && (
              <BacklogView
                pending={pending}
                addPlan={addPlan}
                addPlans={addPlans}
                removePlan={removePlan}
                currentUserId={userId}
              />
            )}
            {tab === "historial" && <HistorialView completed={completed} />}
          </>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 flex justify-center border-t bg-paper border-[#E7E0D2]">
        <div className="w-full max-w-md flex">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs ${
                  active ? "text-ink font-semibold" : "text-[#A6AFB4] font-normal"
                }`}
              >
                <Icon size={18} />
                {t.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
