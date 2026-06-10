import type { PortraitVariant } from "@/lib/crew";

const INDIGO = "#3d3473";
const INDIGO_DARK = "#322a61";
const VISOR = "#aff3ef";
const CREAM = "#fdf0d5";
const GOLD = "#ffc55c";

function Drone({ x, y, r, eye = 0.35 }: { x: number; y: number; r: number; eye?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-r * 1.3} y={-r - 18} width={r * 2.6} height={7} rx={3.5} fill={INDIGO} />
      <rect x={-3} y={-r - 14} width={6} height={16} fill={INDIGO} />
      <circle r={r} fill={INDIGO} />
      <circle cx={r * 0.1} cy={-r * 0.08} r={r * eye} fill={VISOR} />
      <circle cx={r * 0.18} cy={-r * 0.14} r={r * eye * 0.4} fill={INDIGO_DARK} />
      <rect x={-r * 0.6} y={r - 4} width={8} height={14} rx={4} fill={INDIGO} />
      <rect x={r * 0.25} y={r - 4} width={8} height={14} rx={4} fill={INDIGO} />
    </g>
  );
}

function BaseBot({ children, rightArm }: { children?: React.ReactNode; rightArm?: React.ReactNode }) {
  return (
    <>
      {/* shadow */}
      <ellipse cx="140" cy="350" rx="78" ry="10" fill="#000" opacity="0.16" />
      {/* legs + feet */}
      <g fill={INDIGO}>
        <rect x="116" y="296" width="19" height="50" rx="8" />
        <rect x="146" y="296" width="19" height="50" rx="8" />
        <rect x="106" y="338" width="36" height="14" rx="7" />
        <rect x="140" y="338" width="36" height="14" rx="7" />
      </g>
      {/* body */}
      <rect x="94" y="192" width="92" height="118" rx="22" fill={INDIGO} />
      {/* chest panel */}
      <rect x="112" y="214" width="56" height="38" rx="9" fill={INDIGO_DARK} />
      <circle cx="124" cy="226" r="4" fill={VISOR} />
      <circle cx="138" cy="226" r="4" fill={GOLD} />
      <rect x="118" y="238" width="44" height="5" rx="2.5" fill="#5a4fa3" />
      {/* left arm hanging */}
      <rect x="74" y="206" width="17" height="86" rx="8.5" fill={INDIGO} />
      {/* right arm (variant-specific or hanging) */}
      {rightArm ?? <rect x="189" y="206" width="17" height="86" rx="8.5" fill={INDIGO} />}
      {/* head */}
      <rect x="100" y="122" width="80" height="64" rx="17" fill={INDIGO} />
      <rect x="112" y="140" width="56" height="26" rx="13" fill={VISOR} />
      <rect x="122" y="147" width="10" height="11" rx="5" fill={INDIGO_DARK} />
      <rect x="148" y="147" width="10" height="11" rx="5" fill={INDIGO_DARK} />
      {/* antenna */}
      <rect x="137" y="102" width="5" height="20" fill={INDIGO} />
      <circle cx="139.5" cy="99" r="6" fill={INDIGO} />
      {children}
    </>
  );
}

