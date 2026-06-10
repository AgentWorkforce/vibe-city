const INDIGO = "#3d3473";

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
    <g
      transform={`translate(${x} ${ground}) ${flip ? "scale(-1,1)" : ""}`}
      filter="url(#organic)"
    >
      <path
        d={`M0 0 C ${h * 0.06} ${-h * 0.35}, ${-h * 0.09} ${-h * 0.7}, ${h * 0.04} ${crownY}`}
        stroke="url(#palmTrunk)"
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
          stroke={i < 4 ? "url(#palmLit)" : "url(#palmTrunk)"}
          strokeWidth={h * 0.032}
          fill="none"
          strokeLinecap="round"
        />
      ))}
      <circle cx={h * 0.04 - 9} cy={crownY + 12} r={h * 0.022} fill="#4a3f87" />
      <circle cx={h * 0.04 + 10} cy={crownY + 16} r={h * 0.02} fill="#4a3f87" />
    </g>
  );
}

function Cloud({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#cloudsoft)">
      <g fill="#fdeef2" opacity="0.7">
        <ellipse cx="0" cy="0" rx="70" ry="16" />
        <ellipse cx="-35" cy="-10" rx="40" ry="14" />
        <ellipse cx="30" cy="-12" rx="46" ry="15" />
      </g>
      {/* warm underside catching the sun */}
      <g fill="#ffd9ae" opacity="0.5">
        <ellipse cx="-10" cy="8" rx="58" ry="7" />
        <ellipse cx="34" cy="2" rx="30" ry="5" />
      </g>
    </g>
  );
}

function Helicopter() {
  return (
    <g transform="translate(1170 118)" fill="#4a3f87" opacity="0.92">
      <ellipse cx="0" cy="0" rx="26" ry="11" />
      <rect x="-58" y="-3.5" width="38" height="6" rx="3" />
      <path d="M-62 -16 L-50 -2 L-62 2 Z" />
      <rect x="-4" y="-22" width="6" height="12" rx="2" />
      <rect x="-48" y="-24" width="96" height="4" rx="2" opacity="0.75" />
      <rect x="-16" y="13" width="34" height="3.5" rx="1.75" />
      <rect x="-8" y="9" width="4" height="6" />
      <rect x="8" y="9" width="4" height="6" />
    </g>
  );
}

