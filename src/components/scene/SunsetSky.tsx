export function SunsetSky() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1a0b2e 0%, #5b1647 22%, #ff2e88 48%, #ff6b35 64%, #ffc55c 76%, #14454f 88%, #0e2236 100%)",
        }}
      />
      {/* sun disc */}
      <div
        className="absolute left-1/2 top-[58%] h-[34vmin] w-[34vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, #fff3d6 0%, #ffc55c 35%, rgba(255,107,53,0.85) 65%, transparent 72%)",
          filter: "blur(6px)",
        }}
      />
      {/* horizon haze */}
      <div
        className="absolute inset-x-0 top-[68%] h-[20%]"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(255,197,92,0.25), transparent)",
          filter: "blur(20px)",
        }}
      />
      {/* water shimmer */}
      <div
        className="absolute inset-x-0 bottom-0 top-[76%]"
        style={{
          background:
            "repeating-linear-gradient(180deg, rgba(255,197,92,0.10) 0 2px, transparent 2px 9px), linear-gradient(180deg, rgba(20,69,79,0.4), #0e2236)",
        }}
      />
    </div>
  );
}
