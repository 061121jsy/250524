export const tarotModes = [
  {
    id: "today",
    label: "오늘 운세",
    title: "오늘의 운세",
    lead: "오늘의 기류와 감정 상태를 읽습니다.",
    prompt: "지금 가장 궁금한 흐름을 가볍게 적어보세요.",
    spread: ["현재", "조언", "결과"],
    focus: "기세, 감정, 선택",
  },
  {
    id: "relationship",
    label: "연애 운세",
    title: "연애 운세",
    lead: "관계의 온도와 감정의 방향을 읽습니다.",
    prompt: "관계에서 가장 알고 싶은 지점을 적어보세요.",
    spread: ["내 마음", "상대 마음", "관계의 방향"],
    focus: "만남, 거리감, 연결",
  },
  {
    id: "choice",
    label: "선택 운세",
    title: "선택 운세",
    lead: "갈림길에서의 기준과 방향을 정리합니다.",
    prompt: "결정해야 하는 선택지를 간단히 적어보세요.",
    spread: ["선택 A", "선택 B", "결정의 힌트"],
    focus: "비교, 판단, 우선순위",
  },
  {
    id: "mind",
    label: "마음 점검",
    title: "마음 점검",
    lead: "불안과 욕심을 분리해 읽습니다.",
    prompt: "지금 마음을 흔드는 상황을 적어보세요.",
    spread: ["겉마음", "속마음", "정리할 점"],
    focus: "감정, 진심, 정리",
  },
];

