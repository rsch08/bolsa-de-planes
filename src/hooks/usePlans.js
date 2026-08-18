import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function usePlans() {
  const [plans, setPlans] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      setError(error.message);
      return;
    }
    setPlans(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Sincronización en tiempo real: cualquier insert/update/delete en `plans`
  // (venga de esta pestaña o de la del otro) se refleja al instante.
  useEffect(() => {
    const channel = supabase
      .channel("plans-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "plans" }, (payload) => {
        setPlans((prev) => {
          if (!prev || prev.some((p) => p.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "plans" }, (payload) => {
        setPlans((prev) => prev && prev.map((p) => (p.id === payload.new.id ? payload.new : p)));
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "plans" }, (payload) => {
        setPlans((prev) => prev && prev.filter((p) => p.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addPlan = useCallback(async ({ name, note, createdBy }) => {
    const { error } = await supabase
      .from("plans")
      .insert({ name, note: note || null, created_by: createdBy });
    if (error) setError(error.message);
  }, []);

  const addPlans = useCallback(async (names, createdBy) => {
    const rows = names.map((name) => ({ name, created_by: createdBy }));
    const { error } = await supabase.from("plans").insert(rows);
    if (error) setError(error.message);
  }, []);

  const removePlan = useCallback(async (id) => {
    const { error } = await supabase.from("plans").delete().eq("id", id);
    if (error) setError(error.message);
  }, []);

  const completePlan = useCallback(async (id, completedBy) => {
    const { error } = await supabase
      .from("plans")
      .update({ status: "completado", completed_at: new Date().toISOString(), completed_by: completedBy })
      .eq("id", id);
    if (error) setError(error.message);
  }, []);

  const pending = (plans || []).filter((p) => p.status === "pendiente");
  const completed = (plans || [])
    .filter((p) => p.status === "completado")
    .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));

  return {
    plans,
    pending,
    completed,
    error,
    reload: load,
    addPlan,
    addPlans,
    removePlan,
    completePlan,
  };
}
