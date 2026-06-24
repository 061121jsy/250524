"use client";

const palettes = {
  sun: ["#fff3c9", "#f1b24a", "#7c3315"],
  moon: ["#f6f1ff", "#c2a1e1", "#382245"],
  earth: ["#f8e0bb", "#d79a63", "#402718"],
  ember: ["#ffe1a8", "#ef8840", "#501e14"],
  rose: ["#ffd6e3", "#dd7d9f", "#481c2a"],
  steel: ["#edf4fb", "#8aa1b6", "#202c39"],
  amber: ["#fff0c0", "#de9e35", "#41250f"],
  lightning: ["#fff49d", "#ec9640", "#3a1a0f"],
};

function rankOrder(rank) {
  const map = {
    ace: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    page: 11,
    knight: 12,
    queen: 13,
    king: 14,
  };

  return map[rank] || 1;
}

function keywordTone(keyword, isMajor, themeOrSuit) {
  const text = `${keyword || ""}`;

  if (/(새 출발|시작|성장|성공|완성|각성)/.test(text)) {
    return { accent: "#7a4cff", glow: "#ffe28f", motif: "sunburst" };
  }
  if (/(풍요|재물|금전|현실|안정|현실감)/.test(text)) {
    return { accent: "#d78a21", glow: "#fff1b6", motif: "coinfield" };
  }
  if (/(직감|성찰|불안|멈춤|내적 힘|감정)/.test(text)) {
    return { accent: "#7b5ad6", glow: "#efe0ff", motif: "moonlace" };
  }
  if (/(선택|판단|균형|질서|전통|구조)/.test(text)) {
    return { accent: "#2a7193", glow: "#d4ebf6", motif: "splitpath" };
  }
  if (/(조화|사랑|애정|관계|풍성|풍요로움)/.test(text)) {
    return { accent: "#d85986", glow: "#ffd5e3", motif: "petalring" };
  }
  if (/(붕괴|충돌|집착|위기|종결|충격)/.test(text)) {
    return { accent: "#c04d3d", glow: "#ffe0cf", motif: "shards" };
  }
  if (/(돌파|실행력|행동|전진|열정|진행)/.test(text)) {
    return { accent: "#ee7d2c", glow: "#fff0b7", motif: "arrows" };
  }
  if (/(희망|회복|축복|빛|가능성)/.test(text)) {
    return { accent: "#d3a028", glow: "#fff8c1", motif: "halo" };
  }

  if (isMajor) {
    return {
      accent: themeOrSuit === "moon" ? "#7864d0" : "#d37d29",
      glow: themeOrSuit === "moon" ? "#ece0ff" : "#ffe7b0",
      motif: themeOrSuit === "moon" ? "moonlace" : "sunburst",
    };
  }

  return {
    accent:
      themeOrSuit === "cups"
        ? "#ca4e84"
        : themeOrSuit === "swords"
          ? "#4e789c"
          : themeOrSuit === "pentacles"
            ? "#c98a2a"
            : "#d56a25",
    glow:
      themeOrSuit === "cups"
        ? "#ffd6e4"
        : themeOrSuit === "swords"
          ? "#d9e8f4"
          : themeOrSuit === "pentacles"
            ? "#fff0b8"
            : "#ffe5bd",
    motif:
      themeOrSuit === "cups"
        ? "petalring"
        : themeOrSuit === "swords"
          ? "shards"
          : themeOrSuit === "pentacles"
            ? "coinfield"
            : "sunburst",
  };
}

function CornerOrnament({ x, y, rotate, color }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 0h24" strokeWidth="3.1" />
      <path d="M0 0v24" strokeWidth="3.1" />
      <path d="M5 5l19 19" strokeWidth="2.3" opacity="0.65" />
    </g>
  );
}

function MetallicFrame({ accent }) {
  return (
    <g fill="none">
      <rect x="26" y="26" width="308" height="508" rx="24" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" />
      <rect x="36" y="36" width="288" height="488" rx="18" stroke={accent} strokeWidth="1.5" opacity="0.34" />
      <circle cx="180" cy="220" r="160" stroke="rgba(255,255,255,0.12)" strokeWidth="1.1" strokeDasharray="5 9" />
      <circle cx="180" cy="220" r="138" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" />
      <circle cx="180" cy="220" r="114" stroke={accent} strokeWidth="1.3" opacity="0.28" />
    </g>
  );
}