const majorArcana = [
  {
    id: "fool",
    roman: "0",
    name: "The Fool",
    ko: "광대",
    theme: "beginning",
    palette: "moon",
    keyword: "새 출발",
    upright: {
      headline: "새 출발",
      summary: "경험보다 용기가 먼저인 흐름입니다.",
      detail: "지금은 완벽함보다 첫걸음이 중요합니다. 낯선 길이라도 가볍게 시작하면 흐름이 열립니다.",
    },
    reversed: {
      headline: "준비 부족",
      summary: "성급한 출발은 다시 멈추게 됩니다.",
      detail: "기초를 점검하고 움직이면 손실을 줄일 수 있습니다.",
    },
  },
  {
    id: "magician",
    roman: "I",
    name: "The Magician",
    ko: "마법사",
    theme: "manifestation",
    palette: "sun",
    keyword: "실행력",
    upright: {
      headline: "실행력",
      summary: "이미 가진 자원을 꺼내 쓰는 시기입니다.",
      detail: "아이디어를 말로만 두지 말고 바로 행동으로 옮기면 결과가 붙습니다.",
    },
    reversed: {
      headline: "산만함",
      summary: "도구는 많지만 집중이 흐트러집니다.",
      detail: "하나의 목표에만 에너지를 모으는 편이 유리합니다.",
    },
  },
  {
    id: "high-priestess",
    roman: "II",
    name: "The High Priestess",
    ko: "여사제",
    theme: "intuition",
    palette: "moon",
    keyword: "직감",
    upright: {
      headline: "직감",
      summary: "겉보다 속을 먼저 봐야 하는 시기입니다.",
      detail: "말보다 분위기, 설명보다 느낌을 우선하면 맞는 답을 찾습니다.",
    },
    reversed: {
      headline: "침묵의 오해",
      summary: "말하지 않아서 놓치는 정보가 있습니다.",
      detail: "핵심을 확인하는 질문이 필요합니다.",
    },
  },
  {
    id: "empress",
    roman: "III",
    name: "The Empress",
    ko: "여제",
    theme: "nurture",
    palette: "earth",
    keyword: "풍요",
    upright: {
      headline: "풍요",
      summary: "돌봄과 성장의 기운이 강합니다.",
      detail: "사람과 환경을 부드럽게 키우는 선택이 좋은 결과를 만듭니다.",
    },
    reversed: {
      headline: "과보호",
      summary: "좋은 마음이 지나치면 부담이 됩니다.",
      detail: "상대의 속도를 존중해야 관계가 편해집니다.",
    },
  },
  {
    id: "emperor",
    roman: "IV",
    name: "The Emperor",
    ko: "황제",
    theme: "structure",
    palette: "earth",
    keyword: "질서",
    upright: {
      headline: "질서",
      summary: "원칙과 책임이 결과를 만듭니다.",
      detail: "기준을 분명히 세우고 밀고 가면 흔들리지 않습니다.",
    },
    reversed: {
      headline: "통제 과다",
      summary: "고집이 너무 강하면 충돌이 생깁니다.",
      detail: "유연한 조정이 필요합니다.",
    },
  },
  {
    id: "hierophant",
    roman: "V",
    name: "The Hierophant",
    ko: "교황",
    theme: "tradition",
    palette: "sun",
    keyword: "전통",
    upright: {
      headline: "전통",
      summary: "검증된 방식이 유리합니다.",
      detail: "새로운 길보다 이미 알려진 기준을 따르면 안정적입니다.",
    },
    reversed: {
      headline: "관습의 답답함",
      summary: "틀에 묶이면 숨이 막힙니다.",
      detail: "고정된 규칙을 조금 비틀어야 답이 보입니다.",
    },
  },
  {
    id: "lovers",
    roman: "VI",
    name: "The Lovers",
    ko: "연인",
    theme: "choice",
    palette: "rose",
    keyword: "선택",
    upright: {
      headline: "선택",
      summary: "마음이 끌리는 방향을 분명히 해야 합니다.",
      detail: "관계든 결정이든 둘 중 하나를 고르는 용기가 필요합니다.",
    },
    reversed: {
      headline: "갈등",
      summary: "서로 다른 마음이 부딪힙니다.",
      detail: "감정보다 합의가 먼저입니다.",
    },
  },
  {
    id: "chariot",
    roman: "VII",
    name: "The Chariot",
    ko: "전차",
    theme: "momentum",
    palette: "sun",
    keyword: "돌파",
    upright: {
      headline: "돌파",
      summary: "속도를 붙이면 흐름을 탈 수 있습니다.",
      detail: "목표를 향해 밀어붙일수록 성과가 따라옵니다.",
    },
    reversed: {
      headline: "과속",
      summary: "급하게 밀어붙이면 방향을 잃습니다.",
      detail: "속도를 줄이고 균형을 먼저 맞추세요.",
    },
  },
  {
    id: "strength",
    roman: "VIII",
    name: "Strength",
    ko: "힘",
    theme: "courage",
    palette: "amber",
    keyword: "내적 힘",
    upright: {
      headline: "내적 힘",
      summary: "부드러움으로도 충분히 이길 수 있습니다.",
      detail: "억누르기보다 다독이는 방식이 더 강합니다.",
    },
    reversed: {
      headline: "자기 의심",
      summary: "힘이 없어서가 아니라 자신감이 흔들립니다.",
      detail: "작은 성공부터 다시 쌓아야 합니다.",
    },
  },
  {
    id: "hermit",
    roman: "IX",
    name: "The Hermit",
    ko: "은둔자",
    theme: "reflection",
    palette: "moon",
    keyword: "성찰",
    upright: {
      headline: "성찰",
      summary: "한 발 물러서야 답이 보입니다.",
      detail: "혼자 정리하는 시간이 큰 도움이 됩니다.",
    },
    reversed: {
      headline: "고립",
      summary: "생각이 너무 안으로만 향합니다.",
      detail: "밖의 조언을 받아야 균형이 잡힙니다.",
    },
  },
  {
    id: "wheel-of-fortune",
    roman: "X",
    name: "Wheel of Fortune",
    ko: "운명의 수레바퀴",
    theme: "cycle",
    palette: "sun",
    keyword: "변화",
    upright: {
      headline: "변화",
      summary: "흐름이 바뀌는 타이밍입니다.",
      detail: "기회는 예고 없이 들어오니 준비된 쪽이 이깁니다.",
    },
    reversed: {
      headline: "정체",
      summary: "같은 자리를 반복할 수 있습니다.",
      detail: "패턴을 바꿔야 흐름이 살아납니다.",
    },
  },
  {
    id: "justice",
    roman: "XI",
    name: "Justice",
    ko: "정의",
    theme: "truth",
    palette: "steel",
    keyword: "균형",
    upright: {
      headline: "균형",
      summary: "사실과 기준이 결과를 가릅니다.",
      detail: "공정한 판단과 정확한 문서가 중요합니다.",
    },
    reversed: {
      headline: "불균형",
      summary: "한쪽으로 치우친 판단이 문제를 만듭니다.",
      detail: "감정과 사실을 구분해야 합니다.",
    },
  },
  {
    id: "hanged-man",
    roman: "XII",
    name: "The Hanged Man",
    ko: "매달린 사람",
    theme: "pause",
    palette: "moon",
    keyword: "멈춤",
    upright: {
      headline: "멈춤",
      summary: "지금은 움직임보다 관점 전환이 필요합니다.",
      detail: "잠깐 멈춰야 보이는 해답이 있습니다.",
    },
    reversed: {
      headline: "정체",
      summary: "멈춘 상태가 너무 길어집니다.",
      detail: "작은 행동부터 다시 시작해야 합니다.",
    },
  },
  {
    id: "death",
    roman: "XIII",
    name: "Death",
    ko: "죽음",
    theme: "ending",
    palette: "ember",
    keyword: "종결",
    upright: {
      headline: "종결",
      summary: "끝내야 새 흐름이 시작됩니다.",
      detail: "낡은 관계나 습관을 끊어내는 용기가 필요합니다.",
    },
    reversed: {
      headline: "미련",
      summary: "끝났어야 할 것을 붙잡고 있습니다.",
      detail: "놓아야 다음 장이 열립니다.",
    },
  },
  {
    id: "temperance",
    roman: "XIV",
    name: "Temperance",
    ko: "절제",
    theme: "balance",
    palette: "amber",
    keyword: "조화",
    upright: {
      headline: "조화",
      summary: "맞지 않던 것들이 섞여 균형을 찾습니다.",
      detail: "천천히 조율하면 의외로 잘 맞습니다.",
    },
    reversed: {
      headline: "과함",
      summary: "균형이 깨지면 결과도 흔들립니다.",
      detail: "속도와 양을 줄여야 합니다.",
    },
  },
  {
    id: "devil",
    roman: "XV",
    name: "The Devil",
    ko: "악마",
    theme: "attachment",
    palette: "ember",
    keyword: "집착",
    upright: {
      headline: "집착",
      summary: "끊고 싶어도 쉽게 못 놓는 흐름입니다.",
      detail: "무엇에 묶여 있는지 정확히 봐야 합니다.",
    },
    reversed: {
      headline: "해방",
      summary: "묶인 고리에서 빠져나올 기회입니다.",
      detail: "의존을 끊어내면 생각보다 가벼워집니다.",
    },
  },
  {
    id: "tower",
    roman: "XVI",
    name: "The Tower",
    ko: "탑",
    theme: "shock",
    palette: "lightning",
    keyword: "붕괴",
    upright: {
      headline: "붕괴",
      summary: "틀린 구조는 무너지고 새 기준이 생깁니다.",
      detail: "갑작스러운 변화가 있어도 본질은 더 분명해집니다.",
    },
    reversed: {
      headline: "지연된 충격",
      summary: "문제가 미뤄질수록 충격은 커집니다.",
      detail: "미리 정리해야 피해를 줄일 수 있습니다.",
    },
  },
  {
    id: "star",
    roman: "XVII",
    name: "The Star",
    ko: "별",
    theme: "hope",
    palette: "moon",
    keyword: "희망",
    upright: {
      headline: "희망",
      summary: "회복과 기대가 다시 살아납니다.",
      detail: "멀어 보이던 목표도 다시 손에 잡힙니다.",
    },
    reversed: {
      headline: "희미한 기대",
      summary: "희망은 있지만 현실감이 약합니다.",
      detail: "작은 성과부터 확인해야 합니다.",
    },
  },
  {
    id: "moon",
    roman: "XVIII",
    name: "The Moon",
    ko: "달",
    theme: "uncertainty",
    palette: "moon",
    keyword: "불안",
    upright: {
      headline: "불안",
      summary: "모호함이 많아 확신이 흔들립니다.",
      detail: "당장 믿기보다 사실 확인이 우선입니다.",
    },
    reversed: {
      headline: "오해 해소",
      summary: "흐릿했던 부분이 서서히 드러납니다.",
      detail: "숨은 정보가 정리되면 마음도 가벼워집니다.",
    },
  },
  {
    id: "sun",
    roman: "XIX",
    name: "The Sun",
    ko: "태양",
    theme: "success",
    palette: "sun",
    keyword: "성공",
    upright: {
      headline: "성공",
      summary: "밝고 분명한 성과가 드러납니다.",
      detail: "노력한 만큼 결과가 따라오는 좋은 흐름입니다.",
    },
    reversed: {
      headline: "과열",
      summary: "기세는 좋지만 무리하면 금방 지칩니다.",
      detail: "휴식이 있어야 빛이 오래갑니다.",
    },
  },
  {
    id: "judgement",
    roman: "XX",
    name: "Judgement",
    ko: "심판",
    theme: "awakening",
    palette: "steel",
    keyword: "각성",
    upright: {
      headline: "각성",
      summary: "상황을 다시 판단해야 할 때입니다.",
      detail: "과거의 선택을 돌아보고 새 결정을 내리면 됩니다.",
    },
    reversed: {
      headline: "미루는 판단",
      summary: "결정을 자꾸 늦추고 있습니다.",
      detail: "지금 정리해야 다음 단계로 넘어갑니다.",
    },
  },
  {
    id: "world",
    roman: "XXI",
    name: "The World",
    ko: "세계",
    theme: "completion",
    palette: "earth",
    keyword: "완성",
    upright: {
      headline: "완성",
      summary: "하나의 여정이 마무리됩니다.",
      detail: "정리와 성취가 함께 들어오는 카드입니다.",
    },
    reversed: {
      headline: "마무리 지연",
      summary: "끝맺음이 조금 늦어질 수 있습니다.",
      detail: "마지막 점검을 해야 완성이 됩니다.",
    },
  },
];

