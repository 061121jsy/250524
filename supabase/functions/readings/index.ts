const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-user-id, x-user-paid",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

const FORTUNE_SECTION_LABELS = ["총운", "애정운", "금전운", "직장운", "학업", "성적"];
const DEFAULT_OPENAI_MODEL = "gpt-5.4-mini";
const TAROT_SCHEMA = {
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

const SAJU_SCHEMA = {
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

const FORTUNE_SCHEMA = {
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

function getJsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders,
    },
  });
}

function getUser(req: Request) {
  const headers = req.headers;
  const userId = headers.get("x-user-id");
  return {
    id: userId && userId.trim() ? userId.trim() : null,
    isPaid: headers.get("x-user-paid") === "true",
  };
}

async function readBody(req: Request) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

function getSupabaseSecretKey() {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (legacy) return legacy;

  const raw = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (!raw) return "";

  try {
    const parsed = JSON.parse(raw);
    return parsed.default || "";
  } catch {
    return "";
  }
}

function getSupabaseUrl() {
  return (Deno.env.get("SUPABASE_URL") || "").replace(/\/$/, "");
}

function getOpenAIKey() {
  return Deno.env.get("OPENAI_API_KEY") || "";
}

function getOpenAIModel() {
  return Deno.env.get("OPENAI_MODEL") || DEFAULT_OPENAI_MODEL;
}

async function callOpenAI({ schemaName, schema, systemPrompt, userPayload }: { schemaName: string; schema: unknown; systemPrompt: string; userPayload: unknown }) {
  const apiKey = getOpenAIKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const body = JSON.stringify({
    model: getOpenAIModel(),
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

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body,
  });

  const raw = await response.text();
  let parsed: any = {};
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("OpenAI response was not valid JSON");
    }
  }

  if (!response.ok) {
    throw new Error(parsed?.error?.message || "OpenAI request failed");
  }

  return {
    result: JSON.parse(parsed.output_text),
    usage: parsed.usage || null,
  };
}

async function saveReading(record: Record<string, unknown>) {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseSecretKey();
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase secrets are missing");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/readings`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    const raw = await response.text();
    throw new Error(raw || "Failed to save reading to Supabase");
  }
}

