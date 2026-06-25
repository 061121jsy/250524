const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-user-id, x-user-paid",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

type ReadingKind = "tarot" | "saju" | "fortune";

type ReadingRecord = {
  id: string;
  type: ReadingKind;
  userId: string | null;
  saved: boolean;
  createdAt: string;
  request: unknown;
  response: unknown;
  provider: string;
  model: string;
  usage: unknown;
  error: string | null;
};

const DEFAULT_OPENAI_MODEL = "gpt-5.4-mini";
const FORTUNE_SECTION_LABELS = ["Overall", "Relationship", "Money", "Career", "Work", "Study"];

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
    strengths: { type: "array", minItems: 3, maxItems: 3, items: { type: "string" } },
    cautions: { type: "array", minItems: 3, maxItems: 3, items: { type: "string" } },
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

function getSupabaseUrl() {
  return (Deno.env.get("SUPABASE_URL") || "").replace(/\/$/, "");
}

function getSupabaseSecretKey() {
  const direct = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_KEY") || "";
  if (direct) return direct;

  const raw = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (!raw) return "";

  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed.default || "";
  } catch {
    return "";
  }
}

function getOpenAIKey() {
  return Deno.env.get("OPENAI_API_KEY") || "";
}

function getOpenAIModel() {
  return Deno.env.get("OPENAI_MODEL") || DEFAULT_OPENAI_MODEL;
}

async function callOpenAI({
  schemaName,
  schema,
  systemPrompt,
  userPayload,
}: {
  schemaName: string;
  schema: unknown;
  systemPrompt: string;
  userPayload: unknown;
}) {
  const apiKey = getOpenAIKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
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
    }),
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

async function loadReadings(kind: ReadingKind, userId?: string | null) {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseSecretKey();
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase secrets are missing");
  }

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

function fallbackTarot(input: any) {
  const cards = Array.isArray(input.cards) ? input.cards : [];
  return {
    headline: "Tarot reading",
    summary: `${cards.map((card: any) => card.name).filter(Boolean).join(" / ") || "Selected cards"} are pointing to this moment.`,
    cardReadings: cards.slice(0, 3).map((card: any, index: number) => ({
      position: card.position || `Position ${index + 1}`,
      cardName: card.name || "Card",
      interpretation: `${card.name || "This card"} carries a strong message for the current situation.`,
      action: "Pause, observe, and decide the next move after checking the facts.",
    })),
    advice: "Keep the big picture in view and choose the most realistic next step.",
    caution: "Avoid rushing decisions before the picture is clear.",
  };
}

function fallbackSaju(input: any) {
  const profile = input.profile || {};
  return {
    headline: "Saju reading",
    summary: `${profile.birthDate || "Birth date"} and ${profile.birthTime || "Birth time"} form the base of this reading.`,
    pillars: [
      { label: "Core", value: "Your base energy is steady and practical." },
      { label: "Mindset", value: "You do best when you keep emotions organized." },
      { label: "Relationships", value: "Clear communication matters more than speed." },
      { label: "Direction", value: "The current phase rewards consistency over force." },
    ],
    sections: [
      { label: "Overall", title: "General flow", value: "The day favors structure, calm choices, and steady progress." },
      { label: "Career", title: "Work", value: "Focus on execution and leave room for small adjustments." },
      { label: "Relationship", title: "People", value: "A direct but respectful tone will work best." },
      { label: "Money", title: "Finances", value: "Keep spending practical and review the basics first." },
    ],
    timing: [
      { label: "Now", value: "Stabilize what is already in motion." },
      { label: "Soon", value: "A small opening appears after a short wait." },
      { label: "Later", value: "Momentum builds once the direction is chosen." },
    ],
    strengths: ["Steady judgement", "Practical planning", "Good timing"],
    cautions: ["Overthinking", "Delaying decisions", "Trying to control everything"],
    advice: "Choose one clear priority and follow through consistently.",
    caution: "Do not treat a rough moment as a final outcome.",
  };
}