const suitMeta = {
  wands: {
    ko: "완드",
    palette: "ember",
    theme: "momentum",
    keyword: "열정",
    keywords: ["열정", "행동", "성장"],
    summary: "의지와 추진력이 중심이 되는 카드들입니다.",
  },
  cups: {
    ko: "컵",
    palette: "rose",
    theme: "nurture",
    keyword: "감정",
    keywords: ["감정", "관계", "공감"],
    summary: "감정과 관계의 온도를 읽는 카드들입니다.",
  },
  swords: {
    ko: "소드",
    palette: "steel",
    theme: "truth",
    keyword: "판단",
    keywords: ["판단", "갈등", "명료"],
    summary: "생각, 말, 결정의 긴장을 보여줍니다.",
  },
  pentacles: {
    ko: "펜타클",
    palette: "earth",
    theme: "structure",
    keyword: "현실",
    keywords: ["현실", "재정", "안정"],
    summary: "현실적인 조건과 성과를 다루는 카드들입니다.",
  },
};

const ranks = [
  ["ace", "A", "에이스", "시작"],
  ["two", "2", "2", "균형"],
  ["three", "3", "3", "확장"],
  ["four", "4", "4", "기초"],
  ["five", "5", "5", "충돌"],
  ["six", "6", "6", "회복"],
  ["seven", "7", "7", "탐색"],
  ["eight", "8", "8", "속도"],
  ["nine", "9", "9", "임박"],
  ["ten", "10", "10", "완결"],
  ["page", "P", "페이지", "학습"],
  ["knight", "Kn", "나이트", "추진"],
  ["queen", "Q", "퀸", "관리"],
  ["king", "K", "킹", "지배"],
];