export function RobotPortrait({ variant }: { variant: PortraitVariant }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 280 360"
      className="h-full w-full"
      preserveAspectRatio="xMidYMax meet"
    >
      {variant === "swarm" ? (
        <>
          <ellipse cx="140" cy="350" rx="100" ry="10" fill="#000" opacity="0.14" />
          <Drone x={140} y={210} r={46} />
          <Drone x={66} y={282} r={28} eye={0.4} />
          <Drone x={216} y={268} r={24} eye={0.4} />
        </>
      ) : variant === "foreman" ? (
        <BaseBot
          rightArm={
            <>
              {/* bent arm pinning blueprints to the hip */}
              <rect x="189" y="206" width="17" height="52" rx="8.5" fill={INDIGO} />
              <rect x="176" y="248" width="58" height="18" rx="9" fill={CREAM} />
              <rect x="176" y="248" width="58" height="18" rx="9" fill="none" stroke={INDIGO} strokeWidth="3" />
              <line x1="205" y1="248" x2="205" y2="266" stroke={INDIGO} strokeWidth="3" />
            </>
          }
        >
          {/* hard hat */}
          <path d="M102 128 q 38 -34 76 0 l 0 7 l -76 0 Z" fill={GOLD} />
          <rect x="95" y="132" width="90" height="8" rx="4" fill="#f2b03c" />
        </BaseBot>
      ) : variant === "architect" ? (
        <BaseBot
          rightArm={
            <>
              {/* arm raised, holding a model tower */}
              <rect x="189" y="200" width="17" height="46" rx="8.5" fill={INDIGO} />
              <rect x="193" y="238" width="42" height="15" rx="7.5" fill={INDIGO} />
              <g>
                <rect x="216" y="172" width="30" height="66" rx="3" fill="#b3a5ef" />
                <rect x="221" y="158" width="20" height="18" rx="2" fill="#b3a5ef" />
                {[180, 194, 208, 222].map((y) => (
                  <rect key={y} x="222" y={y} width="18" height="6" fill="#8f7fd4" />
                ))}
              </g>
            </>
          }
        >
          {/* flat architect cap */}
          <rect x="98" y="116" width="84" height="12" rx="6" fill="#b3a5ef" />
          <rect x="126" y="106" width="28" height="12" rx="5" fill="#b3a5ef" />
        </BaseBot>
      ) : variant === "physics" ? (
        <BaseBot
          rightArm={
            <>
              {/* arm out, dangling a pendulum */}
              <rect x="189" y="202" width="17" height="40" rx="8.5" fill={INDIGO} />
              <rect x="193" y="232" width="50" height="15" rx="7.5" fill={INDIGO} />
              <line x1="236" y1="244" x2="236" y2="294" stroke={INDIGO} strokeWidth="3.5" />
              <circle cx="236" cy="304" r="12" fill="#7fd4d4" />
            </>
          }
        >
          {/* goggles pushed up on the head */}
          <rect x="104" y="112" width="72" height="8" rx="4" fill={GOLD} />
          <circle cx="124" cy="116" r="11" fill="none" stroke={GOLD} strokeWidth="5" />
          <circle cx="156" cy="116" r="11" fill="none" stroke={GOLD} strokeWidth="5" />
        </BaseBot>
      ) : variant === "missions" ? (
        <BaseBot
          rightArm={
            <>
              {/* holding a clapperboard */}
              <rect x="189" y="204" width="17" height="48" rx="8.5" fill={INDIGO} />
              <g transform="rotate(-8 226 250)">
                <rect x="200" y="240" width="62" height="42" rx="4" fill={INDIGO_DARK} />
                <rect x="200" y="230" width="62" height="13" rx="4" fill={CREAM} />
                {[204, 220, 236, 252].map((x) => (
                  <rect key={x} x={x} y="230" width="8" height="13" fill={INDIGO_DARK} transform={`skewX(-18)`} transform-origin={`${x} 230`} />
                ))}
                <rect x="204" y="250" width="40" height="4" rx="2" fill="#5a4fa3" />
                <rect x="204" y="260" width="30" height="4" rx="2" fill="#5a4fa3" />
              </g>
            </>
          }
        >
          {/* beret */}
          <ellipse cx="132" cy="116" rx="36" ry="11" fill="#ff2e88" />
          <circle cx="132" cy="106" r="4" fill="#ff2e88" />
        </BaseBot>
      ) : variant === "traffic" ? (
        <BaseBot
          rightArm={
            <>
              {/* holding a stop paddle */}
              <rect x="189" y="206" width="17" height="56" rx="8.5" fill={INDIGO} />
              <line x1="232" y1="180" x2="232" y2="280" stroke={INDIGO} strokeWidth="6" strokeLinecap="round" />
              <polygon
                points="232,148 248,154 254,170 248,186 232,192 216,186 210,170 216,154"
                fill="#ff6b35"
                stroke={CREAM}
                strokeWidth="3"
              />
              <rect x="220" y="166" width="24" height="7" rx="3.5" fill={CREAM} />
            </>
          }
        >
          {/* peaked cap */}
          <rect x="100" y="114" width="80" height="13" rx="6" fill="#ff6b35" />
          <rect x="92" y="124" width="50" height="7" rx="3.5" fill="#e05a28" />
        </BaseBot>
      ) : (
        <BaseBot
          rightArm={
            <>
              {/* thumbs up */}
              <rect x="189" y="200" width="17" height="46" rx="8.5" fill={INDIGO} />
              <rect x="193" y="206" width="34" height="15" rx="7.5" fill={INDIGO} transform="rotate(-40 193 214)" />
              <circle cx="222" cy="190" r="11" fill={INDIGO} />
              <rect x="216" y="168" width="10" height="20" rx="5" fill={INDIGO} />
            </>
          }
        />
      )}
    </svg>
  );
}
