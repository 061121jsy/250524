"use client";

const palettes = {
  sun: ["#fff5cf", "#f6b84c", "#7a3415"],
  moon: ["#f6f0ff", "#c0a0de", "#34233f"],
  earth: ["#f7e1bf", "#d69a63", "#3d2618"],
  ember: ["#ffe3a5", "#ef8d45", "#4e1f16"],
  rose: ["#ffd7e2", "#db7fa0", "#431d2a"],
  steel: ["#eef4fb", "#8aa0b2", "#1f2c39"],
  amber: ["#fff0bf", "#e2a13e", "#3d2410"],
  lightning: ["#fff39c", "#ee9c44", "#34190f"],
};

const suitGlyphs = {
  wands: "spark",
  cups: "cup",
  swords: "blade",
  pentacles: "coin",
};

const majorGlyphs = {
  beginning: "starburst",
  manifestation: "wand",
  intuition: "moon",
  nurture: "bloom",
  structure: "pillar",
  tradition: "arch",
  choice: "split",
  momentum: "arrow",
  courage: "shield",
  reflection: "lantern",
  cycle: "wheel",
  truth: "scales",
  pause: "hourglass",
  ending: "leaf",
  balance: "bridge",
  attachment: "chain",
  shock: "tower",
  hope: "star",
  uncertainty: "veil",
  success: "sun",
  awakening: "eye",
  completion: "wreath",
};

function rankValue(rank) {
  const ranks = {
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

  return ranks[rank] || 1;
}

function Corner({ x, y, rotate, color }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 0h22" strokeWidth="3" />
      <path d="M0 0v22" strokeWidth="3" />
      <path d="M4 4l18 18" strokeWidth="2" opacity="0.65" />
    </g>
  );
}

function FrameRings({ accent }) {
  return (
    <g fill="none">
      <circle cx="180" cy="220" r="160" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="4 10" />
      <circle cx="180" cy="220" r="136" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
      <circle cx="180" cy="220" r="110" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
      <circle cx="180" cy="220" r="82" stroke={accent} strokeWidth="1.6" opacity="0.25" />
    </g>
  );
}

function Gem({ x, y, color }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx="0" cy="0" r="8" fill={color} opacity="0.85" />
      <circle cx="0" cy="0" r="3" fill="rgba(255,255,255,0.92)" />
    </g>
  );
}

function TitlePlate({ value, accent }) {
  return (
    <g>
      <rect x="96" y="56" width="168" height="44" rx="14" fill="rgba(255,255,255,0.92)" stroke="rgba(63,38,18,0.14)" />
      <text x="180" y="84" textAnchor="middle" fontSize="24" fill={accent} fontFamily="Georgia, serif">
        {value}
      </text>
    </g>
  );
}

function FooterPlate({ name, keyword, accent }) {
  return (
    <g>
      <rect x="42" y="436" width="276" height="78" rx="20" fill="rgba(255,250,243,0.96)" stroke="rgba(63,38,18,0.14)" />
      <text x="180" y="469" textAnchor="middle" fontSize="22" fill={accent} fontFamily="Georgia, serif">
        {name}
      </text>
      <text x="180" y="492" textAnchor="middle" fontSize="14" fill="rgba(63,38,18,0.72)" fontFamily="Georgia, serif">
        {keyword}
      </text>
    </g>
  );
}

