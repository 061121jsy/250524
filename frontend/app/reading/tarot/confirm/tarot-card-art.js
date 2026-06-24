"use client";

function getRankIndex(rank) {
  const order = {
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

  return order[rank] || 1;
}

const palettes = {
  sun: ["#fff3c6", "#e1a23a", "#612e12"],
  moon: ["#f8f0ea", "#b18ab0", "#2d2038"],
  earth: ["#f5ddb0", "#bb8454", "#3a2214"],
  ember: ["#ffd289", "#cb6734", "#431812"],
  rose: ["#fbced9", "#b9657b", "#3b1a25"],
  steel: ["#e0e7ef", "#718da0", "#1c2833"],
  amber: ["#ffe3ad", "#d08a33", "#3a2010"],
  lightning: ["#ffe96c", "#e18a36", "#331a0f"],
};

const majorMotifs = {
  beginning: "starburst",
  manifestation: "wand",
  intuition: "moon",
  nurture: "rose",
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

function OrnateCorner({ x, y, rotate, color }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 0h24" />
      <path d="M0 0v24" />
      <path d="M5 5l19 19" opacity="0.75" />
      <path d="M10 2l0 8" opacity="0.35" />
      <path d="M2 10l8 0" opacity="0.35" />
    </g>
  );
}

function StarDust({ color }) {
  return (
    <g fill={color} opacity="0.58">
      <circle cx="78" cy="118" r="2.5" />
      <circle cx="288" cy="96" r="2.5" />
      <circle cx="306" cy="146" r="2" />
      <circle cx="54" cy="166" r="2" />
      <circle cx="78" cy="430" r="2" />
      <circle cx="296" cy="430" r="2" />
      <circle cx="64" cy="350" r="1.8" />
      <circle cx="298" cy="338" r="1.8" />
      <path d="M88 102l5 10 10 5-10 5-5 10-5-10-10-5 10-5z" />
      <path d="M290 128l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" />
    </g>
  );
}

function RibbonOrnament({ color }) {
  return (
    <g fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
      <path d="M106 132c12-8 24-12 34-12s22 4 34 12" />
      <path d="M186 132c12-8 24-12 34-12s22 4 34 12" />
      <path d="M106 336c12 8 24 12 34 12s22-4 34-12" />
      <path d="M186 336c12 8 24 12 34 12s22-4 34-12" />
      <path d="M150 132l30 18 30-18" opacity="0.55" />
      <path d="M150 336l30-18 30 18" opacity="0.55" />
    </g>
  );
}

function Jewel({ x, y, fill, stroke }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="0" rx="16" ry="24" fill={fill} stroke={stroke} strokeWidth="2.5" />
      <path d="M0 -18l8 10-8 14-8-14z" fill="rgba(255,255,255,0.82)" opacity="0.9" />
    </g>
  );
}

function SuitEmblem({ suit, color }) {
  const props = {
    fill: "none",
    stroke: color,
    strokeWidth: "8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (suit === "cups") {
    return (
      <g {...props}>
        <path d="M114 232c0-34 26-60 66-60s66 26 66 60v20c0 34-24 58-66 58s-66-24-66-58z" />
        <path d="M136 228h88" />
        <path d="M150 314h60" />
        <path d="M164 154c6-10 12-18 16-18s10 8 16 18" opacity="0.9" />
      </g>
    );
  }

  if (suit === "swords") {
    return (
      <g {...props}>
        <path d="M180 92l30 70-30 26-30-26 30-70z" />
        <path d="M180 188v170" />
        <path d="M150 306h60" />
        <path d="M164 330h32" />
        <path d="M150 166h60" opacity="0.65" />
      </g>
    );
  }

  if (suit === "pentacles") {
    return (
      <g {...props}>
        <circle cx="180" cy="228" r="76" />
        <path d="M180 170l17 43 47 4-36 29 11 46-39-25-39 25 11-46-36-29 47-4z" />
        <path d="M180 136v20" opacity="0.7" />
      </g>
    );
  }

  return (
    <g {...props}>
      <path d="M180 84v184" />
      <path d="M148 126h64" />
      <path d="M138 182c0 26 14 44 42 44s42-18 42-44" />
      <path d="M166 262l14-58 14 58" />
      <path d="M166 150c4-8 8-12 14-12s10 4 14 12" opacity="0.75" />
    </g>
  );
}