function GemRing({ accent, glow }) {
  return (
    <g opacity="0.95">
      {Array.from({ length: 10 }).map((_, index) => {
        const angle = (Math.PI * 2 * index) / 10 - Math.PI / 2;
        const radius = 154;
        const x = 180 + Math.cos(angle) * radius;
        const y = 220 + Math.sin(angle) * radius;
        return (
          <g key={`gem-${index}`} transform={`translate(${x} ${y})`}>
            <circle cx="0" cy="0" r="9" fill={glow} opacity="0.72" />
            <circle cx="0" cy="0" r="4" fill={accent} />
          </g>
        );
      })}
    </g>
  );
}

function KeywordBadge({ keyword, accent, glow }) {
  return (
    <g>
      <rect x="92" y="56" width="176" height="44" rx="14" fill="rgba(255,255,255,0.92)" stroke="rgba(60,36,18,0.12)" />
      <text x="180" y="84" textAnchor="middle" fontSize="23" fill={accent} fontFamily="Georgia, serif">
        {keyword}
      </text>
      <circle cx="74" cy="78" r="8" fill={glow} stroke={accent} strokeWidth="2" />
      <circle cx="286" cy="78" r="8" fill={glow} stroke={accent} strokeWidth="2" />
    </g>
  );
}

function TitleBadge({ value, accent }) {
  return (
    <g>
      <rect x="48" y="438" width="264" height="74" rx="18" fill="rgba(255,250,242,0.96)" stroke="rgba(60,36,18,0.12)" />
      <text x="180" y="469" textAnchor="middle" fontSize="22" fill={accent} fontFamily="Georgia, serif">
        {value}
      </text>
      <text x="180" y="492" textAnchor="middle" fontSize="14" fill="rgba(60,36,18,0.72)" fontFamily="Georgia, serif">
        TAROT
      </text>
    </g>
  );
}