function RobotCrew() {
  return (
    <g>
      <ellipse cx="958" cy="868" rx="58" ry="9" fill="#1d1640" opacity="0.3" />
      <ellipse cx="1074" cy="800" rx="30" ry="6" fill="#1d1640" opacity="0.22" />
      {/* warm backlight halo from the sunset */}
      <ellipse cx="960" cy="740" rx="120" ry="150" fill="url(#backlight)" />

      {/* the tech lead */}
      <g fill="url(#botBody)">
        <rect x="938" y="800" width="15" height="62" rx="6" />
        <rect x="966" y="800" width="15" height="62" rx="6" />
        <rect x="932" y="856" width="27" height="12" rx="6" />
        <rect x="960" y="856" width="27" height="12" rx="6" />
        <rect x="924" y="694" width="72" height="114" rx="18" />
        <rect x="912" y="706" width="13" height="68" rx="6.5" />
        <rect x="992" y="712" width="14" height="38" rx="7" />
        <rect x="992" y="742" width="48" height="13" rx="6.5" />
        <rect x="928" y="636" width="64" height="54" rx="14" />
        <rect x="957" y="616" width="4" height="20" />
        <circle cx="959" cy="613" r="5" />
      </g>
      {/* sunset rim light on his left side */}
      <rect x="924" y="694" width="72" height="114" rx="18" fill="url(#rimLeft)" />
      <rect x="928" y="636" width="64" height="54" rx="14" fill="url(#rimLeft)" />
      {/* blueprint roll */}
      <rect x="1024" y="734" width="56" height="16" rx="8" fill="url(#paper)" />
      <rect x="1024" y="734" width="56" height="16" rx="8" fill="none" stroke={INDIGO} strokeWidth="2.5" />
      <line x1="1052" y1="734" x2="1052" y2="750" stroke={INDIGO} strokeWidth="2.5" />
      {/* hard hat */}
      <path d="M926 642 q 34 -30 68 0 l 0 6 l -68 0 Z" fill="url(#hat)" />
      <rect x="920" y="646" width="80" height="7" rx="3.5" fill="#e8a232" />
      {/* visor */}
      <rect x="938" y="656" width="44" height="18" rx="9" fill="url(#visor)" />
      <rect x="944" y="661" width="8" height="8" rx="4" fill="#27205c" />
      <rect x="968" y="661" width="8" height="8" rx="4" fill="#27205c" />

      {/* qa drone buddy */}
      <g fill="url(#botBody)">
        <rect x="1086" y="700" width="6" height="14" />
        <rect x="1052" y="694" width="74" height="6" rx="3" />
        <circle cx="1089" cy="742" r="28" />
        <rect x="1072" y="768" width="8" height="14" rx="4" />
        <rect x="1098" y="768" width="8" height="14" rx="4" />
      </g>
      <circle cx="1089" cy="742" r="28" fill="url(#rimLeft)" />
      <circle cx="1089" cy="740" r="10" fill="url(#visor)" />
      <circle cx="1092" cy="738" r="4" fill="#27205c" />
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

const BRIDGE_PIERS = [60, 250, 440, 630, 820, 1010, 1200, 1390];

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
          <stop offset="0%" stopColor="#6b7ce8" />
          <stop offset="25%" stopColor="#9c8fe8" />
          <stop offset="45%" stopColor="#c9aee4" />
          <stop offset="62%" stopColor="#f2c8d8" />
          <stop offset="72%" stopColor="#ffe5c0" />
          <stop offset="80%" stopColor="#fdf0d5" />
        </linearGradient>
        <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fffdf4" stopOpacity="1" />
          <stop offset="30%" stopColor="#fff3cf" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#ffd9a0" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffd9a0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bldFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dccdf8" />
          <stop offset="100%" stopColor="#bcabea" />
        </linearGradient>
        <linearGradient id="bldMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ab9ce6" />
          <stop offset="100%" stopColor="#8674cc" />
        </linearGradient>
        <linearGradient id="litFace" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffd9c2" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffd9c2" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bridgeDeck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cabbf2" />
          <stop offset="100%" stopColor="#a191dd" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#aae6e0" />
          <stop offset="45%" stopColor="#62b3c4" />
          <stop offset="100%" stopColor="#3f7fa0" />
        </linearGradient>
        <linearGradient id="pier" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0b283" />
          <stop offset="100%" stopColor="#b58a55" />
        </linearGradient>
        <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050505" stopOpacity="0" />
          <stop offset="45%" stopColor="#050505" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#050505" stopOpacity="0.96" />
        </linearGradient>
        <linearGradient id="palmTrunk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#322a61" />
          <stop offset="100%" stopColor="#4d4090" />
        </linearGradient>
        <linearGradient id="palmLit" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#473a85" />
          <stop offset="100%" stopColor="#5d4fa6" />
        </linearGradient>
        <linearGradient id="botBody" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#52459c" />
          <stop offset="55%" stopColor="#3d3473" />
          <stop offset="100%" stopColor="#2c2458" />
        </linearGradient>
        <linearGradient id="rimLeft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffd9ae" stopOpacity="0.55" />
          <stop offset="18%" stopColor="#ffd9ae" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="visor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8fbf7" />
          <stop offset="100%" stopColor="#8fdcd6" />
        </linearGradient>
        <linearGradient id="hat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd98a" />
          <stop offset="100%" stopColor="#f4ad3d" />
        </linearGradient>
        <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdf6e3" />
          <stop offset="100%" stopColor="#ecdcb8" />
        </linearGradient>
        <radialGradient id="backlight" cx="0.5" cy="0.45" r="0.5">
          <stop offset="0%" stopColor="#ffd9ae" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffd9ae" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="washPink" cx="0.36" cy="0.6" r="0.65">
          <stop offset="0%" stopColor="#ff9ad2" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ff9ad2" stopOpacity="0" />
        </radialGradient>
        <pattern id="windows" width="16" height="20" patternUnits="userSpaceOnUse">
          <rect x="3" y="4" width="7" height="11" fill="#d9ccf8" opacity="0.65" />
        </pattern>
        <pattern id="windowsWarm" width="16" height="20" patternUnits="userSpaceOnUse">
          <rect x="3" y="4" width="7" height="11" fill="#ffe2c4" opacity="0.5" />
        </pattern>
        <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="cloudsoft" x="-40%" y="-60%" width="180%" height="220%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="haze" x="-20%" y="-80%" width="140%" height="260%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        {/* organic wobble: keeps vector shapes from feeling machine-straight */}
        <filter id="organic" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" result="n" seed="7" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="7" />
        </filter>
        <filter id="ripple" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.09" numOctaves="2" result="n" seed="3" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="14" />
        </filter>
        {/* canvas tooth across the whole illustration */}
        <filter id="canvas">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.07" />
          </feComponentTransfer>
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
      </defs>

      {/* sky */}
      <rect width="1440" height="620" fill="url(#sky)" />
      <circle cx="540" cy="555" r="300" fill="url(#sun)" />
      <circle cx="540" cy="552" r="58" fill="#fffae8" opacity="0.95" filter="url(#cloudsoft)" />
      <Cloud x={260} y={150} s={1.1} />
      <Cloud x={740} y={86} s={0.8} />
      <Cloud x={1060} y={196} s={1.3} />
      <Helicopter />

      {/* far skyline, dissolved into haze */}
      <g>
        {FAR_BUILDINGS.map(([x, y, w, h], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} fill="url(#bldFar)" />
            <rect x={x} y={y} width={Math.max(8, w * 0.22)} height={h} fill="url(#litFace)" opacity="0.7" />
          </g>
        ))}
      </g>
      <rect x="-40" y="430" width="1520" height="70" fill="#ffe5c0" opacity="0.4" filter="url(#haze)" />

      {/* elevated highway sweeping across the bay */}
      <g filter="url(#organic)">
        {BRIDGE_PIERS.map((x) => (
          <polygon key={x} points={`${x - 9},${452 - x * 0.02} ${x + 9},${452 - x * 0.02} ${x + 13},585 ${x - 13},585`} fill="#9a89d8" />
        ))}
        <polygon points="-20,462 1460,432 1460,448 -20,478" fill="url(#bridgeDeck)" />
        <rect x="-20" y="446" width="1480" height="5" fill="#e9d6ee" opacity="0.8" transform="rotate(-1.2 720 448)" />
        <rect x="-20" y="474" width="1480" height="6" fill="#7a68bf" opacity="0.85" transform="rotate(-1.2 720 477)" />
      </g>

      {/* mid skyline with sunlit faces */}
      <g>
        {MID_BUILDINGS.map(([x, y, w, h], i) => {
          const sunSide = x + w / 2 < 540;
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} fill="url(#bldMid)" />
              <rect x={x + 4} y={y + 8} width={w - 8} height={h - 8} fill={`url(#${i % 3 === 1 ? "windowsWarm" : "windows"})`} />
              <rect
                x={sunSide ? x + w - Math.max(10, w * 0.3) : x}
                y={y}
                width={Math.max(10, w * 0.3)}
                height={h}
                fill="url(#litFace)"
                opacity="0.85"
                transform={sunSide ? `scale(-1,1) translate(${-(2 * x + w)} 0)` : undefined}
              />
              <rect x={x} y={y} width={w} height={5} fill="#ffe2c4" opacity="0.7" />
            </g>
          );
        })}
        <rect x="243" y="296" width="4" height="36" fill="#8674cc" />
        <rect x="948" y="270" width="4" height="42" fill="#8674cc" />
        <path d="M590 352 l45 -26 l45 26 Z" fill="#9b8ad8" />
      </g>

      {/* water */}
      <rect y="560" width="1440" height="220" fill="url(#water)" />
      {/* sun glitter path */}
      <g filter="url(#ripple)" opacity="0.75">
        <polygon points="480,562 600,562 660,780 420,780" fill="#ffe9b8" opacity="0.35" />
      </g>
      {/* displaced reflections of towers + bridge */}
      <g filter="url(#ripple)" opacity="0.35" fill="#7a68bf">
        <rect x="214" y="566" width="62" height="86" />
        <rect x="594" y="566" width="82" height="72" />
        <rect x="924" y="566" width="52" height="98" />
        <rect x="1194" y="566" width="78" height="78" />
        <rect x="-20" y="566" width="1480" height="14" opacity="0.7" />
      </g>
      <g stroke="#fdf0d5" strokeWidth="3" strokeLinecap="round" opacity="0.55" filter="url(#ripple)">
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
      <rect y="780" width="1440" height="120" fill="url(#pier)" />
      <rect y="780" width="1440" height="10" fill="#7d5e36" />
      <g stroke="#a37c4c" strokeWidth="3" opacity="0.9">
        {[806, 824, 842, 860, 878].map((y) => (
          <line key={y} x1="0" y1={y} x2="1440" y2={y} />
        ))}
      </g>
      {/* warm light spilling across the boards */}
      <rect y="780" width="1440" height="120" fill="#ffd9ae" opacity="0.18" />

      <RobotCrew />

      {/* palms */}
      <Palm x={120} h={400} />
      <Palm x={252} h={300} flip />
      <Palm x={1348} h={420} flip />

      {/* atmosphere: pink wash + canvas tooth + fade into the page */}
      <rect width="1440" height="900" fill="url(#washPink)" style={{ mixBlendMode: "soft-light" }} />
      <rect width="1440" height="900" filter="url(#canvas)" fill="#000" />
      <rect y="600" width="1440" height="300" fill="url(#vignette)" />
    </svg>
  );
}
