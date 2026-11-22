"use client";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  showTag?: boolean;
};

export default function Logo({ size = "md", showTag = false }: LogoProps) {
  const iconSizes = {
    sm: 26,
    md: 32,
    lg: 40,
  };

  const textSizes = {
    sm: "16px",
    md: "19px",
    lg: "24px",
  };

  const currentIconSize = iconSizes[size];

  return (
    <div className="cineverse-logo-wrap framebox-logo-wrap">
      {/* Custom Cinematic Camera Aperture / Film Frame Box Emblem */}
      <svg
        width={currentIconSize}
        height={currentIconSize}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="cineverse-logo-emblem framebox-logo-emblem"
      >
        <defs>
          <linearGradient id="fbGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff1b44" />
            <stop offset="50%" stopColor="#e50914" />
            <stop offset="100%" stopColor="#ff5238" />
          </linearGradient>
          <linearGradient id="fbGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff8533" />
            <stop offset="100%" stopColor="#e50914" />
          </linearGradient>
          <filter id="fbGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#e50914" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Outer 35mm Cinematic Frame Box */}
        <rect
          x="2"
          y="2"
          width="40"
          height="40"
          rx="10"
          fill="#0c0d15"
          stroke="rgba(255, 255, 255, 0.14)"
          strokeWidth="1.5"
        />

        {/* Dynamic Aperture Blades forming Cinema Prism */}
        <g filter="url(#fbGlow)">
          {/* Blade 1 (Top Left) */}
          <path
            d="M10 14L22 10L24 18L13 21L10 14Z"
            fill="url(#fbGradient1)"
            opacity="0.9"
          />
          {/* Blade 2 (Top Right) */}
          <path
            d="M24 10L34 16L29 23L21 17L24 10Z"
            fill="url(#fbGradient1)"
            opacity="0.85"
          />
          {/* Blade 3 (Right) */}
          <path
            d="M34 18L33 30L25 26L27 18L34 18Z"
            fill="url(#fbGradient2)"
            opacity="0.9"
          />
          {/* Blade 4 (Bottom Right) */}
          <path
            d="M31 30L19 34L18 26L28 23L31 30Z"
            fill="url(#fbGradient1)"
            opacity="0.85"
          />
          {/* Blade 5 (Bottom Left) */}
          <path
            d="M18 34L9 26L15 20L22 26L18 34Z"
            fill="url(#fbGradient2)"
            opacity="0.9"
          />
          {/* Blade 6 (Left) */}
          <path
            d="M9 24L11 13L19 17L16 25L9 24Z"
            fill="url(#fbGradient1)"
            opacity="0.85"
          />

          {/* Central Cinema Core: Glowing Play Triangle */}
          <polygon
            points="19,16 28,22 19,28"
            fill="#ffffff"
            filter="drop-shadow(0 0 4px rgba(255,255,255,0.9))"
          />
        </g>
      </svg>

      {/* Modern Wordmark */}
      <div className="cineverse-logo-typography framebox-logo-typography">
        <span className="cineverse-logo-title framebox-logo-title" style={{ fontSize: textSizes[size] }}>
          FRAME<span className="cineverse-logo-accent framebox-logo-accent">BOX</span>
        </span>
        {showTag && <span className="cineverse-logo-subtag framebox-logo-subtag">CINEMA ARCHIVE</span>}
      </div>
    </div>
  );
}