const minorArcana = Object.entries(suitMeta).flatMap(([suit, meta]) =>
  ranks.map(([rank, symbol, rankLabel, rankKeyword]) => {
    const name = `${meta.ko} ${rankLabel}`;
    const headline = `${meta.keyword} ${rankKeyword}`;

    return {
      id: `${suit}-${rank}`,
      roman: symbol,
      name,
      subtitle: `${rankKeyword} of ${meta.ko}`,
      theme: meta.theme,
      palette: meta.palette,
      keyword: headline,
      keywords: [meta.keyword, rankKeyword, meta.ko],
      upright: {
        headline,
        summary: `${name}는 ${meta.summary} ${rankKeyword}의 흐름이 더해집니다.`,
        detail: `${name}는 ${rankKeyword}의 성질이 강하게 드러나며, ${meta.keyword}의 방향으로 읽으면 좋습니다.`,
      },
      reversed: {
        headline: `${rankKeyword} 과부하`,
        summary: `너무 빠르거나 너무 늦은 흐름이 겹칠 수 있습니다.`,
        detail: `${name}의 에너지가 비틀릴 때는 기본 주제를 다시 잡아야 합니다.`,
      },
    };
  })
);

const majorCards = majorArcana.map((card, index) => ({
  id: card.id,
  number: index,
  roman: card.roman,
  name: card.name,
  subtitle: card.keyword,
  symbol: card.roman,
  palette: card.palette,
  theme: card.theme,
  keyword: card.keyword,
  keywords: [card.keyword, card.ko, card.name],
  upright: card.upright,
  reversed: card.reversed,
}));

