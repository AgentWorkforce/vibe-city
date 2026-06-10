function Palm({ x, h, flip }: { x: string; h: number; flip?: boolean }) {
  return (
    <g
      transform={`translate(${x}, 0) ${flip ? "scale(-1,1)" : ""}`}
      style={{ transformBox: "fill-box", transformOrigin: "center bottom" }}
    >
      {/* trunk */}
      <path
        d={`M0 200 C 4 ${200 - h * 0.5}, -6 ${200 - h * 0.8}, 2 ${200 - h}`}
        stroke="#050505"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      {/* fronds */}
      {[-80, -45, -15, 15, 50, 85].map((angle) => (
        <path
          key={angle}
          d={`M2 ${200 - h} q ${Math.cos((angle * Math.PI) / 180) * 38} ${
            Math.sin((angle * Math.PI) / 180) * 26 - 16
          } ${Math.cos((angle * Math.PI) / 180) * 62} ${
            Math.sin((angle * Math.PI) / 180) * 40 - 6
          }`}
          stroke="#050505"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

export function PalmSilhouettes() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 200"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-x-0 bottom-0 h-[26vh] w-full"
    >
      <Palm x="80" h={150} />
      <Palm x="200" h={110} flip />
      <Palm x="990" h={165} flip />
      <Palm x="1110" h={120} />
      {/* ground line */}
      <rect x="0" y="196" width="1200" height="4" fill="#050505" />
    </svg>
  );
}
