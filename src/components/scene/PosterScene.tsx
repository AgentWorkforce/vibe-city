const INDIGO = "#3d3473";
const INDIGO_SOFT = "#4a3f87";

function Palm({
  x,
  h,
  flip = false,
  ground = 900,
}: {
  x: number;
  h: number;
  flip?: boolean;
  ground?: number;
}) {
  const reach = h * 0.42;
  const crownY = -h;
  const fronds = [
    { dx: -1.0, dy: -0.15 },
    { dx: -0.75, dy: -0.55 },
    { dx: -0.3, dy: -0.85 },
    { dx: 0.15, dy: -0.9 },
    { dx: 0.6, dy: -0.7 },
    { dx: 0.95, dy: -0.3 },
    { dx: 1.05, dy: 0.05 },
  ];
  return (
    <g transform={`translate(${x} ${ground}) ${flip ? "scale(-1,1)" : ""}`}>
      <path
        d={`M0 0 C ${h * 0.06} ${-h * 0.35}, ${-h * 0.09} ${-h * 0.7}, ${h * 0.04} ${crownY}`}
        stroke={INDIGO}
        strokeWidth={h * 0.045}
        fill="none"
        strokeLinecap="round"
      />
      {fronds.map((f, i) => (
        <path
          key={i}
          d={`M${h * 0.04} ${crownY} q ${f.dx * reach * 0.55} ${
            f.dy * reach * 0.7 - reach * 0.25
          } ${f.dx * reach} ${f.dy * reach * 0.55 + reach * 0.28}`}
          stroke={INDIGO}
          strokeWidth={h * 0.032}
          fill="none"
          strokeLinecap="round"
        />
      ))}
      <circle cx={h * 0.04 - 9} cy={crownY + 12} r={h * 0.022} fill={INDIGO_SOFT} />
      <circle cx={h * 0.04 + 10} cy={crownY + 16} r={h * 0.02} fill={INDIGO_SOFT} />
    </g>
  );
}

function Cloud({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fdeef2" opacity="0.55">
      <ellipse cx="0" cy="0" rx="70" ry="16" />
      <ellipse cx="-35" cy="-10" rx="40" ry="14" />
      <ellipse cx="30" cy="-12" rx="46" ry="15" />
    </g>
  );
}

function Helicopter() {
  return (
    <g transform="translate(1170 118)" fill={INDIGO}>
      <ellipse cx="0" cy="0" rx="26" ry="11" />
      <rect x="-58" y="-3.5" width="38" height="6" rx="3" />
      <path d="M-62 -16 L-50 -2 L-62 2 Z" />
      <rect x="-4" y="-22" width="6" height="12" rx="2" />
      <rect x="-48" y="-24" width="96" height="4" rx="2" />
      <rect x="-16" y="13" width="34" height="3.5" rx="1.75" />
      <rect x="-8" y="9" width="4" height="6" />
      <rect x="8" y="9" width="4" height="6" />
    </g>
  );
}

function RobotCrew() {
  return (
    <g>
      {/* shadows on the pier */}
      <ellipse cx="958" cy="868" rx="58" ry="9" fill="#000" opacity="0.18" />
      <ellipse cx="1074" cy="800" rx="30" ry="6" fill="#000" opacity="0.14" />

      {/* the foreman: tall robot holding rolled blueprints */}
      <g fill={INDIGO}>
        <rect x="938" y="800" width="15" height="62" rx="6" />
        <rect x="966" y="800" width="15" height="62" rx="6" />
        <rect x="932" y="856" width="27" height="12" rx="6" />
        <rect x="960" y="856" width="27" height="12" rx="6" />
        <rect x="924" y="694" width="72" height="114" rx="18" />
        {/* left arm hanging */}
        <rect x="912" y="706" width="13" height="68" rx="6.5" />
        {/* right arm bent forward */}
        <rect x="992" y="712" width="14" height="38" rx="7" />
        <rect x="992" y="742" width="48" height="13" rx="6.5" />
        {/* head */}
        <rect x="928" y="636" width="64" height="54" rx="14" />
        {/* antenna */}
        <rect x="957" y="616" width="4" height="20" />
        <circle cx="959" cy="613" r="5" />
      </g>
      {/* blueprint roll */}
      <rect x="1024" y="734" width="56" height="16" rx="8" fill="#fdf0d5" />
      <rect x="1024" y="734" width="56" height="16" rx="8" fill="none" stroke={INDIGO} strokeWidth="2.5" />
      <line x1="1052" y1="734" x2="1052" y2="750" stroke={INDIGO} strokeWidth="2.5" />
      {/* hard hat */}
      <path d="M926 642 q 34 -30 68 0 l 0 6 l -68 0 Z" fill="#ffc55c" />
      <rect x="920" y="646" width="80" height="7" rx="3.5" fill="#f2b03c" />
      {/* visor glow */}
      <rect x="938" y="656" width="44" height="18" rx="9" fill="#aff3ef" />
      <rect x="944" y="661" width="8" height="8" rx="4" fill={INDIGO} />
      <rect x="968" y="661" width="8" height="8" rx="4" fill={INDIGO} />

      {/* qa drone buddy */}
      <g fill={INDIGO}>
        <rect x="1086" y="700" width="6" height="14" />
        <rect x="1052" y="694" width="74" height="6" rx="3" />
        <circle cx="1089" cy="742" r="28" />
        <rect x="1072" y="768" width="8" height="14" rx="4" />
        <rect x="1098" y="768" width="8" height="14" rx="4" />
      </g>
      <circle cx="1089" cy="740" r="10" fill="#aff3ef" />
      <circle cx="1092" cy="738" r="4" fill={INDIGO} />
    </g>
  );
}