function MajorScene({ theme, color }) {
  const props = {
    fill: "none",
    stroke: color,
    strokeWidth: "8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (majorMotifs[theme] || "star") {
    case "starburst":
      return (
        <g {...props}>
          <circle cx="180" cy="220" r="56" />
          <path d="M180 116v34" />
          <path d="M180 290v34" />
          <path d="M76 220h34" />
          <path d="M250 220h34" />
          <path d="M110 150l24 24" />
          <path d="M226 266l24 24" />
          <path d="M250 150l-24 24" />
          <path d="M134 266l-24 24" />
          <path d="M180 144l16 34 36 10-24 26 4 36-32-16-32 16 4-36-24-26 36-10z" opacity="0.72" />
        </g>
      );
    case "wand":
      return (
        <g {...props}>
          <path d="M136 324L220 160" />
          <path d="M132 324l18-8" />
          <path d="M132 324l12 18" />
          <path d="M208 150l14 14" />
          <path d="M220 136l0 22" />
          <path d="M236 150l-14 14" />
          <path d="M168 176l24-24" opacity="0.5" />
        </g>
      );
    case "moon":
      return (
        <g {...props}>
          <path d="M214 128c-24 8-40 29-40 54 0 32 26 58 58 58 11 0 21-3 30-8-15 31-48 52-86 52-52 0-94-42-94-94s42-94 94-94c15 0 29 4 42 12-2 7-2 14-4 20z" />
          <path d="M130 146l-18-18" opacity="0.7" />
          <path d="M250 154l18-18" opacity="0.7" />
        </g>
      );
    case "rose":
      return (
        <g {...props}>
          <circle cx="180" cy="220" r="18" />
          <path d="M180 158c18 0 34 16 34 34 0 12-6 22-16 28" />
          <path d="M180 282c-18 0-34-16-34-34 0-12 6-22 16-28" />
          <path d="M126 220c0-18 16-34 34-34" />
          <path d="M234 220c0 18-16 34-34 34" />
          <path d="M180 128v44" />
          <path d="M180 268v44" />
          <path d="M148 192c8-16 20-28 32-28s24 12 32 28" opacity="0.55" />
        </g>
      );
    case "pillar":
      return (
        <g {...props}>
          <path d="M124 124h112" />
          <path d="M144 124v180" />
          <path d="M216 124v180" />
          <path d="M132 304h96" />
          <path d="M160 180h40" />
          <path d="M160 224h40" />
          <path d="M132 152c16 14 28 20 48 20s32-6 48-20" opacity="0.5" />
        </g>
      );
    case "arch":
      return (
        <g {...props}>
          <path d="M118 292V168c0-34 28-62 62-62s62 28 62 62v124" />
          <path d="M136 292h88" />
          <path d="M152 180h56" />
          <path d="M152 220h56" />
          <path d="M146 144h68" opacity="0.55" />
        </g>
      );
    case "split":
      return (
        <g {...props}>
          <circle cx="142" cy="176" r="34" />
          <circle cx="218" cy="176" r="34" />
          <path d="M180 210v84" />
          <path d="M136 302h88" />
          <path d="M156 222c10 10 20 14 24 14s14-4 24-14" opacity="0.55" />
        </g>
      );
    case "arrow":
      return (
        <g {...props}>
          <path d="M116 256h128" />
          <path d="M194 192l50 64-50 64" />
          <path d="M154 182l26-26" opacity="0.55" />
        </g>
      );
    case "shield":
      return (
        <g {...props}>
          <path d="M180 120l72 26v74c0 54-31 90-72 110-41-20-72-56-72-110v-74z" />
          <path d="M146 214h68" />
          <path d="M180 176v76" />
          <path d="M156 164c6-12 14-18 24-18s18 6 24 18" opacity="0.5" />
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
          <path d="M160 172h40" opacity="0.55" />
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
          <path d="M180 124v24" opacity="0.55" />
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
          <path d="M156 136c8 8 16 12 24 12s16-4 24-12" opacity="0.5" />
        </g>
      );
    case "hourglass":
      return (
        <g {...props}>
          <path d="M132 112h96" />
          <path d="M132 328h96" />
          <path d="M148 112c0 52 32 76 32 108s-32 56-32 108" />
          <path d="M212 112c0 52-32 76-32 108s32 56 32 108" />
          <path d="M150 144h60" opacity="0.55" />
        </g>
      );
    case "leaf":
      return (
        <g {...props}>
          <path d="M118 278c42-92 126-126 134-126-4 80-50 148-134 126z" />
          <path d="M154 260c22-20 46-42 80-74" />
          <path d="M172 176c8 8 16 12 24 12s16-4 24-12" opacity="0.5" />
        </g>
      );
    case "bridge":
      return (
        <g {...props}>
          <path d="M108 286c18-46 50-72 72-72s54 26 72 72" />
          <path d="M126 286h108" />
          <path d="M180 214v72" />
          <path d="M132 250c20 0 32-10 48-10s28 10 48 10" opacity="0.5" />
        </g>
      );
    case "chain":
      return (
        <g {...props}>
          <path d="M144 160h72c20 0 36 16 36 36s-16 36-36 36h-72c-20 0-36-16-36-36s16-36 36-36z" />
          <path d="M132 268h96c20 0 36 16 36 36s-16 36-36 36h-96" />
          <path d="M154 220h52" opacity="0.5" />
        </g>
      );
    case "tower":
      return (
        <g {...props}>
          <path d="M144 302l12-160h48l12 160z" />
          <path d="M120 302h120" />
          <path d="M162 170h36" />
          <path d="M180 124l-20 34" />
          <path d="M156 190h48" opacity="0.5" />
        </g>
      );
    case "star":
      return (
        <g {...props}>
          <path d="M180 116l24 74h78l-63 46 24 74-63-46-63 46 24-74-63-46h78z" />
          <path d="M180 146l8 20 22 6-18 16 2 22-14-10-14 10 2-22-18-16 22-6z" opacity="0.55" />
        </g>
      );
    case "veil":
      return (
        <g {...props}>
          <path d="M180 126c36 0 68 30 68 68s-32 68-68 68-68-30-68-68 32-68 68-68z" />
          <path d="M124 268c22 20 44 30 56 30s34-10 56-30" />
          <path d="M146 194c8-10 20-16 34-16s26 6 34 16" opacity="0.55" />
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
          <path d="M152 182c8-10 18-16 28-16s20 6 28 16" opacity="0.55" />
        </g>
      );
    case "eye":
      return (
        <g {...props}>
          <path d="M96 220c28-44 64-66 84-66s56 22 84 66c-28 44-64 66-84 66s-56-22-84-66z" />
          <circle cx="180" cy="220" r="24" />
          <path d="M180 166c10 0 18 8 18 18" opacity="0.55" />
        </g>
      );
    case "wreath":
      return (
        <g {...props}>
          <circle cx="180" cy="220" r="72" />
          <path d="M128 170c16-14 32-22 52-22s36 8 52 22" />
          <path d="M128 270c16 14 32 22 52 22s36-8 52-22" />
          <path d="M138 196l-12-12" opacity="0.5" />
          <path d="M222 196l12-12" opacity="0.5" />
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

function MinorScene({ rank, color }) {
  const props = {
    fill: "none",
    stroke: color,
    strokeWidth: "8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (rank || "ace") {
    case "ace":
      return (
        <g {...props}>
          <circle cx="180" cy="220" r="50" />
          <path d="M180 176v88" />
          <path d="M136 220h88" />
          <path d="M156 194c8-8 16-12 24-12s16 4 24 12" opacity="0.55" />
        </g>
      );
    case "two":
      return (
        <g {...props}>
          <path d="M124 164c24-18 88-18 112 0" />
          <path d="M124 276c24 18 88 18 112 0" />
          <path d="M152 176l56 88" />
          <path d="M208 176l-56 88" />
        </g>
      );
    case "three":
      return (
        <g {...props}>
          <path d="M120 268c20-54 48-84 60-84s40 30 60 84" />
          <path d="M180 140v160" />
          <path d="M138 168c6 10 16 18 42 18s36-8 42-18" opacity="0.5" />
        </g>
      );
    case "four":
      return (
        <g {...props}>
          <rect x="126" y="168" width="108" height="104" rx="18" />
          <path d="M180 132v248" />
          <path d="M138 210h84" opacity="0.45" />
        </g>
      );
    case "five":
      return (
        <g {...props}>
          <path d="M118 188h124" />
          <path d="M118 252h124" />
          <path d="M180 146v164" />
          <path d="M140 166c10-10 24-16 40-16s30 6 40 16" opacity="0.45" />
        </g>
      );
    case "six":
      return (
        <g {...props}>
          <path d="M142 154l76 132" />
          <path d="M218 154l-76 132" />
          <circle cx="180" cy="220" r="28" />
          <path d="M156 224c8 8 16 12 24 12s16-4 24-12" opacity="0.5" />
        </g>
      );
    case "seven":
      return (
        <g {...props}>
          <path d="M136 284c28-62 60-92 64-92s36 30 64 92" />
          <path d="M180 136v168" />
          <path d="M152 170c8 10 18 16 28 16s20-6 28-16" opacity="0.45" />
        </g>
      );
    case "eight":
      return (
        <g {...props}>
          <path d="M136 168h88" />
          <path d="M136 220h88" />
          <path d="M136 272h88" />
          <path d="M180 136v168" opacity="0.55" />
        </g>
      );
    case "nine":
      return (
        <g {...props}>
          <path d="M126 176h108" />
          <path d="M126 220h108" />
          <path d="M126 264h108" />
          <path d="M180 136v168" />
          <path d="M140 152c10-8 24-12 40-12s30 4 40 12" opacity="0.45" />
        </g>
      );
    case "ten":
      return (
        <g {...props}>
          <circle cx="180" cy="220" r="76" />
          <path d="M180 144v152" />
          <path d="M146 180c10-10 22-16 34-16s24 6 34 16" opacity="0.45" />
        </g>
      );
    case "page":
      return (
        <g {...props}>
          <path d="M144 304V164h72v140" />
          <path d="M156 180h48" />
          <path d="M150 224h60" />
          <path d="M160 154h40" opacity="0.5" />
        </g>
      );
    case "knight":
      return (
        <g {...props}>
          <path d="M128 280c20-62 52-92 68-92s48 30 68 92" />
          <path d="M158 160l44 20" />
          <path d="M202 160l-44 20" />
          <path d="M146 188c8 8 18 12 34 12s26-4 34-12" opacity="0.45" />
        </g>
      );
    case "queen":
      return (
        <g {...props}>
          <circle cx="180" cy="182" r="32" />
          <path d="M136 282c12-46 28-70 44-70s32 24 44 70" />
          <path d="M156 144h48" />
          <path d="M148 196c10 8 20 12 32 12s22-4 32-12" opacity="0.45" />
        </g>
      );
    case "king":
      return (
        <g {...props}>
          <path d="M140 304V170l40-24 40 24v134" />
          <path d="M150 176h60" />
          <path d="M180 124v34" />
          <path d="M154 196h52" opacity="0.45" />
        </g>
      );
    default:
      return (
        <g {...props}>
          <path d="M180 92l30 70-30 26-30-26 30-70z" />
        </g>
      );
  }
}

function TitleBand({ x, y, width, height, color, text, fillColor, textColor, fontSize }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx="16" fill={fillColor} stroke={color} />
      <text x={x + width / 2} y={y + height / 2 + 8} textAnchor="middle" fontSize={fontSize} fill={textColor} fontFamily="Georgia, serif">
        {text}
      </text>
    </g>
  );
}

export default function TarotCardArt({ card }) {
  const isMajor = card.number < 22;
  const palette = palettes[card.palette] || palettes.sun;
  const suit = isMajor ? null : card.id.split("-")[0];
  const rank = isMajor ? null : card.id.split("-")[1];
  const rankIndex = rank ? getRankIndex(rank) : 0;
  const title = isMajor ? card.number : card.roman;
  const accent = "rgba(68, 39, 18, 0.94)";
  const keyword = card.keyword || card.subtitle || card.name;

  return (
    <svg className="tarot-card-art" viewBox="0 0 360 560" role="img" aria-label={card.name}>
      <defs>
        <linearGradient id={`frame-${card.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette[0]} />
          <stop offset="52%" stopColor={palette[1]} />
          <stop offset="100%" stopColor={palette[2]} />
        </linearGradient>
        <radialGradient id={`halo-${card.id}`} cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#fffdf9" stopOpacity="0.98" />
          <stop offset="100%" stopColor="#fffdf9" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`paper-${card.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fffaf2" />
          <stop offset="100%" stopColor="#f4e6d1" />
        </linearGradient>
        <linearGradient id={`ribbon-${card.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
          <stop offset="50%" stopColor="rgba(255,246,226,0.98)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.88)" />
        </linearGradient>
      </defs>

      <rect x="10" y="10" width="340" height="540" rx="30" fill={`url(#frame-${card.id})`} />
      <rect x="18" y="18" width="324" height="524" rx="26" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.18)" />
      <rect x="34" y="34" width="292" height="492" rx="20" fill={`url(#paper-${card.id})`} stroke="rgba(68,39,18,0.15)" />

      <g opacity="0.6">
        <path d="M54 92h252" stroke="rgba(255,255,255,0.48)" strokeWidth="2" />
        <path d="M54 468h252" stroke="rgba(255,255,255,0.48)" strokeWidth="2" />
        <path d="M74 64l18 18" stroke="rgba(255,255,255,0.36)" strokeWidth="2" />
        <path d="M286 64l-18 18" stroke="rgba(255,255,255,0.36)" strokeWidth="2" />
        <path d="M74 496l18-18" stroke="rgba(255,255,255,0.36)" strokeWidth="2" />
        <path d="M286 496l-18-18" stroke="rgba(255,255,255,0.36)" strokeWidth="2" />
      </g>

      <StarDust color="rgba(255,255,255,0.86)" />

      <circle cx="180" cy="220" r="124" fill={`url(#halo-${card.id})`} />
      <circle cx="180" cy="220" r="102" fill="rgba(255,255,255,0.14)" stroke="rgba(68,39,18,0.18)" strokeWidth="2" />
      <circle cx="180" cy="220" r="84" fill="rgba(255,255,255,0.08)" stroke="rgba(68,39,18,0.12)" strokeWidth="1.5" />
      <circle cx="180" cy="220" r="68" fill="rgba(255,255,255,0.04)" stroke="rgba(68,39,18,0.08)" strokeWidth="1" />
      <circle cx="180" cy="220" r="136" fill="none" stroke="rgba(255,226,145,0.48)" strokeWidth="1.5" />
      <circle cx="180" cy="220" r="146" fill="none" stroke="rgba(255,255,255,0.24)" strokeWidth="1" strokeDasharray="6 10" />

      <OrnateCorner x="52" y="58" rotate="0" color="rgba(68,39,18,0.34)" />
      <OrnateCorner x="308" y="58" rotate="90" color="rgba(68,39,18,0.34)" />
      <OrnateCorner x="52" y="502" rotate="-90" color="rgba(68,39,18,0.34)" />
      <OrnateCorner x="308" y="502" rotate="180" color="rgba(68,39,18,0.34)" />
      <RibbonOrnament color="rgba(68,39,18,0.22)" />
      <Jewel x="180" y="126" fill="rgba(255,214,122,0.92)" stroke="rgba(68,39,18,0.25)" />
      <Jewel x="180" y="434" fill="rgba(255,182,103,0.92)" stroke="rgba(68,39,18,0.25)" />

      <path d="M120 138c18-10 40-16 60-16s42 6 60 16" fill="none" stroke="rgba(68,39,18,0.24)" strokeWidth="4" strokeLinecap="round" />
      <path d="M120 302c18 10 40 16 60 16s42-6 60-16" fill="none" stroke="rgba(68,39,18,0.24)" strokeWidth="4" strokeLinecap="round" />
      <path d="M88 220h28" fill="none" stroke="rgba(255,255,255,0.48)" strokeWidth="3" strokeLinecap="round" />
      <path d="M244 220h28" fill="none" stroke="rgba(255,255,255,0.48)" strokeWidth="3" strokeLinecap="round" />
      <path d="M180 108v20" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round" />
      <path d="M180 432v20" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round" />

      {isMajor ? <MajorScene theme={card.theme} color={accent} /> : <SuitEmblem suit={suit} color={accent} />}

      {!isMajor ? (
        <g opacity="0.78" fill={accent}>
          {Array.from({ length: Math.min(rankIndex, 10) }).map((_, index) => {
            const positions = [
              [110, 126],
              [250, 126],
              [110, 306],
              [250, 306],
              [180, 100],
              [180, 332],
              [110, 216],
              [250, 216],
              [142, 170],
              [218, 170],
            ];
            const [cx, cy] = positions[index] || [180, 220];
            return <circle key={`${card.id}-pip-${index}`} cx={cx} cy={cy} r="6" />;
          })}
        </g>
      ) : null}

      <g>
        <TitleBand
          x="84"
          y="54"
          width="192"
          height="50"
          color="rgba(255,214,122,0.42)"
          text={title}
          fillColor="rgba(255,250,235,0.88)"
          textColor={accent}
          fontSize="24"
        />
      </g>

      <g>
        <rect x="54" y="444" width="252" height="80" rx="20" fill={`url(#ribbon-${card.id})`} stroke="rgba(255,214,122,0.42)" />
        <path d="M72 462h216" fill="none" stroke="rgba(68,39,18,0.14)" strokeWidth="1.5" />
        <path d="M72 490h216" fill="none" stroke="rgba(68,39,18,0.08)" strokeWidth="1.2" />
        <text x="180" y="484" textAnchor="middle" fontSize="24" fill={accent} fontFamily="Georgia, serif">
          {card.name}
        </text>
        <text x="180" y="508" textAnchor="middle" fontSize="14" fill="rgba(68,39,18,0.72)" fontFamily="Georgia, serif">
          {keyword}
        </text>
      </g>

      <g opacity="0.72">
        <path d="M92 114c14 10 30 16 48 16s34-6 48-16" fill="none" stroke="rgba(255,255,255,0.34)" strokeWidth="3" strokeLinecap="round" />
        <path d="M220 114c14 10 30 16 48 16s34-6 48-16" fill="none" stroke="rgba(255,255,255,0.34)" strokeWidth="3" strokeLinecap="round" />
        <path d="M92 340c14-10 30-16 48-16s34 6 48 16" fill="none" stroke="rgba(255,255,255,0.34)" strokeWidth="3" strokeLinecap="round" />
        <path d="M220 340c14-10 30-16 48-16s34 6 48 16" fill="none" stroke="rgba(255,255,255,0.34)" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