export const tarotCards = [...majorCards, ...minorArcana];

const themeTone = {
  beginning: "새 출발",
  manifestation: "실행",
  intuition: "직감",
  nurture: "풍요",
  structure: "질서",
  tradition: "전통",
  choice: "선택",
  momentum: "돌파",
  courage: "용기",
  reflection: "성찰",
  cycle: "변화",
  truth: "균형",
  pause: "멈춤",
  ending: "종결",
  balance: "조화",
  attachment: "집착",
  shock: "붕괴",
  hope: "희망",
  uncertainty: "불안",
  success: "성취",
  awakening: "각성",
  completion: "완성",
};

const modeTone = {
  today: "오늘의",
  relationship: "관계의",
  choice: "선택의",
  mind: "마음의",
};

export function getTarotCard(id) {
  return tarotCards.find((card) => card.id === id);
}

export function shuffleDeck(deck) {
  return [...deck]
    .map((card) => ({ card, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ card }) => card);
}

function getDominantTheme(cards) {
  const counts = cards.reduce((acc, card) => {
    acc[card.theme] = (acc[card.theme] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "balance";
}

export function buildTarotReading({ modeId, question, cards }) {
  const mode = tarotModes.find((item) => item.id === modeId) ?? tarotModes[0];
  const selected = cards.slice(0, 3).map((card, index) => ({
    ...card,
    position: mode.spread[index] ?? `카드 ${index + 1}`,
  }));
  const dominantTone = themeTone[getDominantTheme(selected)] ?? "흐름";
  const [coreCard = tarotCards[0], supportCard = tarotCards[1], closingCard = tarotCards[2]] = selected;

  return {
    mode: mode.id,
    modeLabel: mode.title,
    focus: mode.focus,
    question,
    tone: dominantTone,
    headline: `${modeTone[mode.id]} ${dominantTone}`,
    summary: `${mode.title}에서는 ${coreCard.upright.headline}이 먼저 보이고, ${supportCard.upright.headline}가 중간 흐름을 이끕니다.`,
    advice: `${closingCard.name}을 마지막 기준으로 삼아 오늘의 행동 하나를 정리하세요.`,
    cards: selected.map((card, index) => ({
      ...card,
      key: card.id,
      slot: mode.spread[index] ?? `카드 ${index + 1}`,
      interpretation: card.upright.summary,
      detail: card.upright.detail,
      headline: card.upright.headline,
      keywords: card.keywords,
    })),
    synthesis: {
      opening: coreCard.upright.summary,
      middle: supportCard.upright.summary,
      closing: closingCard.upright.summary,
    },
    caution: closingCard.reversed.summary,
    path: `${coreCard.name} · ${supportCard.name} · ${closingCard.name}`,
  };
}

export function buildFallbackReading() {
  return buildTarotReading({
    modeId: "today",
    question: "질문 없음",
    cards: tarotCards.slice(0, 3),
  });
}
