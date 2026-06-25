const http = require("node:http");
const https = require("node:https");
const fs = require("node:fs/promises");
const path = require("node:path");

loadEnv(path.join(__dirname, ".env"));

const port = process.env.PORT || 4001;
const dataDir = path.join(__dirname, "data");
const openaiModel = process.env.OPENAI_MODEL || "gpt-5.4-mini";
const supabaseUrl = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || "";
const useSupabase = Boolean(supabaseUrl && supabaseServiceKey);

const dbPaths = {
  tarot: path.join(dataDir, "tarot-readings.json"),
  saju: path.join(dataDir, "saju-readings.json"),
  fortune: path.join(dataDir, "fortune-readings.json"),
};

const fortuneSectionLabels = ["총운", "애정운", "금전운", "직장운", "학업", "성적"];
const chineseZodiacAnimals = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
const westernZodiacRanges = [
  { label: "양자리", start: [3, 21], end: [4, 19] },
  { label: "황소자리", start: [4, 20], end: [5, 20] },
  { label: "쌍둥이자리", start: [5, 21], end: [6, 21] },
  { label: "게자리", start: [6, 22], end: [7, 22] },
  { label: "사자자리", start: [7, 23], end: [8, 22] },
  { label: "처녀자리", start: [8, 23], end: [9, 22] },
  { label: "천칭자리", start: [9, 23], end: [10, 22] },
  { label: "전갈자리", start: [10, 23], end: [11, 22] },
  { label: "사수자리", start: [11, 23], end: [12, 24] },
  { label: "염소자리", start: [12, 25], end: [1, 19] },
  { label: "물병자리", start: [1, 20], end: [2, 18] },
  { label: "물고기자리", start: [2, 19], end: [3, 20] },
];

function loadEnv(filePath) {
  try {
    const raw = require("node:fs").readFileSync(filePath, "utf8");
    raw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const index = trimmed.indexOf("=");
      if (index === -1) return;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function getUser(req) {
  const userId = req.headers["x-user-id"];
  return {
    id: typeof userId === "string" && userId.trim() ? userId.trim() : null,
    isPaid: req.headers["x-user-paid"] === "true",
  };
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function readDb(kind, userId) {
  if (useSupabase) {
    const url = new URL(`${supabaseUrl}/rest/v1/readings`);
    url.searchParams.set("select", "*");
    url.searchParams.set("kind", `eq.${kind}`);
    url.searchParams.set("saved", "eq.true");
    if (userId) {
      url.searchParams.set("user_id", `eq.${userId}`);
    }
    url.searchParams.set("order", "created_at.desc");

    const response = await fetch(url, {
      headers: {
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
    });
    const raw = await response.text();
    let parsed = [];
    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch {
        throw new Error("Supabase response was not valid JSON");
      }
    }

    if (!response.ok) {
      throw new Error(parsed?.message || parsed?.error || "Failed to load readings from Supabase");
    }

    return parsed.map((row) => ({
      id: row.id,
      type: row.kind,
      userId: row.user_id,
      saved: row.saved,
      createdAt: row.created_at,
      request: row.request,
      response: row.response,
      provider: row.provider,
      model: row.model,
      usage: row.usage,
      error: row.error,
    }));
  }

  const dbPath = dbPaths[kind];
  try {
    return JSON.parse(await fs.readFile(dbPath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function saveReading(kind, record) {
  if (useSupabase) {
    const payload = {
      id: record.id,
      kind,
      user_id: record.userId,
      saved: record.saved,
      created_at: record.createdAt,
      request: record.request,
      response: record.response,
      provider: record.provider,
      model: record.model,
      usage: record.usage,
      error: record.error,
    };

    const response = await fetch(`${supabaseUrl}/rest/v1/readings`, {
      method: "POST",
      headers: {
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const raw = await response.text();
      throw new Error(raw || "Failed to save reading to Supabase");
    }
    return;
  }

  const dbPath = dbPaths[kind];
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  const rows = await readDb(kind);
  rows.unshift(record);
  await fs.writeFile(dbPath, JSON.stringify(rows, null, 2), "utf8");
}

async function callOpenAi({ schemaName, schema, systemPrompt, userPayload }) {
  const body = JSON.stringify({
    model: openaiModel,
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: JSON.stringify(userPayload) },
    ],
    text: {
      format: {
        type: "json_schema",
        name: schemaName,
        strict: true,
        schema,
      },
    },
  });

  const data = await new Promise((resolve, reject) => {
    const req = https.request(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        timeout: 25000,
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf8");
          let parsed;
          try {
            parsed = raw ? JSON.parse(raw) : {};
          } catch {
            reject(new Error("OpenAI response was not valid JSON"));
            return;
          }

          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(parsed.error?.message || "OpenAI request failed"));
            return;
          }

          resolve(parsed);
        });
      }
    );

    req.on("timeout", () => {
      req.destroy(new Error("OpenAI request timed out"));
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });

  return {
    result: JSON.parse(data.output_text),
    usage: data.usage || null,
  };
}

const tarotSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headline: { type: "string" },
    summary: { type: "string" },
    cardReadings: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          position: { type: "string" },
          cardName: { type: "string" },
          interpretation: { type: "string" },
          action: { type: "string" },
        },
        required: ["position", "cardName", "interpretation", "action"],
      },
    },
    advice: { type: "string" },
    caution: { type: "string" },
  },
  required: ["headline", "summary", "cardReadings", "advice", "caution"],
};

const sajuSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headline: { type: "string" },
    summary: { type: "string" },
    pillars: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          value: { type: "string" },
        },
        required: ["label", "value"],
      },
    },
    sections: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          title: { type: "string" },
          value: { type: "string" },
        },
        required: ["label", "title", "value"],
      },
    },
    timing: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          value: { type: "string" },
        },
        required: ["label", "value"],
      },
    },
    strengths: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { type: "string" },
    },
    cautions: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { type: "string" },
    },
    advice: { type: "string" },
    caution: { type: "string" },
  },
  required: ["headline", "summary", "pillars", "sections", "timing", "strengths", "cautions", "advice", "caution"],
};

const fortuneSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headline: { type: "string" },
    summary: { type: "string" },
    sections: {
      type: "array",
      minItems: 6,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          value: { type: "string" },
        },
        required: ["label", "value"],
      },
    },
    lucky: {
      type: "object",
      additionalProperties: false,
      properties: {
        color: { type: "string" },
        number: { type: "string" },
        direction: { type: "string" },
        item: { type: "string" },
      },
      required: ["color", "number", "direction", "item"],
    },
    fortuneCookie: { type: "string" },
    advice: { type: "string" },
    caution: { type: "string" },
  },
  required: ["headline", "summary", "sections", "lucky", "fortuneCookie", "advice", "caution"],
};

function fallbackTarot({ mode, cards }) {
  return {
    headline: `${mode.title} 흐름`,
    summary: `${cards.map((card) => card.name).join(" · ")} 조합은 감정, 선택, 실행을 함께 점검해야 하는 흐름입니다.`,
    cardReadings: cards.map((card, index) => ({
      position: mode.spread[index],
      cardName: card.name,
      interpretation: card.upright?.summary || `${card.name}의 에너지가 분명하게 드러나는 카드입니다.`,
      action: "오늘은 판단을 미루지 말고 한 가지 행동으로 옮기세요.",
    })),
    advice: "결론만 보지 말고 중간 과정도 함께 확인하세요.",
    caution: "급하게 단정하면 해석이 좁아집니다.",
  };
}