async function loadReadings(kind: string, userId: string) {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseSecretKey();
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase secrets are missing");
  }

  const url = new URL(`${supabaseUrl}/rest/v1/readings`);
  url.searchParams.set("select", "*");
  url.searchParams.set("kind", `eq.${kind}`);
  url.searchParams.set("saved", "eq.true");
  url.searchParams.set("user_id", `eq.${userId}`);
  url.searchParams.set("order", "created_at.desc");

  const response = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  const raw = await response.text();
  let parsed: any[] = [];
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("Supabase response was not valid JSON");
    }
  }

  if (!response.ok) {
    throw new Error(parsed?.message || parsed?.error || "Failed to load readings");
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

function buildFallbackTarot(input: any) {
  const cards = Array.isArray(input.cards) ? input.cards : [];
  const positions = cards.map((card: any) => card.position || "카드");
  return {
    headline: "타로 결과",
    summary: `${cards.map((card: any) => card.name).filter(Boolean).join(" · ") || "선택한 카드"} 기준으로 정리한 타로 해석입니다.`,
    cardReadings: cards.slice(0, 3).map((card: any, index: number) => ({
      position: positions[index] || `위치 ${index + 1}`,
      cardName: card.name || "카드",
      interpretation: `${card.name || "이 카드"}는 현재 흐름에서 중요한 메시지를 줍니다.`,
      action: "지금은 감정과 상황을 함께 보고 다음 행동을 결정하세요.",
    })),
    advice: "카드의 흐름을 한 번에 보지 말고 우선순위부터 정리하세요.",
    caution: "조급함은 해석을 흐릴 수 있습니다.",
  };
}

function buildFallbackSaju(input: any) {
  const profile = input.profile || {};
  return {
    headline: "정통사주 결과",
    summary: `${profile.birthDate || "생년월일"}와 ${profile.birthTime || "출생시간"}를 바탕으로 정리한 사주 해석입니다.`,
    pillars: [
      { label: "기본", value: "기본 성향과 흐름을 정리합니다." },
      { label: "성향", value: "관계와 선택 방식이 중요합니다." },
      { label: "직업", value: "일의 구조와 리듬을 중시합니다." },
      { label: "흐름", value: "시기별로 집중해야 할 포인트가 있습니다." },
    ],
    sections: [
      { label: "전체", title: "전체 성향", value: "지금은 내실과 판단력이 중요합니다." },
      { label: "일", title: "직업 흐름", value: "역할이 커질수록 정리 능력이 강점이 됩니다." },
      { label: "관계", title: "대인 관계", value: "직설보다 조율이 더 좋은 결과를 만듭니다." },
      { label: "재물", title: "금전 흐름", value: "지출보다 기준을 먼저 세우는 게 좋습니다." },
    ],
    timing: [
      { label: "초반", value: "준비와 정리의 시기입니다." },
      { label: "중반", value: "선택이 결과를 만듭니다." },
      { label: "후반", value: "안정감이 올라갑니다." },
    ],
    strengths: ["판단", "지구력", "책임감"],
    cautions: ["과로", "감정 누적", "결정 지연"],
    advice: "작은 습관부터 바꾸면 흐름이 안정됩니다.",
    caution: "단기 반응보다 장기 흐름을 보세요.",
  };
}

function buildFallbackFortune(input: any) {
  const profile = input.profile || {};
  return {
    headline: "오늘의 운세",
    summary: `${profile.name || "사용자"}님의 운세 흐름을 간단히 정리했습니다.`,
    sections: FORTUNE_SECTION_LABELS.map((label, index) => ({
      label,
      value: index === 0 ? "전체 흐름이 무난하고, 정리하면 더 좋아집니다." : "균형 있게 움직이면 좋은 결과가 있습니다.",
    })),
    lucky: { color: "금색", number: "7", direction: "동쪽", item: "메모" },
    fortuneCookie: "오늘은 서두르지 말고 먼저 우선순위를 정리하세요.",
    advice: "할 일은 한 번에 하나씩 처리하는 편이 좋습니다.",
    caution: "과한 확신은 손실로 이어질 수 있습니다.",
  };
}

async function generate(kind: string, input: any) {
  try {
    const config = {
      tarot: {
        schemaName: "tarot_reading",
        schema: TAROT_SCHEMA,
        systemPrompt: "너는 타로 리딩 전문가다. 반드시 JSON만 출력한다.",
        userPayload: {
          kind,
          mode: input.mode,
          question: input.question,
          cards: input.cards,
        },
      },
      saju: {
        schemaName: "saju_reading",
        schema: SAJU_SCHEMA,
        systemPrompt: "너는 정통사주 리딩 전문가다. 반드시 JSON만 출력한다.",
        userPayload: {
          kind,
          profile: input.profile,
          question: input.question,
        },
      },
      fortune: {
        schemaName: "fortune_reading",
        schema: FORTUNE_SCHEMA,
        systemPrompt: "너는 운세 해석 전문가다. 반드시 JSON만 출력한다.",
        userPayload: {
          kind,
          period: input.period,
          fortuneType: input.fortuneType,
          profile: input.profile,
          selectedTopics: input.selectedTopics,
        },
      },
    }[kind];

    if (!getOpenAIKey()) {
      const fallback = kind === "tarot" ? buildFallbackTarot(input) : kind === "saju" ? buildFallbackSaju(input) : buildFallbackFortune(input);
      return { result: fallback, provider: "fallback", model: getOpenAIModel(), usage: null, error: null };
    }

    const generated = await callOpenAI(config);
    return { result: generated.result, provider: "openai", model: getOpenAIModel(), usage: generated.usage, error: null };
  } catch (error) {
    const fallback = kind === "tarot" ? buildFallbackTarot(input) : kind === "saju" ? buildFallbackSaju(input) : buildFallbackFortune(input);
    return {
      result: fallback,
      provider: "fallback",
      model: getOpenAIModel(),
      usage: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function getKind(requestUrl: URL, body: any) {
  return requestUrl.searchParams.get("kind") || body?.kind || "";
}

function validateBody(kind: string, body: any) {
  if (kind === "tarot") {
    if (!body?.mode || !Array.isArray(body.cards) || body.cards.length !== 3) return "mode and exactly 3 cards are required";
  }
  if (kind === "saju") {
    if (!body?.profile?.birthDate || !body?.profile?.birthTime) return "birthDate and birthTime are required";
  }
  if (kind === "fortune") {
    if (!body?.profile?.birthDate || !body?.fortuneType) return "birthDate and fortuneType are required";
  }
  if (!["tarot", "saju", "fortune"].includes(kind)) return "kind must be tarot, saju, or fortune";
  return "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const requestUrl = new URL(req.url);

  if (req.method === "GET") {
    const kind = requestUrl.searchParams.get("kind") || "";
    const user = getUser(req);
    if (!user.id) return getJsonResponse({ ok: false, message: "로그인이 필요합니다." }, 401);
    if (!["tarot", "saju", "fortune"].includes(kind)) return getJsonResponse({ ok: false, message: "kind must be tarot, saju, or fortune" }, 400);

    try {
      const readings = await loadReadings(kind, user.id);
      return getJsonResponse({ ok: true, readings });
    } catch (error) {
      return getJsonResponse({ ok: false, message: error instanceof Error ? error.message : String(error) }, 500);
    }
  }

  if (req.method !== "POST") {
    return getJsonResponse({ ok: false, message: "Not Found" }, 404);
  }

  const body = await readBody(req);
  const kind = getKind(requestUrl, body);
  const validationError = validateBody(kind, body);
  if (validationError) return getJsonResponse({ ok: false, message: validationError }, 400);

  const user = getUser(req);
  const generated = await generate(kind, body);
  const response = generated.result;
  const record = {
    id: `${kind}_${crypto.randomUUID()}`,
    type: kind,
    userId: user.id,
    saved: Boolean(user.id && user.isPaid),
    createdAt: new Date().toISOString(),
    request: body,
    response,
    provider: generated.provider,
    model: generated.model,
    usage: generated.usage,
    error: generated.error,
  };

  if (record.saved) {
    try {
      await saveReading({
        id: record.id,
        kind: record.type,
        user_id: record.userId,
        saved: record.saved,
        created_at: record.createdAt,
        request: record.request,
        response: record.response,
        provider: record.provider,
        model: record.model,
        usage: record.usage,
        error: record.error,
      });
    } catch (error) {
      record.saved = false;
      record.error = error instanceof Error ? error.message : String(error);
    }
  }

  return getJsonResponse({ ok: true, reading: record });
});