function fallbackFortune(input: any) {
  const profile = input.profile || {};
  const periodLabel =
    {
      today: "Today",
      tomorrow: "Tomorrow",
      week: "This week",
      month: "This month",
    }[input.period] || "Today";

  const fortuneTypeLabel =
    {
      general: "General",
      zodiacAnimal: "Zodiac animal",
      constellation: "Constellation",
      fortuneCookie: "Fortune cookie",
    }[input.fortuneType] || "General";

  return {
    headline: `${periodLabel} ${fortuneTypeLabel} reading`,
    summary: `${profile.name || "You"} have a reading that emphasizes steady choices and clear priorities.`,
    sections: [
      { label: "Overall", value: "A stable pace will produce the best result." },
      { label: "Relationship", value: "Be direct and avoid unnecessary assumptions." },
      { label: "Money", value: "Keep an eye on small expenses." },
      { label: "Career", value: "Useful progress comes from finishing what is already open." },
      { label: "Work", value: "Momentum improves when you simplify the task list." },
      { label: "Study", value: "Short, focused sessions are more effective than long, unfocused ones." },
    ],
    lucky: { color: "Blue", number: "7", direction: "East", item: "Notebook" },
    fortuneCookie: "A small decision made calmly can change the day.",
    advice: "Move one step at a time and check results before scaling up.",
    caution: "Do not confuse speed with progress.",
  };
}

function normalizeFortuneResponse(response: any) {
  const sourceSections = Array.isArray(response.sections) ? response.sections : [];
  const sections = FORTUNE_SECTION_LABELS.map((label) => {
    const matched = sourceSections.find((section: any) => section.label === label);
    return {
      label,
      value: matched?.value || "No content available.",
    };
  });

  return {
    ...response,
    sections,
    sectionsByLabel: sections.reduce((acc: Record<string, string>, section) => {
      acc[section.label] = section.value;
      return acc;
    }, {}),
  };
}

async function generate(kind: ReadingKind, input: any) {
  const fallbackByKind = {
    tarot: fallbackTarot,
    saju: fallbackSaju,
    fortune: fallbackFortune,
  };

  if (!getOpenAIKey()) {
    return { result: fallbackByKind[kind](input), provider: "fallback", model: getOpenAIModel(), usage: null, error: null };
  }

  try {
    const config = {
      tarot: {
        schemaName: "tarot_reading",
        schema: TAROT_SCHEMA,
        systemPrompt: "Return JSON only. Generate a tarot reading.",
        userPayload: {
          instruction: "Generate a reading for exactly 3 tarot cards.",
          ...input,
        },
      },
      saju: {
        schemaName: "saju_reading",
        schema: SAJU_SCHEMA,
        systemPrompt: "Return JSON only. Generate a saju reading.",
        userPayload: {
          instruction: "Generate a reading from the supplied saju profile.",
          ...input,
        },
      },
      fortune: {
        schemaName: "fortune_reading",
        schema: FORTUNE_SCHEMA,
        systemPrompt: "Return JSON only. Generate a fortune reading.",
        userPayload: {
          instruction: "Generate 6 sections and reflect the selected period and fortune type.",
          ...input,
        },
      },
    }[kind];

    const generated = await callOpenAI(config);
    return { result: generated.result, provider: "openai", model: getOpenAIModel(), usage: generated.usage, error: null };
  } catch (error) {
    return {
      result: fallbackByKind[kind](input),
      provider: "fallback",
      model: getOpenAIModel(),
      usage: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function getKind(requestUrl: URL, body: any) {
  return (requestUrl.searchParams.get("kind") || body?.kind || "") as ReadingKind | "";
}

function validateBody(kind: ReadingKind | "", body: any) {
  if (!["tarot", "saju", "fortune"].includes(kind)) {
    return "kind must be tarot, saju, or fortune";
  }

  if (kind === "tarot") {
    if (!body?.mode || !Array.isArray(body.cards) || body.cards.length !== 3) {
      return "mode and exactly 3 cards are required";
    }
  }

  if (kind === "saju") {
    if (!body?.profile?.birthDate || !body?.profile?.birthTime) {
      return "birthDate and birthTime are required";
    }
  }

  if (kind === "fortune") {
    if (!body?.profile?.birthDate || !body?.fortuneType) {
      return "birthDate and fortuneType are required";
    }
  }

  return "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const requestUrl = new URL(req.url);

  if (req.method === "GET") {
    const kind = requestUrl.searchParams.get("kind") as ReadingKind | "";
    const user = getUser(req);

    if (!user.id) {
      return getJsonResponse({ ok: false, message: "Login required" }, 401);
    }

    if (!["tarot", "saju", "fortune"].includes(kind)) {
      return getJsonResponse({ ok: false, message: "kind must be tarot, saju, or fortune" }, 400);
    }

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
  if (validationError) {
    return getJsonResponse({ ok: false, message: validationError }, 400);
  }

  const user = getUser(req);
  const generated = await generate(kind, body);
  const response = kind === "fortune" ? normalizeFortuneResponse(generated.result) : generated.result;
  const record: ReadingRecord = {
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