function fallbackSaju({ profile, question }) {
  return {
    headline: `${profile.name || "사용자"}의 사주 핵심 리딩`,
    summary: `${profile.birthDate} ${profile.birthTime} 기준으로 보면 지금의 흐름은 단순한 길흉보다 성향, 관계, 일의 방식이 함께 움직이는 구조입니다.`,
    pillars: [
      { label: "기질", value: "겉은 차분해도 속은 기준이 분명하고, 한번 정한 방향을 쉽게 바꾸지 않는 편입니다." },
      { label: "재능", value: "정보를 읽고 상황을 정리하는 힘이 좋습니다. 감정보다 맥락을 먼저 보는 감각이 있습니다." },
      { label: "관계", value: "가까운 사람에게는 의리가 강하지만, 선을 넘는 간섭에는 쉽게 지치는 타입입니다." },
      { label: "흐름", value: "지금은 빠른 승부보다 구조를 다지는 시기이며, 정리된 선택이 이후 운을 키웁니다." },
    ],
    sections: [
      {
        label: "전체 흐름",
        title: "운의 큰 방향",
        value: "당장의 요동은 있어도 중심축은 무너지지 않습니다. 중요한 건 흔들림을 줄이는 생활 리듬과 선택의 일관성입니다.",
      },
      {
        label: "직업 운",
        title: "일과 역할",
        value: "일은 사람을 많이 상대하는 구조보다 기준과 책임이 분명한 역할에서 힘이 납니다. 자율성과 통제의 균형이 핵심입니다.",
      },
      {
        label: "재물 운",
        title: "돈의 흐름",
        value: "큰 한방보다 새는 돈을 막는 쪽이 우선입니다. 고정 지출과 충동 소비를 줄이면 체감이 빠르게 좋아집니다.",
      },
      {
        label: "관계 운",
        title: "사람과의 연결",
        value: "관계는 넓히는 것보다 깊이를 조절하는 것이 중요합니다. 필요한 말은 짧고 분명하게 하는 편이 좋습니다.",
      },
    ],
    timing: [
      { label: "초반", value: "정리와 준비가 우선입니다. 서두르면 결과가 흐려질 수 있습니다." },
      { label: "중반", value: "사람과 일의 접점이 늘어나며, 선택의 결과가 구체적으로 드러납니다." },
      { label: "후반", value: "결과가 안정되며 지금까지의 선택이 보상으로 돌아올 가능성이 큽니다." },
    ],
    strengths: [
      "판단이 빠르고 기준이 분명합니다.",
      "실무와 정리 능력이 강합니다.",
      "상황을 통째로 보는 눈이 있습니다.",
    ],
    cautions: [
      "감정을 참고 넘기면 뒤늦게 피로가 쌓일 수 있습니다.",
      "완벽을 기다리다 기회를 놓치기 쉽습니다.",
      "사람 문제는 미루지 말고 일찍 선을 정하는 편이 좋습니다.",
    ],
    advice: question
      ? `질문인 "${question}"은/는 한 번에 답을 내기보다, 오늘의 선택과 현실 조건을 함께 보면서 풀어가세요.`
      : "오늘은 감정 정리, 일정 정리, 관계 정리를 한 번에 하지 말고 하나씩 끊어서 처리하세요.",
    caution: "이 결과는 참고용입니다. 중요한 결정은 현실 조건과 함께 다시 확인해야 합니다.",
  };
}

function fallbackFortune({ profile, fortuneType, period }) {
  const typeLabel =
    {
      general: "오늘의 운세",
      zodiacAnimal: "띠별 운세",
      constellation: "별자리 운세",
      fortuneCookie: "포춘쿠키",
    }[fortuneType] || "오늘의 운세";

  const periodLabel =
    {
      today: "오늘",
      tomorrow: "내일",
      week: "이번 주",
      month: "이번 달",
    }[period] || "오늘";

  const sections = [
    { label: "총운", value: "큰 흐름은 안정적입니다. 중요한 선택은 서두르지 말고 순서를 지키면 좋습니다." },
    { label: "애정운", value: "감정 표현은 짧고 분명하게 하는 편이 유리합니다. 상대의 속도를 존중하세요." },
    { label: "금전운", value: "지출보다 누수를 막는 쪽이 먼저입니다. 작은 정리가 체감 차이를 만듭니다." },
    { label: "직장운", value: "업무는 기준을 분명히 잡으면 좋아집니다. 맡은 일의 마감을 확인하세요." },
    { label: "학업", value: "집중력은 초반보다 후반에 살아납니다. 짧은 단위로 끊어 공부하면 효율이 좋습니다." },
    { label: "성적", value: "실전에서는 기본기가 중요합니다. 반복한 내용에서 점수가 나옵니다." },
  ];

  return {
    headline: `${periodLabel} ${typeLabel}`,
    summary: `${profile.name || "사용자"}의 ${periodLabel} ${typeLabel}은 전체적으로 정리와 조율이 필요한 흐름입니다.`,
    sections,
    lucky: { color: "노랑", number: "7", direction: "동쪽", item: "메모" },
    fortuneCookie: "오늘은 멀리 보기보다 가까운 일 하나를 잘 마무리할 때 운이 따라옵니다.",
    advice: "우선순위를 하나만 정해서 움직이세요. 분산보다 집중이 유리합니다.",
    caution: "이 결과는 참고용입니다. 중요한 결정은 현실 조건과 함께 다시 확인해야 합니다.",
  };
}

function normalizeFortuneResponse(response) {
  const sourceSections = Array.isArray(response.sections) ? response.sections : [];
  const sections = fortuneSectionLabels.map((label) => {
    const matched = sourceSections.find((section) => section.label === label);
    return {
      label,
      value: matched?.value || "생성된 내용이 없습니다.",
    };
  });

  return {
    ...response,
    sections,
    sectionsByLabel: sections.reduce((acc, section) => {
      acc[section.label] = section.value;
      return acc;
    }, {}),
  };
}