function getKeywordProfile(keyword, isMajor, themeOrSuit) {
  const text = `${keyword || ""}`;
  if (/(새 출발|시작|성공|각성|완성)/.test(text)) {
    return { accent: "#7c4dff", secondary: "#ffe08a", pattern: "rays" };
  }
  if (/(풍요|현실|금전|재물|안정)/.test(text)) {
    return { accent: "#d98920", secondary: "#fff0b5", pattern: "coins" };
  }
  if (/(직감|불안|성찰|멈춤|내적 힘)/.test(text)) {
    return { accent: "#7857c5", secondary: "#f1e4ff", pattern: "moon" };
  }
  if (/(선택|균형|판단|질서|전통)/.test(text)) {
    return { accent: "#2d6f8f", secondary: "#cfe9f5", pattern: "split" };
  }
  if (/(조화|감정|사랑|애정|관계)/.test(text)) {
    return { accent: "#d85b84", secondary: "#ffd5e4", pattern: "petals" };
  }
  if (/(붕괴|충돌|집착|종결|위기)/.test(text)) {
    return { accent: "#bb4e3b", secondary: "#ffe0c9", pattern: "shards" };
  }
  if (/(돌파|실행력|열정|행동|전진)/.test(text)) {
    return { accent: "#eb7e2f", secondary: "#fff0b8", pattern: "arrows" };
  }
  if (/(희망|빛|축복|회복)/.test(text)) {
    return { accent: "#d4a02d", secondary: "#fff6bf", pattern: "stars" };
  }

  if (isMajor) {
    return {
      accent: themeOrSuit === "moon" ? "#7d64c9" : "#cf7a2b",
      secondary: themeOrSuit === "moon" ? "#e8dfff" : "#ffe7b4",
      pattern: themeOrSuit === "moon" ? "moon" : "sun",
    };
  }

  return {
    accent:
      themeOrSuit === "cups"
        ? "#c84f82"
        : themeOrSuit === "swords"
          ? "#52789b"
          : themeOrSuit === "pentacles"
            ? "#c58a2d"
            : "#d66f28",
    secondary:
      themeOrSuit === "cups"
        ? "#ffd4e4"
        : themeOrSuit === "swords"
          ? "#dce9f5"
          : themeOrSuit === "pentacles"
            ? "#ffefba"
            : "#ffe6c0",
    pattern:
      themeOrSuit === "cups"
        ? "petals"
        : themeOrSuit === "swords"
          ? "shards"
          : themeOrSuit === "pentacles"
            ? "coins"
            : "rays",
  };
}

