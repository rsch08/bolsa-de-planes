// Tarjeta con forma de boleto de rifa: bordes redondeados, "muescas"
// perforadas a los lados y una ligera inclinación para el efecto de
// "pila de boletos" en la bolsa.
export function Ticket({ children, rotate = 0, style = {}, className = "" }) {
  return (
    <div
      className={`relative rounded-xl bg-white shadow-[0_1px_2px_rgba(34,48,58,0.06),0_6px_16px_rgba(34,48,58,0.08)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-paper" />
      <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-paper" />
      {children}
    </div>
  );
}

// Rotación pequeña y determinística por id, para que cada boleto se vea
// ligeramente distinto pero no cambie de inclinación entre renders.
export function tilt(id) {
  let h = 0;
  for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) % 360;
  return (h % 7) - 3; // -3..3 deg
}