async function generateWithFallback(kind, input) {
  const fallbackByKind = {
    tarot: fallbackTarot,
    saju: fallbackSaju,
    fortune: fallbackFortune,
  };

  if (!process.env.OPENAI_API_KEY) {
    return { result: fallbackByKind[kind](input), provider: "fallback", model: openaiModel };
  }

  try {
    const config = {
      tarot: {
        schemaName: "tarot_reading",
        schema: tarotSchema,
        systemPrompt: "당신은 타로 리딩 전문가입니다. JSON만 반환하세요.",
        userPayload: {
          instruction: "선택한 3장의 타로 카드로 결과를 생성하세요.",
          ...input,
        },
      },
      saju: {
        schemaName: "saju_reading",
        schema: sajuSchema,
        systemPrompt: "당신은 정통사주 리딩 전문가입니다. 결과는 구체적이고 자세해야 하며 JSON만 반환하세요.",
        userPayload: {
          instruction: "입력된 사주 정보를 바탕으로 자세한 결과를 생성하세요.",
          ...input,
        },
      },
      fortune: {
        schemaName: "fortune_reading",
        schema: fortuneSchema,
        systemPrompt: "당신은 오늘의 운세 리딩 전문가입니다. JSON만 반환하세요.",
        userPayload: {
          instruction: "period와 fortuneType을 반영해 6개 항목의 운세를 생성하세요.",
          ...input,
        },
      },
    }[kind];

    const generated = await callOpenAi(config);
    return { ...generated, provider: "openai", model: openaiModel };
  } catch (error) {
    return {
      result: fallbackByKind[kind](input),
      provider: "fallback",
      model: openaiModel,
      error: error.message,
    };
  }
}

async function handleCreateReading(req, res, kind, validate) {
  const user = getUser(req);
  const body = await readBody(req);
  const validationError = validate(body);
  if (validationError) {
    sendJson(res, 400, { ok: false, message: validationError });
    return;
  }

  const generated = await generateWithFallback(kind, body);
  const response = kind === "fortune" ? normalizeFortuneResponse(generated.result) : generated.result;
  const record = {
    id: `${kind}_${Date.now()}`,
    type: kind,
    userId: user.id,
    saved: Boolean(user.id && user.isPaid),
    createdAt: new Date().toISOString(),
    request: body,
    response,
    provider: generated.provider,
    model: generated.model,
    usage: generated.usage || null,
    error: generated.error || null,
  };

  if (record.saved) {
    await saveReading(kind, record);
  }

  sendJson(res, 200, { ok: true, reading: record });
}

async function handleSavedReadings(req, res, kind) {
  const user = getUser(req);
  if (!user.id) {
    sendJson(res, 401, { ok: false, message: "로그인이 필요합니다." });
    return;
  }

  const rows = await readDb(kind, user.id);
  sendJson(res, 200, { ok: true, readings: rows.filter((row) => row.userId === user.id) });
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-User-Id,X-User-Paid");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    if (req.url === "/health") {
      sendJson(res, 200, { ok: true, service: "dokhalmaekase-backend", model: openaiModel });
      return;
    }

    if (req.method === "POST" && req.url === "/api/tarot/readings") {
      await handleCreateReading(req, res, "tarot", (body) =>
        !body.mode || !Array.isArray(body.cards) || body.cards.length !== 3 ? "mode and exactly 3 cards are required" : ""
      );
      return;
    }

    if (req.method === "POST" && req.url === "/api/saju/readings") {
      await handleCreateReading(req, res, "saju", (body) =>
        !body.profile || !body.profile.birthDate || !body.profile.birthTime ? "birthDate and birthTime are required" : ""
      );
      return;
    }

    if (req.method === "POST" && req.url === "/api/fortune/readings") {
      await handleCreateReading(req, res, "fortune", (body) =>
        !body.profile || !body.profile.birthDate || !body.fortuneType ? "birthDate and fortuneType are required" : ""
      );
      return;
    }

    if (req.method === "GET" && req.url === "/api/tarot/readings") {
      await handleSavedReadings(req, res, "tarot");
      return;
    }

    if (req.method === "GET" && req.url === "/api/saju/readings") {
      await handleSavedReadings(req, res, "saju");
      return;
    }

    if (req.method === "GET" && req.url === "/api/fortune/readings") {
      await handleSavedReadings(req, res, "fortune");
      return;
    }

    sendJson(res, 404, { ok: false, message: "Not Found" });
  } catch (error) {
    sendJson(res, 500, { ok: false, message: error.message });
  }
});

server.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
