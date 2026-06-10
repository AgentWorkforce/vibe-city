const GRADIENTS = [
  "linear-gradient(135deg, #ff2e88, #ff6b35)",
  "linear-gradient(135deg, #ff6b35, #ffc55c)",
  "linear-gradient(135deg, #ffc55c, #14454f)",
  "linear-gradient(135deg, #ff2e88, #0e2236)",
  "linear-gradient(135deg, #14454f, #ff6b35)",
  "linear-gradient(135deg, #0e2236, #ffc55c)",
  "linear-gradient(135deg, #ff2e88, #14454f)",
  "linear-gradient(135deg, #ffc55c, #ff2e88)",
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function AgentAvatar({ name, size = 36 }: { name: string; size?: number }) {
  const gradient = GRADIENTS[hashName(name) % GRADIENTS.length];
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-xl font-display font-black uppercase text-ink ring-1 ring-white/15"
      style={{ width: size, height: size, background: gradient, fontSize: size * 0.5 }}
    >
      {name.charAt(0)}
    </span>
  );
}
