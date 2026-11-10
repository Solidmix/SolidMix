// Invisible-to-humans field: bots that auto-fill every input trip it, real
// visitors never see or reach it (off-screen, not tab-focusable).
export function Honeypot({ name, value, onChange }: { name: string; value: string; onChange: (value: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
      <label htmlFor={name}>Leave this field empty</label>
      <input
        id={name}
        name={name}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