function PatternBackdrop({ kind, accent, secondary }) {
  if (kind === "coins") {
    return (
      <g opacity="0.9">
        {Array.from({ length: 8 }).map((_, index) => {
          const angle = (Math.PI * 2 * index) / 8 - Math.PI / 2;
          const radius = 154;
          const x = 180 + Math.cos(angle) * radius;
          const y = 220 + Math.sin(angle) * radius;
          return <circle key={`coin-${index}`} cx={x} cy={y} r="10" fill={secondary} opacity="0.55" stroke={accent} strokeWidth="2" />;
        })}
      </g>
    );
  }

  if (kind === "moon") {
    return (
      <g opacity="0.8" fill="none" stroke={secondary} strokeWidth="2">
        <path d="M116 150c20-18 40-26 64-26s44 8 64 26" />
        <path d="M116 290c20 18 40 26 64 26s44-8 64-26" />
        <circle cx="96" cy="220" r="18" fill={secondary} opacity="0.5" />
        <circle cx="264" cy="220" r="18" fill={secondary} opacity="0.5" />
      </g>
    );
  }

  if (kind === "split") {
    return (
      <g opacity="0.82" fill="none" stroke={secondary} strokeWidth="2">
        <path d="M114 176h52" />
        <path d="M194 176h52" />
        <path d="M114 264h52" />
        <path d="M194 264h52" />
        <path d="M156 176c10 18 10 34 0 52" />
        <path d="M204 176c-10 18-10 34 0 52" />
      </g>
    );
  }

  if (kind === "petals") {
    return (
      <g opacity="0.82" fill={secondary} stroke={accent} strokeWidth="1.6">
        {Array.from({ length: 6 }).map((_, index) => {
          const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
          const x = 180 + Math.cos(angle) * 118;
          const y = 220 + Math.sin(angle) * 118;
          return <path key={`petal-${index}`} d={`M${x} ${y}c8-18 24-18 32 0-8 18-24 18-32 0z`} />;
        })}
      </g>
    );
  }

  if (kind === "shards") {
    return (
      <g opacity="0.8" fill={secondary} stroke={accent} strokeWidth="1.6">
        <path d="M96 168l42 18-28 40-30-18z" />
        <path d="M264 168l-42 18 28 40 30-18z" />
        <path d="M96 292l42-18-28-40-30 18z" />
        <path d="M264 292l-42-18 28-40 30 18z" />
      </g>
    );
  }

  if (kind === "arrows") {
    return (
      <g opacity="0.85" fill="none" stroke={secondary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M108 220h42" />
        <path d="M222 220h42" />
        <path d="M150 188l-20 32 20 32" />
        <path d="M210 188l20 32-20 32" />
      </g>
    );
  }

  if (kind === "stars" || kind === "sun" || kind === "rays") {
    return (
      <g opacity="0.85" fill={secondary}>
        {Array.from({ length: 10 }).map((_, index) => {
          const angle = (Math.PI * 2 * index) / 10 - Math.PI / 2;
          const radius = 150;
          const x = 180 + Math.cos(angle) * radius;
          const y = 220 + Math.sin(angle) * radius;
          return <path key={`ray-${index}`} d={`M${x} ${y}l4 8 8 4-8 4-4 8-4-8-8-4 8-4z`} />;
        })}
      </g>
    );
  }

  return (
    <g opacity="0.85" fill="none" stroke={secondary} strokeWidth="2">
      <circle cx="180" cy="220" r="144" />
      <circle cx="180" cy="220" r="120" opacity="0.7" />
    </g>
  );
}

function MajorMotif({ theme, color }) {
  const props = {
    fill: "none",
    stroke: color,
    strokeWidth: "7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (majorGlyphs[theme] || "star") {
    case "starburst":
      return (
        <g {...props}>
          <circle cx="180" cy="220" r="52" />
          <path d="M180 120v38" />
          <path d="M180 282v38" />
          <path d="M80 220h38" />
          <path d="M242 220h38" />
          <path d="M116 156l26 26" />
          <path d="M218 258l26 26" />
          <path d="M244 156l-26 26" />
          <path d="M142 258l-26 26" />
        </g>
      );
    case "wand":
      return (
        <g {...props}>
          <path d="M136 326l88-172" />
          <path d="M252 152l-16 0" />
          <path d="M252 152l0 16" />
          <path d="M252 152l-16 0" />
        </g>
      );
    case "moon":
      return (
        <g {...props}>
          <path d="M214 126c-23 8-39 29-39 54 0 31 25 56 56 56 11 0 21-3 30-8-15 31-47 52-83 52-50 0-90-40-90-90s40-90 90-90c15 0 28 4 39 11-2 7-2 14-3 19z" />
        </g>
      );
    case "bloom":
      return (
        <g {...props}>
          <circle cx="180" cy="220" r="18" />
          <path d="M180 156c15 0 28 12 28 28 0 10-5 19-13 25" />
          <path d="M180 284c-15 0-28-12-28-28 0-10 5-19 13-25" />
          <path d="M126 220c0-15 12-28 28-28" />
          <path d="M234 220c0 15-12 28-28 28" />
        </g>
      );
    case "pillar":
      return (
        <g {...props}>
          <path d="M124 124h112" />
          <path d="M146 124v180" />
          <path d="M214 124v180" />
          <path d="M132 304h96" />
          <path d="M160 176h40" />
          <path d="M160 224h40" />
        </g>
      );
    case "arch":
      return (
        <g {...props}>
          <path d="M118 292V170c0-34 28-62 62-62s62 28 62 62v122" />
          <path d="M136 292h88" />
          <path d="M152 180h56" />
        </g>
      );
    case "split":
      return (
        <g {...props}>
          <circle cx="144" cy="178" r="32" />
          <circle cx="216" cy="178" r="32" />
          <path d="M180 210v82" />
        </g>
      );
    case "arrow":
      return (
        <g {...props}>
          <path d="M114 256h128" />
          <path d="M194 192l50 64-50 64" />
        </g>
      );
    case "shield":
      return (
        <g {...props}>
          <path d="M180 120l72 26v74c0 54-31 90-72 110-41-20-72-56-72-110v-74z" />
          <path d="M148 214h64" />
          <path d="M180 176v76" />
        </g>
      );
    case "lantern":
      return (
        <g {...props}>
          <path d="M180 108v38" />
          <path d="M146 146h68" />
          <path d="M156 146l24 156" />
          <path d="M204 146l-24 156" />
          <path d="M156 302h48" />
        </g>
      );
    case "wheel":
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
    case "scales":
      return (
        <g {...props}>
          <path d="M180 118v170" />
          <path d="M146 154h68" />
          <path d="M128 176l-18 44h36z" />
          <path d="M232 176l-18 44h36z" />
          <path d="M150 304h60" />
        </g>
      );
    case "hourglass":
      return (
        <g {...props}>
          <path d="M132 112h96" />
          <path d="M132 328h96" />
          <path d="M148 112c0 52 32 76 32 108s-32 56-32 108" />
          <path d="M212 112c0 52-32 76-32 108s32 56 32 108" />
        </g>
      );
    case "leaf":
      return (
        <g {...props}>
          <path d="M118 278c42-92 126-126 134-126-4 80-50 148-134 126z" />
          <path d="M154 260c22-20 46-42 80-74" />
        </g>
      );
    case "bridge":
      return (
        <g {...props}>
          <path d="M108 286c18-46 50-72 72-72s54 26 72 72" />
          <path d="M126 286h108" />
          <path d="M180 214v72" />
        </g>
      );
    case "chain":
      return (
        <g {...props}>
          <path d="M144 160h72c20 0 36 16 36 36s-16 36-36 36h-72c-20 0-36-16-36-36s16-36 36-36z" />
          <path d="M132 268h96c20 0 36 16 36 36s-16 36-36 36h-96" />
        </g>
      );
    case "tower":
      return (
        <g {...props}>
          <path d="M144 302l12-160h48l12 160z" />
          <path d="M120 302h120" />
          <path d="M162 170h36" />
          <path d="M180 124l-20 34" />
        </g>
      );
    case "star":
      return (
        <g {...props}>
          <path d="M180 116l24 74h78l-63 46 24 74-63-46-63 46 24-74-63-46h78z" />
        </g>
      );
    case "veil":
      return (
        <g {...props}>
          <path d="M180 126c36 0 68 30 68 68s-32 68-68 68-68-30-68-68 32-68 68-68z" />
          <path d="M124 268c22 20 44 30 56 30s34-10 56-30" />
        </g>
      );
    case "sun":
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
    case "eye":
      return (
        <g {...props}>
          <path d="M96 220c28-44 64-66 84-66s56 22 84 66c-28 44-64 66-84 66s-56-22-84-66z" />
          <circle cx="180" cy="220" r="24" />
        </g>
      );
    case "wreath":
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

function MinorMotif({ suit, rank, color }) {
  const props = {
    fill: "none",
    stroke: color,
    strokeWidth: "7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icon = suitGlyphs[suit] || "coin";

  switch (rank || "ace") {
    case "ace":
      return (
        <g {...props}>
          <circle cx="180" cy="220" r="46" />
          <path d="M180 176v88" />
          <path d="M136 220h88" />
        </g>
      );
    case "two":
      return (
        <g {...props}>
          <path d="M126 170c24-18 84-18 108 0" />
          <path d="M126 270c24 18 84 18 108 0" />
          <path d="M152 178l56 84" />
          <path d="M208 178l-56 84" />
        </g>
      );
    case "three":
      return (
        <g {...props}>
          <path d="M120 268c20-52 48-82 60-82s40 30 60 82" />
          <path d="M180 140v160" />
        </g>
      );
    case "four":
      return (
        <g {...props}>
          <rect x="126" y="168" width="108" height="104" rx="18" />
          <path d="M180 132v248" />
        </g>
      );
    case "five":
      return (
        <g {...props}>
          <path d="M118 188h124" />
          <path d="M118 252h124" />
          <path d="M180 146v164" />
        </g>
      );
    case "six":
      return (
        <g {...props}>
          <path d="M142 154l76 132" />
          <path d="M218 154l-76 132" />
          <circle cx="180" cy="220" r="28" />
        </g>
      );
    case "seven":
      return (
        <g {...props}>
          <path d="M136 284c28-62 60-92 64-92s36 30 64 92" />
          <path d="M180 136v168" />
        </g>
      );
    case "eight":
      return (
        <g {...props}>
          <path d="M136 168h88" />
          <path d="M136 220h88" />
          <path d="M136 272h88" />
        </g>
      );
    case "nine":
      return (
        <g {...props}>
          <path d="M126 176h108" />
          <path d="M126 220h108" />
          <path d="M126 264h108" />
          <path d="M180 136v168" />
        </g>
      );
    case "ten":
      return (
        <g {...props}>
          <circle cx="180" cy="220" r="76" />
          <path d="M180 144v152" />
        </g>
      );
    case "page":
      return (
        <g {...props}>
          <path d="M144 304V164h72v140" />
          <path d="M156 180h48" />
          <path d="M150 224h60" />
        </g>
      );
    case "knight":
      return (
        <g {...props}>
          <path d="M128 280c20-62 52-92 68-92s48 30 68 92" />
          <path d="M158 160l44 20" />
          <path d="M202 160l-44 20" />
        </g>
      );
    case "queen":
      return (
        <g {...props}>
          <circle cx="180" cy="182" r="32" />
          <path d="M136 282c12-46 28-70 44-70s32 24 44 70" />
          <path d="M156 144h48" />
        </g>
      );
    case "king":
      return (
        <g {...props}>
          <path d="M140 304V170l40-24 40 24v134" />
          <path d="M150 176h60" />
          <path d="M180 124v34" />
        </g>
      );
    default:
      if (icon === "cup") {
        return (
          <g {...props}>
            <path d="M120 236c0-32 24-56 60-56s60 24 60 56v18c0 30-20 50-60 50s-60-20-60-50z" />
            <path d="M140 232h80" />
            <path d="M152 304h56" />
          </g>
        );
      }

      if (icon === "blade") {
        return (
          <g {...props}>
            <path d="M180 92l28 68-28 24-28-24 28-68z" />
            <path d="M180 184v176" />
            <path d="M150 304h60" />
          </g>
        );
      }

      if (icon === "coin") {
        return (
          <g {...props}>
            <circle cx="180" cy="228" r="74" />
            <path d="M180 170l17 43 47 4-36 29 11 46-39-25-39 25 11-46-36-29 47-4z" />
          </g>
        );
      }

      return (
        <g {...props}>
          <path d="M180 84v184" />
          <path d="M148 126h64" />
          <path d="M138 182c0 26 14 44 42 44s42-18 42-44" />
          <path d="M166 262l14-58 14 58" />
        </g>
      );
  }
}

function CardHalo({ accent }) {
  return (
    <g opacity="0.9">
      <circle cx="180" cy="220" r="128" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" />
      <circle cx="180" cy="220" r="102" fill="rgba(255,255,255,0.04)" stroke={accent} strokeWidth="1.2" opacity="0.28" />
      <circle cx="180" cy="220" r="72" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    </g>
  );
}

function KeywordSignal({ kind, accent, secondary }) {
  if (kind === "coins") {
    return (
      <g opacity="0.9">
        <circle cx="180" cy="220" r="28" fill={secondary} opacity="0.76" stroke={accent} strokeWidth="2.2" />
        <path d="M180 198v44" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" />
        <path d="M158 220h44" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      </g>
    );
  }

  if (kind === "moon") {
    return (
      <g opacity="0.88">
        <path d="M192 184c-14 5-24 18-24 34 0 20 16 36 36 36 7 0 14-2 19-5-9 18-27 30-48 30-28 0-52-24-52-52s24-52 52-52c8 0 15 2 22 6-1 4-1 8-2 11z" fill={secondary} opacity="0.76" />
        <circle cx="242" cy="192" r="7" fill={accent} />
      </g>
    );
  }

  if (kind === "split") {
    return (
      <g opacity="0.86" fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round">
        <path d="M180 158v124" />
        <path d="M150 220h60" />
        <path d="M128 190c24-18 80-18 104 0" />
        <path d="M128 250c24 18 80 18 104 0" />
      </g>
    );
  }

  if (kind === "petals") {
    return (
      <g opacity="0.88" fill={secondary} stroke={accent} strokeWidth="2">
        <circle cx="180" cy="220" r="18" />
        {Array.from({ length: 6 }).map((_, index) => {
          const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
          const x = 180 + Math.cos(angle) * 48;
          const y = 220 + Math.sin(angle) * 48;
          return <path key={`leaf-${index}`} d={`M${x} ${y}c8-10 18-10 26 0-8 10-18 10-26 0z`} />;
        })}
      </g>
    );
  }

  if (kind === "shards") {
    return (
      <g opacity="0.88" fill={secondary} stroke={accent} strokeWidth="2">
        <path d="M180 136l26 56-26 28-26-28z" />
        <path d="M180 304l26-56-26-28-26 28z" />
      </g>
    );
  }

  if (kind === "arrows") {
    return (
      <g opacity="0.88" fill="none" stroke={accent} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M180 124v72" />
        <path d="M180 268v72" />
        <path d="M158 158l22-18 22 18" />
        <path d="M158 302l22 18 22-18" />
      </g>
    );
  }

  if (kind === "stars" || kind === "sun" || kind === "rays") {
    return (
      <g opacity="0.95" fill="none" stroke={accent} strokeWidth="2.8" strokeLinecap="round">
        <circle cx="180" cy="220" r="46" />
        <path d="M180 148v38" />
        <path d="M180 254v38" />
        <path d="M108 220h38" />
        <path d="M214 220h38" />
      </g>
    );
  }

  return null;
}

export default function TarotCardArt({ card }) {
  const isMajor = card.number < 22;
  const palette = palettes[card.palette] || palettes.sun;
  const suit = isMajor ? null : card.id.split("-")[0];
  const rank = isMajor ? null : card.id.split("-")[1];
  const value = isMajor ? card.number : card.roman;
  const keyword = card.keyword || card.subtitle || card.name;
  const keywordProfile = getKeywordProfile(keyword, isMajor, isMajor ? card.theme : suit);
  const accent = keywordProfile.accent;
  const secondary = keywordProfile.secondary;
  const ringCount = isMajor ? 14 : Math.min(rankValue(rank), 10);

  return (
    <svg className="tarot-card-art" viewBox="0 0 360 560" role="img" aria-label={card.name}>
      <defs>
        <linearGradient id={`bg-${card.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette[0]} />
          <stop offset="58%" stopColor={palette[1]} />
          <stop offset="100%" stopColor={palette[2]} />
        </linearGradient>
        <radialGradient id={`glow-${card.id}`} cx="50%" cy="38%" r="68%">
          <stop offset="0%" stopColor="#fffef8" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#fffef8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`panel-${card.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fffdf8" />
          <stop offset="100%" stopColor="#efe0c7" />
        </linearGradient>
      </defs>

      <rect x="10" y="10" width="340" height="540" rx="30" fill={`url(#bg-${card.id})`} />
      <rect x="18" y="18" width="324" height="524" rx="26" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
      <rect x="34" y="34" width="292" height="492" rx="22" fill={`url(#panel-${card.id})`} stroke="rgba(63,38,18,0.12)" />

      <rect x="44" y="44" width="272" height="472" rx="18" fill="url(#glow-${card.id})" />
      <PatternBackdrop kind={keywordProfile.pattern} accent={accent} secondary={secondary} />
      <FrameRings accent={accent} />
      <CardHalo accent={accent} />
      <TitlePlate value={value} accent={accent} />
      <FooterPlate name={card.name} keyword={keyword} accent={accent} />

      <Corner x={50} y={58} rotate={0} color="rgba(63,38,18,0.3)" />
      <Corner x={310} y={58} rotate={90} color="rgba(63,38,18,0.3)" />
      <Corner x={50} y={502} rotate={-90} color="rgba(63,38,18,0.3)" />
      <Corner x={310} y={502} rotate={180} color="rgba(63,38,18,0.3)" />

      <g opacity="0.95">
        {Array.from({ length: 8 }).map((_, index) => {
          const angle = (Math.PI * 2 * index) / 8 - Math.PI / 2;
          const radius = 150;
          const x = 180 + Math.cos(angle) * radius;
          const y = 220 + Math.sin(angle) * radius;
          return <Gem key={`${card.id}-gem-${index}`} x={x} y={y} color={index % 2 === 0 ? secondary : "rgba(255,255,255,0.75)"} />;
        })}
      </g>

      {isMajor ? <MajorMotif theme={card.theme} color={accent} /> : <MinorMotif suit={suit} rank={rank} color={accent} />}

      <KeywordSignal kind={keywordProfile.pattern} accent={accent} secondary={secondary} />

      <g opacity="0.8">
        {Array.from({ length: ringCount }).map((_, index) => {
          const angle = (Math.PI * 2 * index) / ringCount - Math.PI / 2;
          const radius = index % 2 === 0 ? 118 : 130;
          const cx = 180 + Math.cos(angle) * radius;
          const cy = 220 + Math.sin(angle) * radius;
          return <circle key={`${card.id}-dot-${index}`} cx={cx} cy={cy} r={index % 3 === 0 ? 4.2 : 3} fill={accent} />;
        })}
      </g>

      <g opacity="0.68">
        <path d="M100 116c14 10 30 16 48 16s34-6 48-16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
        <path d="M164 340c10 4 22 6 28 6s18-2 28-6" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
      </g>

      <text x="180" y="390" textAnchor="middle" fontSize="13" fill="rgba(61,34,16,0.7)" fontFamily="Georgia, serif">
        {isMajor ? "Major Arcana" : `${suit} / ${rank || "ace"}`}
      </text>
    </svg>
  );
}