const FAR_BUILDINGS: [number, number, number, number][] = [
  [0, 470, 92, 92], [82, 432, 70, 130], [162, 456, 56, 106], [250, 448, 64, 114],
  [330, 438, 80, 124], [432, 462, 60, 100], [520, 426, 76, 136], [620, 452, 64, 110],
  [700, 444, 72, 118], [800, 430, 66, 132], [880, 458, 72, 104], [1000, 446, 80, 116],
  [1100, 432, 62, 130], [1180, 454, 70, 108], [1272, 440, 84, 122], [1370, 428, 70, 134],
];

const MID_BUILDINGS: [number, number, number, number][] = [
  [40, 402, 110, 160], [210, 332, 70, 230], [420, 392, 88, 170], [590, 352, 90, 210],
  [760, 392, 70, 170], [920, 312, 60, 250], [1040, 396, 76, 166], [1190, 346, 86, 216],
  [1340, 382, 100, 180],
];

export function PosterScene() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7d8df0" />
          <stop offset="32%" stopColor="#b3a5ef" />
          <stop offset="56%" stopColor="#efc8da" />
          <stop offset="68%" stopColor="#fdf0d5" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9fdede" />
          <stop offset="100%" stopColor="#4f9fb5" />
        </linearGradient>
        <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff8e1" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#ffe9b8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffe9b8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050505" stopOpacity="0" />
          <stop offset="45%" stopColor="#050505" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#050505" stopOpacity="0.96" />
        </linearGradient>
        <pattern id="windows" width="16" height="20" patternUnits="userSpaceOnUse">
          <rect width="16" height="20" fill="none" />
          <rect x="3" y="4" width="7" height="11" fill="#cdbff5" opacity="0.7" />
        </pattern>
        <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* sky */}
      <rect width="1440" height="600" fill="url(#sky)" />
      <circle cx="540" cy="560" r="230" fill="url(#sun)" />
      <Cloud x={260} y={150} s={1.1} />
      <Cloud x={740} y={86} s={0.8} />
      <Cloud x={1060} y={196} s={1.3} />
      <Helicopter />

      {/* skyline */}
      <g fill="#cbbcf4">
        {FAR_BUILDINGS.map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} />
        ))}
      </g>
      <g>
        {MID_BUILDINGS.map(([x, y, w, h], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} fill="#a08fe0" />
            <rect x={x + 4} y={y + 8} width={w - 8} height={h - 8} fill="url(#windows)" />
          </g>
        ))}
        {/* antenna + spire on the tall towers */}
        <rect x="243" y="296" width="4" height="36" fill="#a08fe0" />
        <rect x="948" y="270" width="4" height="42" fill="#a08fe0" />
        <path d="M590 352 l45 -26 l45 26 Z" fill="#a08fe0" />
      </g>

      {/* water */}
      <rect y="560" width="1440" height="220" fill="url(#water)" />
      <g filter="url(#soft)" opacity="0.3" fill="#8a7ad0">
        <rect x="214" y="566" width="62" height="86" />
        <rect x="594" y="566" width="82" height="72" />
        <rect x="924" y="566" width="52" height="98" />
        <rect x="1194" y="566" width="78" height="78" />
      </g>
      <g stroke="#fdf0d5" strokeWidth="3" strokeLinecap="round" opacity="0.5">
        <line x1="380" y1="596" x2="470" y2="596" />
        <line x1="520" y1="626" x2="650" y2="626" />
        <line x1="300" y1="662" x2="420" y2="662" />
        <line x1="760" y1="606" x2="850" y2="606" />
        <line x1="980" y1="648" x2="1120" y2="648" />
        <line x1="660" y1="692" x2="790" y2="692" />
        <line x1="1180" y1="688" x2="1300" y2="688" />
        <line x1="140" y1="616" x2="240" y2="616" />
      </g>

      {/* pier */}
      <rect y="780" width="1440" height="120" fill="#d2a472" />
      <rect y="780" width="1440" height="10" fill="#8a6a3e" />
      <g stroke="#b98e58" strokeWidth="3">
        {[806, 824, 842, 860, 878].map((y) => (
          <line key={y} x1="0" y1={y} x2="1440" y2={y} />
        ))}
      </g>

      <RobotCrew />

      {/* palms */}
      <Palm x={120} h={400} />
      <Palm x={252} h={300} flip />
      <Palm x={1348} h={420} flip />

      {/* fade into the page */}
      <rect y="600" width="1440" height="300" fill="url(#vignette)" />
    </svg>
  );
}