function MajorSymbol({ theme, accent, glow }) {
  const props = {
    fill: "none",
    stroke: accent,
    strokeWidth: "7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (theme) {
    case "beginning":
      return (
        <g {...props}>
          <circle cx="180" cy="220" r="50" />
          <path d="M180 122v38" />
          <path d="M180 280v38" />
          <path d="M82 220h38" />
          <path d="M240 220h38" />
          <path d="M114 154l26 26" />
          <path d="M220 260l26 26" />
          <path d="M246 154l-26 26" />
          <path d="M140 260l-26 26" />
          <path d="M180 150l18 30 34 10-24 24 6 34-34-18-34 18 6-34-24-24 34-10z" fill={glow} opacity="0.92" stroke="none" />
        </g>
      );
    case "manifestation":
      return (
        <g {...props}>
          <path d="M136 326l88-172" />
          <circle cx="250" cy="154" r="12" fill={glow} opacity="0.82" stroke="none" />
          <path d="M250 132v20" />
          <path d="M240 154h20" />
        </g>
      );
    case "intuition":
      return (
        <g {...props}>
          <path d="M214 126c-23 8-39 29-39 54 0 31 25 56 56 56 11 0 21-3 30-8-15 31-47 52-83 52-50 0-90-40-90-90s40-90 90-90c15 0 28 4 39 11-2 7-2 14-3 19z" />
          <circle cx="248" cy="176" r="10" fill={glow} stroke="none" />
        </g>
      );
    case "nurture":
      return (
        <g {...props}>
          <circle cx="180" cy="220" r="18" />
          <path d="M180 156c15 0 28 12 28 28 0 10-5 19-13 25" />
          <path d="M180 284c-15 0-28-12-28-28 0-10 5-19 13-25" />
          <path d="M126 220c0-15 12-28 28-28" />
          <path d="M234 220c0 15-12 28-28 28" />
          <circle cx="180" cy="220" r="58" fill={glow} opacity="0.16" stroke="none" />
        </g>
      );
    case "structure":
      return (
        <g {...props}>
          <path d="M124 124h112" />
          <path d="M146 124v180" />
          <path d="M214 124v180" />
          <path d="M132 304h96" />
          <path d="M160 176h40" />
          <path d="M160 224h40" />
          <path d="M136 152h88" stroke={glow} opacity="0.5" />
        </g>
      );
    case "tradition":
      return (
        <g {...props}>
          <path d="M118 292V170c0-34 28-62 62-62s62 28 62 62v122" />
          <path d="M136 292h88" />
          <path d="M152 180h56" />
          <path d="M152 220h56" />
        </g>
      );
    case "choice":
      return (
        <g {...props}>
          <circle cx="144" cy="178" r="32" />
          <circle cx="216" cy="178" r="32" />
          <path d="M180 210v82" />
          <path d="M142 252h76" stroke={glow} opacity="0.7" />
        </g>
      );
    case "momentum":
      return (
        <g {...props}>
          <path d="M114 256h128" />
          <path d="M194 192l50 64-50 64" />
          <path d="M136 178l-16 32 16 32" stroke={glow} opacity="0.7" />
        </g>
      );
    case "courage":
      return (
        <g {...props}>
          <path d="M180 120l72 26v74c0 54-31 90-72 110-41-20-72-56-72-110v-74z" />
          <path d="M148 214h64" />
          <path d="M180 176v76" />
          <path d="M180 120l0 0" fill={glow} />
        </g>
      );
    case "reflection":
      return (
        <g {...props}>
          <path d="M180 108v38" />
          <path d="M146 146h68" />
          <path d="M156 146l24 156" />
          <path d="M204 146l-24 156" />
          <path d="M156 302h48" />
          <circle cx="180" cy="220" r="46" fill={glow} opacity="0.12" stroke="none" />
        </g>
      );
    case "cycle":
      return (
        <g {...props}>
          <circle cx="180" cy="220" r="72" />
          <circle cx="180" cy="220" r="22" />
          <path d="M180 148v144" />
          <path d="M108 220h144" />
          <path d="M130 170l100 100" />
          <path d="M230 170l-100 100" />
        </g>
      );
    case "truth":
      return (
        <g {...props}>
          <path d="M180 118v170" />
          <path d="M146 154h68" />
          <path d="M128 176l-18 44h36z" />
          <path d="M232 176l-18 44h36z" />
          <path d="M150 304h60" />
        </g>
      );
    case "pause":
      return (
        <g {...props}>
          <path d="M132 112h96" />
          <path d="M132 328h96" />
          <path d="M148 112c0 52 32 76 32 108s-32 56-32 108" />
          <path d="M212 112c0 52-32 76-32 108s32 56 32 108" />
        </g>
      );
    case "ending":
      return (
        <g {...props}>
          <path d="M118 278c42-92 126-126 134-126-4 80-50 148-134 126z" />
          <path d="M154 260c22-20 46-42 80-74" />
        </g>
      );
    case "balance":
      return (
        <g {...props}>
          <path d="M108 286c18-46 50-72 72-72s54 26 72 72" />
          <path d="M126 286h108" />
          <path d="M180 214v72" />
        </g>
      );
    case "attachment":
      return (
        <g {...props}>
          <path d="M144 160h72c20 0 36 16 36 36s-16 36-36 36h-72c-20 0-36-16-36-36s16-36 36-36z" />
          <path d="M132 268h96c20 0 36 16 36 36s-16 36-36 36h-96" />
        </g>
      );
    case "shock":
      return (
        <g {...props}>
          <path d="M144 302l12-160h48l12 160z" />
          <path d="M120 302h120" />
          <path d="M162 170h36" />
          <path d="M180 124l-20 34" />
        </g>
      );
    case "hope":
      return (
        <g {...props}>
          <path d="M180 116l24 74h78l-63 46 24 74-63-46-63 46 24-74-63-46h78z" />
        </g>
      );
    case "uncertainty":
      return (
        <g {...props}>
          <path d="M180 126c36 0 68 30 68 68s-32 68-68 68-68-30-68-68 32-68 68-68z" />
          <path d="M124 268c22 20 44 30 56 30s34-10 56-30" />
        </g>
      );
    case "success":
      return (
        <g {...props}>
          <circle cx="180" cy="220" r="54" />
          <path d="M180 126v36" />
          <path d="M180 278v36" />
          <path d="M86 220h36" />
          <path d="M238 220h36" />
          <path d="M115 155l26 26" />
          <path d="M219 259l26 26" />
          <path d="M245 155l-26 26" />
          <path d="M141 259l-26 26" />
        </g>
      );
    case "awakening":
      return (
        <g {...props}>
          <path d="M96 220c28-44 64-66 84-66s56 22 84 66c-28 44-64 66-84 66s-56-22-84-66z" />
          <circle cx="180" cy="220" r="24" />
        </g>
      );
    case "completion":
      return (
        <g {...props}>
          <circle cx="180" cy="220" r="72" />
          <path d="M128 170c16-14 32-22 52-22s36 8 52 22" />
          <path d="M128 270c16 14 32 22 52 22s36-8 52-22" />
        </g>
      );
    default:
      return (
        <g {...props}>
          <path d="M180 126l26 74h78l-63 46 24 74-65-46-63 46 24-74-63-46h78z" />
        </g>
      );
  }
}

