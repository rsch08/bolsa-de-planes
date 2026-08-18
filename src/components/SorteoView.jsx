import { useState } from "react";
import { Shuffle, Check, RotateCcw } from "lucide-react";
import { Ticket } from "./Ticket";

export function SorteoView({ pending, completePlan, currentUserId, onGoToBacklog }) {
  const [drawnId, setDrawnId] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [saving, setSaving] = useState(false);

  const drawnPlan = pending.find((p) => p.id === drawnId) || null;

  const draw = () => {
    const pool = pending.filter((p) => p.id !== drawnId);
    const usable = pool.length ? pool : pending;
    if (!usable.length) return;
    setDrawing(true);
    setTimeout(() => {
      const pick = usable[Math.floor(Math.random() * usable.length)];
      setDrawnId(pick.id);
      setDrawing(false);
    }, 550);
  };

  const complete = async () => {
    if (!drawnPlan) return;
    setSaving(true);
    await completePlan(drawnPlan.id, currentUserId);
    setSaving(false);
    setDrawnId(null);
  };

  if (pending.length === 0 && !drawnPlan) {
    return (
      <div className="rounded-xl p-6 text-center bg-white shadow-[0_1px_2px_rgba(34,48,58,0.06)]">
        <p className="font-display text-lg font-semibold mb-1">La bolsa está vacía</p>
        <p className="text-sm text-muted mb-4">Agrega un plan para poder sortear.</p>
        <button
          onClick={onGoToBacklog}
          className="px-4 py-2 rounded-full text-sm font-medium bg-ink text-paper"
        >
          Agregar el primer plan
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full min-h-[132px] flex items-center justify-center mb-5">
        {drawing ? (
          <div className="shuffling w-56 h-24 rounded-xl bg-white shadow-[0_6px_16px_rgba(34,48,58,0.1)]" />
        ) : drawnPlan ? (
          <Ticket rotate={0} className="w-full px-5 py-5">
            <p className="text-xs uppercase tracking-wide mb-1 text-marigold">Plan de hoy</p>
            <p className="font-display text-xl font-semibold">{drawnPlan.name}</p>
            {drawnPlan.note && <p className="text-sm mt-1 text-muted">{drawnPlan.note}</p>}
          </Ticket>
        ) : (
          <p className="text-sm text-center text-muted">
            {pending.length} plan{pending.length === 1 ? "" : "es"} esperando en la bolsa.
          </p>
        )}
      </div>

      {drawnPlan ? (
        <div className="flex gap-2 w-full">
          <button
            onClick={complete}
            disabled={saving}
            className="flex-1 py-3 rounded-full text-sm font-medium flex items-center justify-center gap-1.5 bg-sage text-white disabled:opacity-60"
          >
            <Check size={16} /> Hecho
          </button>
          <button
            onClick={draw}
            className="px-4 py-3 rounded-full text-sm font-medium flex items-center justify-center gap-1.5 bg-white text-ink shadow-[0_1px_2px_rgba(34,48,58,0.1)]"
          >
            <RotateCcw size={16} /> Otro
          </button>
        </div>
      ) : (
        <button
          onClick={draw}
          disabled={drawing}
          className="w-full py-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 bg-marigold text-ink"
        >
          <Shuffle size={17} /> Buscar plan para hoy
        </button>
      )}
    </div>
  );
}
