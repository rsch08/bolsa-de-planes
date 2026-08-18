import { useCallback, useState } from "react";
import { getStoredUserId, setStoredUserId, clearStoredUserId, userById } from "../lib/users";

export function useAuth() {
  const [userId, setUserId] = useState(() => getStoredUserId());

  const login = useCallback((id) => {
    setStoredUserId(id);
    setUserId(id);
  }, []);

  const logout = useCallback(() => {
    clearStoredUserId();
    setUserId(null);
  }, []);

  return { userId, user: userById(userId), login, logout };
}