function SuitSymbol({ suit, rank, accent, glow }) {
  const props = {
    fill: "none",
    stroke: accent,
    strokeWidth: "7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icon = suit || "wands";
  const rankValue = rankOrder(rank);

  if (rank === "ace") {
    return (
      <g {...props}>
        <circle cx="180" cy="220" r="46" />
        <path d="M180 176v88" />
        <path d="M136 220h88" />
        <circle cx="180" cy="220" r="20" fill={glow} opacity="0.16" stroke="none" />
      </g>
    );
  }

  if (icon === "cups") {
    return (
      <g {...props}>
        <path d="M120 236c0-32 24-56 60-56s60 24 60 56v18c0 30-20 50-60 50s-60-20-60-50z" />
        <path d="M140 232h80" />
        <path d="M152 304h56" />
      </g>
    );
  }

  if (icon === "swords") {
    return (
      <g {...props}>
        <path d="M180 92l28 68-28 24-28-24 28-68z" />
        <path d="M180 184v176" />
        <path d="M150 304h60" />
      </g>
    );
  }

  if (icon === "pentacles") {
    return (
      <g {...props}>
        <circle cx="180" cy="228" r="74" />
        <path d="M180 170l17 43 47 4-36 29 11 46-39-25-39 25 11-46-36-29 47-4z" />
      </g>
    );
  }

  const bars = Math.min(rankValue, 6);
  return (
    <g {...props}>
      <path d="M180 84v184" />
      <path d="M148 126h64" />
      <path d="M138 182c0 26 14 44 42 44s42-18 42-44" />
      {Array.from({ length: bars }).map((_, index) => (
        <path key={`wand-bar-${index}`} d={`M${162 + index * 6} ${250 + index * 3}l14-58 14 58`} opacity={index < 3 ? 1 : 0.65} />
      ))}
    </g>
  );
}

function BackdropPattern({ motif, accent, glow }) {
  if (motif === "coinfield") {
    return (
      <g opacity="0.84">
        {Array.from({ length: 9 }).map((_, index) => {
          const angle = (Math.PI * 2 * index) / 9 - Math.PI / 2;
          const radius = 150;
          const x = 180 + Math.cos(angle) * radius;
          const y = 220 + Math.sin(angle) * radius;
          return <circle key={`coin-${index}`} cx={x} cy={y} r="9" fill={glow} opacity="0.52" stroke={accent} strokeWidth="2" />;
        })}
      </g>
    );
  }

  if (motif === "moonlace") {
    return (
      <g opacity="0.84" fill="none" stroke={glow} strokeWidth="2">
        <path d="M116 146c20-18 40-26 64-26s44 8 64 26" />
        <path d="M116 294c20 18 40 26 64 26s44-8 64-26" />
        <circle cx="94" cy="220" r="18" fill={glow} opacity="0.42" />
        <circle cx="266" cy="220" r="18" fill={glow} opacity="0.42" />
      </g>
    );
  }

  if (motif === "splitpath") {
    return (
      <g opacity="0.84" fill="none" stroke={glow} strokeWidth="2">
        <path d="M114 176h52" />
        <path d="M194 176h52" />
        <path d="M114 264h52" />
        <path d="M194 264h52" />
        <path d="M156 176c10 18 10 34 0 52" />
        <path d="M204 176c-10 18-10 34 0 52" />
      </g>
    );
  }

  if (motif === "petalring") {
    return (
      <g opacity="0.84" fill={glow} stroke={accent} strokeWidth="1.6">
        {Array.from({ length: 6 }).map((_, index) => {
          const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
          const x = 180 + Math.cos(angle) * 118;
          const y = 220 + Math.sin(angle) * 118;
          return <path key={`petal-${index}`} d={`M${x} ${y}c8-18 24-18 32 0-8 18-24 18-32 0z`} />;
        })}
      </g>
    );
  }

  if (motif === "shards") {
    return (
      <g opacity="0.8" fill={glow} stroke={accent} strokeWidth="1.6">
        <path d="M94 168l44 18-28 40-30-18z" />
        <path d="M266 168l-44 18 28 40 30-18z" />
        <path d="M94 292l44-18-28-40-30 18z" />
        <path d="M266 292l-44-18 28-40 30 18z" />
      </g>
    );
  }

  if (motif === "arrows") {
    return (
      <g opacity="0.84" fill="none" stroke={glow} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M108 220h42" />
        <path d="M222 220h42" />
        <path d="M150 188l-20 32 20 32" />
        <path d="M210 188l20 32-20 32" />
      </g>
    );
  }

  return (
    <g opacity="0.85" fill="none" stroke={glow} strokeWidth="2">
      <circle cx="180" cy="220" r="142" />
      <circle cx="180" cy="220" r="118" opacity="0.72" />
    </g>
  );
}

export default function TarotCardArt({ card }) {
  const isMajor = card.number < 22;
  const palette = palettes[card.palette] || palettes.sun;
  const suit = isMajor ? null : card.id.split("-")[0];
  const rank = isMajor ? null : card.id.split("-")[1];
  const displayValue = isMajor ? card.number : card.roman;
  const keyword = card.keyword || card.subtitle || card.name;
  const tone = keywordTone(keyword, isMajor, isMajor ? card.theme : suit);
  const accent = tone.accent;
  const glow = tone.glow;
  const motif = tone.motif;
  const ringCount = isMajor ? 12 : Math.min(rankOrder(rank), 10);

  return (
    <svg className="tarot-card-art" viewBox="0 0 360 560" role="img" aria-label={card.name}>
      <defs>
        <linearGradient id={`bg-${card.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette[0]} />
          <stop offset="54%" stopColor={palette[1]} />
          <stop offset="100%" stopColor={palette[2]} />
        </linearGradient>
        <radialGradient id={`shine-${card.id}`} cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#fffdf9" stopOpacity="0.98" />
          <stop offset="100%" stopColor="#fffdf9" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`panel-${card.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fffdf7" />
          <stop offset="100%" stopColor="#f0e1c8" />
        </linearGradient>
      </defs>

      <rect x="8" y="8" width="344" height="544" rx="32" fill={`url(#bg-${card.id})`} />
      <rect x="18" y="18" width="324" height="524" rx="28" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" />
      <rect x="34" y="34" width="292" height="492" rx="22" fill={`url(#panel-${card.id})`} stroke="rgba(63,38,18,0.1)" />
      <rect x="44" y="44" width="272" height="472" rx="18" fill="url(#shine-${card.id})" />

      <BackdropPattern motif={motif} accent={accent} glow={glow} />
      <MetallicFrame accent={accent} />
      <GemRing accent={accent} glow={glow} />

      <KeywordBadge keyword={keyword} accent={accent} glow={glow} />
      <TitleBadge value={displayValue} accent={accent} />

      <CornerOrnament x={50} y={58} rotate={0} color="rgba(63,38,18,0.32)" />
      <CornerOrnament x={310} y={58} rotate={90} color="rgba(63,38,18,0.32)" />
      <CornerOrnament x={50} y={502} rotate={-90} color="rgba(63,38,18,0.32)" />
      <CornerOrnament x={310} y={502} rotate={180} color="rgba(63,38,18,0.32)" />

      {isMajor ? (
        <MajorSymbol theme={card.theme} accent={accent} glow={glow} />
      ) : (
        <SuitSymbol suit={suit} rank={rank} accent={accent} glow={glow} />
      )}

      <g opacity="0.8">
        {Array.from({ length: ringCount }).map((_, index) => {
          const angle = (Math.PI * 2 * index) / ringCount - Math.PI / 2;
          const radius = index % 2 === 0 ? 120 : 132;
          const cx = 180 + Math.cos(angle) * radius;
          const cy = 220 + Math.sin(angle) * radius;
          return <circle key={`${card.id}-orbit-${index}`} cx={cx} cy={cy} r={index % 3 === 0 ? 4.1 : 3.1} fill={accent} />;
        })}
      </g>

      <g opacity="0.76">
        <path d="M100 114c14 10 30 16 48 16s34-6 48-16" fill="none" stroke="rgba(255,255,255,0.36)" strokeWidth="3" strokeLinecap="round" />
        <path d="M164 340c10 4 22 6 28 6s18-2 28-6" fill="none" stroke="rgba(255,255,255,0.36)" strokeWidth="3" strokeLinecap="round" />
      </g>

      <text x="180" y="392" textAnchor="middle" fontSize="13" fill="rgba(63,38,18,0.72)" fontFamily="Georgia, serif">
        {isMajor ? "Major Arcana" : `${suit} / ${rank || "ace"}`}
      </text>
    </svg>
  );
}
