import { Check } from "lucide-react";
import { fmtDate } from "../lib/format";
import { userById } from "../lib/users";

export function HistorialView({ completed }) {
  if (completed.length === 0) {
    return <p className="text-sm text-center py-6 text-muted">Todavía no completan ningún plan.</p>;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {completed.map((p) => {
        const author = userById(p.completed_by);
        return (
          <div key={p.id} className="rounded-lg px-4 py-3 flex items-center justify-between bg-white">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{p.name}</p>
              <p className="text-xs text-muted">
                {fmtDate(p.completed_at)}
                {author ? ` · ${author.emoji} ${author.name}` : ""}
              </p>
            </div>
            <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-sage text-white">
              <Check size={12} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
