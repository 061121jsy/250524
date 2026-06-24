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
      summary: "운세 입력 화면에서 결과를 먼저 생성하세요.",
      sections: topicOrder.map((label) => ({ label, value: "입력 정보가 없습니다." })),
      lucky: { color: "-", number: "-", direction: "-", item: "-" },
      fortuneCookie: "결과를 먼저 생성하세요.",
      advice: "운세 입력 화면으로 돌아가 결과를 생성하세요.",
      caution: "운세 결과는 참고용입니다.",
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
  return topicOrder.map((label) => ({
    label,
    value:
      sectionsByLabel[label] ||
      response.sections?.find((item) => item.label === label)?.value ||
      "생성된 내용이 없습니다.",
  }));
}

export default function FortuneResultPage() {
  const [reading, setReading] = useState(null);
  const [activeLabel, setActiveLabel] = useState("총운");

  useEffect(() => {
    const nextReading = loadReading();
    setReading(nextReading);
    setActiveLabel(nextReading.response?.sections?.[0]?.label || "총운");
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
        general: "기본 운세",
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
      fortuneCookie: response.fortuneCookie,
      advice: response.advice,
      caution: response.caution,
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
      <section className="reading-card saju-result-card">
        <p className="eyebrow">fortune result</p>
        <h1>{insight.headline}</h1>
        <p className="lead">{insight.summary}</p>

        <div className="reading-meta">
          <div>
            <span>이름</span>
            <strong>{insight.name}</strong>
          </div>
          <div>
            <span>운세</span>
            <strong>{insight.period}</strong>
          </div>
          <div>
            <span>종류</span>
            <strong>{insight.fortuneType}</strong>
          </div>
        </div>

        <p className="section-note">
          {insight.saved ? "로그인/결제 확인으로 DB에 저장되었습니다." : "로그인 및 결제 완료 상태가 아니어서 저장하지 않았습니다."}
          {insight.model ? ` 사용 모델: ${insight.model}` : ""}
        </p>

        <div className="fortune-result-tabs" role="tablist" aria-label="생성된 운세 항목">
          {insight.sections.map((section) => (
            <button
              key={section.label}
              type="button"
              className={`fortune-tab ${activeSection.label === section.label ? "active" : ""}`}
              onClick={() => setActiveLabel(section.label)}
            >
              {section.label}
            </button>
          ))}
        </div>

        <article className="fortune-result-detail">
          <p className="result-kicker">선택한 항목</p>
          <h2>{activeSection.label}</h2>
          <p>{activeValue}</p>
        </article>

        <div className="fortune-lucky-grid">
          <article className="stack-item">
            <strong>행운 색</strong>
            <span>{insight.lucky.color}</span>
          </article>
          <article className="stack-item">
            <strong>행운 숫자</strong>
            <span>{insight.lucky.number}</span>
          </article>
          <article className="stack-item">
            <strong>행운 방향</strong>
            <span>{insight.lucky.direction}</span>
          </article>
          <article className="stack-item">
            <strong>행운 아이템</strong>
            <span>{insight.lucky.item}</span>
          </article>
          <article className="stack-item">
            <strong>포춘쿠키</strong>
            <span>{insight.fortuneCookie}</span>
          </article>
          <article className="stack-item">
            <strong>조언</strong>
            <span>{insight.advice}</span>
          </article>
        </div>

        <div className="result-bands">
          <article className="stack-item">
            <strong>주의점</strong>
            <span>{insight.caution}</span>
          </article>
          <article className="stack-item">
            <strong>생성 방식</strong>
            <span>{insight.provider === "openai" ? "OpenAI API 생성" : "로컬 대체 생성"}</span>
          </article>
        </div>

        <div className="auth-actions">
          <Link className="primary" href="/reading/fortune">
            다시 생성
          </Link>
          <Link className="ghost" href="/reading/tarot">
            타로 보기
          </Link>
          <Link className="ghost" href="/">
            홈으로
          </Link>
        </div>
      </section>
    </main>
  );
}
