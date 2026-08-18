import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Ticket, tilt } from "./Ticket";
import { userById } from "../lib/users";

export function BacklogView({ pending, addPlan, addPlans, removePlan, currentUserId }) {
  const [bulkMode, setBulkMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNote, setNewNote] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [saving, setSaving] = useState(false);

  const submitOne = async (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setSaving(true);
    await addPlan({ name, note: newNote.trim(), createdBy: currentUserId });
    setSaving(false);
    setNewName("");
    setNewNote("");
  };

  const submitBulk = async (e) => {
    e.preventDefault();
    const lines = bulkText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) return;
    setSaving(true);
    await addPlans(lines, currentUserId);
    setSaving(false);
    setBulkText("");
    setBulkMode(false);
  };

  return (
    <section>
      <div className="mb-5 rounded-xl p-3.5 bg-white">
        <div className="flex justify-end mb-2">
          <button onClick={() => setBulkMode((v) => !v)} className="text-xs underline text-muted">
            {bulkMode ? "Agregar uno" : "Dictar varios de un jalón"}
          </button>
        </div>

        {bulkMode ? (
          <form onSubmit={submitBulk}>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={"Un plan por línea, por ejemplo:\nCena en Coyoacán\nCine de barrio\nCaminata en Chapultepec"}
              rows={4}
              className="w-full text-sm px-3 py-2 rounded-lg outline-none mb-2 resize-none bg-paper"
            />
            <button
              type="submit"
              disabled={!bulkText.trim() || saving}
              className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 disabled:opacity-40 bg-ink text-paper"
            >
              <Plus size={15} /> Agregar todos a la bolsa
            </button>
          </form>
        ) : (
          <form onSubmit={submitOne}>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nombre del plan"
              className="w-full text-sm px-3 py-2 rounded-lg outline-none mb-2 bg-paper"
            />
            <input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Nota, lugar o link (opcional)"
              className="w-full text-sm px-3 py-2 rounded-lg outline-none mb-2 bg-paper"
            />
            <button
              type="submit"
              disabled={!newName.trim() || saving}
              className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 disabled:opacity-40 bg-ink text-paper"
            >
              <Plus size={15} /> Agregar a la bolsa
            </button>
          </form>
        )}
      </div>

      {pending.length === 0 ? (
        <p className="text-sm text-center py-6 text-muted">Sin planes pendientes todavía.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {pending.map((p) => {
            const author = userById(p.created_by);
            return (
              <Ticket key={p.id} rotate={tilt(p.id)} className="px-4 py-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{p.name}</p>
                  {p.note && <p className="text-xs mt-0.5 text-muted">{p.note}</p>}
                  {author && (
                    <p className="text-[11px] mt-0.5 text-muted">
                      {author.emoji} agregado por {author.name}
                    </p>
                  )}
                </div>
                <button onClick={() => removePlan(p.id)} className="shrink-0 p-1 text-[#B7C0C5]">
                  <Trash2 size={15} />
                </button>
              </Ticket>
            );
          })}
        </div>
      )}
    </section>
  );
}
