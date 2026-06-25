"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const topicOrder = ["총운", "애정운", "금전운", "직장운", "학업", "성적"];

function fallbackReading() {
  return {
    saved: false,
    provider: "fallback",
    model: null,
    request: {
      period: "today",
      fortuneType: "general",
      profile: { name: "", birthDate: "", birthTime: "", gender: "unknown", calendarType: "solar" },
    },
    response: {
      headline: "운세 결과가 없습니다",
      summary: "운세 입력 화면에서 먼저 결과를 생성해 주세요.",
      sections: topicOrder.map((label) => ({ label, value: "입력 정보가 없습니다." })),
      lucky: { color: "-", number: "-", direction: "-", item: "-" },
      fortuneCookie: "결과를 생성한 뒤 다시 확인해 주세요.",
      advice: "입력 정보를 넣고 다시 생성하면 상세한 운세를 볼 수 있습니다.",
      caution: "이 결과는 참고용입니다.",
    },
  };
}

function loadReading() {
  if (typeof window === "undefined") return fallbackReading();

  const raw = window.sessionStorage.getItem("fortune-reading");
  if (!raw) return fallbackReading();

  try {
    return JSON.parse(raw);
  } catch {
    return fallbackReading();
  }
}

function labelOf(value, map) {
  return map[value] || value || "입력 없음";
}

function normalizeSections(response) {
  const sectionsByLabel = response.sectionsByLabel || {};
  return topicOrder.map((label, index) => ({
    label,
    value:
      sectionsByLabel[label] ||
      response.sections?.find((item) => item.label === label)?.value ||
      response.sections?.[index]?.value ||
      "생성된 내용이 없습니다.",
  }));
}

export default function FortuneResultPage() {
  const [reading, setReading] = useState(null);
  const [activeLabel, setActiveLabel] = useState(topicOrder[0]);

  useEffect(() => {
    const nextReading = loadReading();
    setReading(nextReading);
    setActiveLabel(topicOrder[0]);
  }, []);

  const insight = useMemo(() => {
    if (!reading) return null;

    const request = reading.request || fallbackReading().request;
    const response = reading.response || fallbackReading().response;
    const profile = request.profile || {};
    const sections = normalizeSections(response);

    return {
      name: profile.name || "사용자",
      period: labelOf(request.period, {
        today: "오늘의 운세",
        tomorrow: "내일의 운세",
        week: "이주의 운세",
        month: "이달의 운세",
      }),
      fortuneType: labelOf(request.fortuneType, {
        general: "운세 종류",
        zodiacAnimal: "띠별 운세",
        constellation: "별자리 운세",
        fortuneCookie: "포춘쿠키",
      }),
      birth: [profile.birthDate, profile.birthTime].filter(Boolean).join(" "),
      headline: response.headline,
      summary: response.summary,
      sections,
      sectionsByLabel: sections.reduce((acc, section) => {
        acc[section.label] = section.value;
        return acc;
      }, {}),
      lucky: response.lucky || fallbackReading().response.lucky,
      fortuneCookie: response.fortuneCookie || fallbackReading().response.fortuneCookie,
      advice: response.advice || fallbackReading().response.advice,
      caution: response.caution || fallbackReading().response.caution,
      saved: reading.saved,
      provider: reading.provider,
      model: reading.model,
    };
  }, [reading]);

  if (!insight) {
    return (
      <main className="reading-shell">
        <section className="reading-card">
          <p className="lead">결과를 불러오는 중입니다.</p>
        </section>
      </main>
    );
  }

  const activeSection = insight.sections.find((item) => item.label === activeLabel) || insight.sections[0];
  const activeValue = insight.sectionsByLabel[activeSection.label] || activeSection.value;

  return (
    <main className="reading-shell">
      <section className="reading-card">
        <p className="eyebrow">fortune result</p>
        <h1>{insight.headline}</h1>
        <p className="lead">{insight.summary}</p>

        <div className="reading-meta">
          <div>
            <span>이름</span>
            <strong>{insight.name}</strong>
          </div>
          <div>
            <span>생년월일</span>
            <strong>{insight.birth || "입력 없음"}</strong>
          </div>
          <div>
            <span>상태</span>
            <strong>{insight.provider === "openai" ? "OpenAI" : "로컬"}</strong>
          </div>
          <div>
            <span>모델</span>
            <strong>{insight.model || "-"}</strong>
          </div>
        </div>

        <div className="fortune-tabs">
          {insight.sections.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`fortune-tab ${activeLabel === item.label ? "active" : ""}`}
              onClick={() => setActiveLabel(item.label)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="result-card" style={{ marginTop: 16 }}>
          <p>{activeSection.label}</p>
          <strong>{activeValue}</strong>
        </div>

        <div className="result-matrix">
          {insight.sections.map((item) => (
            <article className="result-card" key={item.label}>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>

        <div className="fortune-lucky-grid">
          <article className="stack-item">
            <strong>행운의 색</strong>
            <span>{insight.lucky.color}</span>
          </article>
          <article className="stack-item">
            <strong>행운의 숫자</strong>
            <span>{insight.lucky.number}</span>
          </article>
          <article className="stack-item">
            <strong>행운의 방향</strong>
            <span>{insight.lucky.direction}</span>
          </article>
          <article className="stack-item">
            <strong>행운의 아이템</strong>
            <span>{insight.lucky.item}</span>
          </article>
        </div>

        <div className="fortune-cookie">
          <p className="eyebrow">포춘쿠키 메시지</p>
          <strong>{insight.fortuneCookie}</strong>
        </div>

        <div className="result-footer">
          <div>
            <p className="section-note">{insight.advice}</p>
            <p className="section-note">{insight.caution}</p>
          </div>
          <Link className="ghost" href="/reading/fortune">
            다시 보기
          </Link>
        </div>
      </section>
    </main>
  );
}
