"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function fallbackReading() {
  return {
    saved: false,
    provider: "fallback",
    model: null,
    request: {
      profile: { name: "", birthDate: "", birthTime: "", gender: "unknown", calendarType: "solar" },
      question: "",
    },
    response: {
      headline: "사주 결과가 없습니다",
      summary: "사주 입력 화면에서 결과를 먼저 생성해 주세요.",
      pillars: [
        { label: "기질", value: "입력 정보가 없습니다." },
        { label: "재능", value: "입력 정보가 없습니다." },
        { label: "관계", value: "입력 정보가 없습니다." },
        { label: "흐름", value: "입력 정보가 없습니다." },
      ],
      sections: [],
      timing: [],
      strengths: [],
      cautions: [],
      advice: "사주 입력 화면에서 정보를 넣고 다시 생성해 주세요.",
      caution: "사주 결과는 참고용입니다.",
    },
  };
}

function loadReading() {
  if (typeof window === "undefined") {
    return fallbackReading();
  }

  const raw = window.sessionStorage.getItem("saju-reading");
  if (!raw) {
    return fallbackReading();
  }

  try {
    return JSON.parse(raw);
  } catch {
    return fallbackReading();
  }
}

export default function SajuResultPage() {
  const [reading, setReading] = useState(null);

  useEffect(() => {
    setReading(loadReading());
  }, []);

  const insight = useMemo(() => {
    if (!reading) {
      return null;
    }

    const profile = reading.request?.profile || {};
    const response = reading.response || fallbackReading().response;
    const sections = Array.isArray(response.sections) ? response.sections : [];
    const timing = Array.isArray(response.timing) ? response.timing : [];
    const strengths = Array.isArray(response.strengths) ? response.strengths : [];
    const cautions = Array.isArray(response.cautions) ? response.cautions : [];

    return {
      name: profile.name || "사용자",
      birth: [profile.birthDate, profile.birthTime].filter(Boolean).join(" "),
      question: reading.request?.question || "질문 없음",
      headline: response.headline,
      summary: response.summary,
      pillars: response.pillars || [],
      sections,
      timing,
      strengths,
      cautions,
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

  return (
    <main className="reading-shell">
      <section className="reading-card saju-result-card">
        <p className="eyebrow">saju result</p>
        <h1>{insight.headline}</h1>
        <p className="lead">{insight.summary}</p>

        <div className="reading-meta">
          <div>
            <span>이름</span>
            <strong>{insight.name}</strong>
          </div>
          <div>
            <span>출생</span>
            <strong>{insight.birth || "입력 없음"}</strong>
          </div>
          <div>
            <span>생성</span>
            <strong>{insight.provider === "openai" ? "OpenAI" : "로컬"}</strong>
          </div>
          <div>
            <span>모델</span>
            <strong>{insight.model || "fallback"}</strong>
          </div>
        </div>

        <p className="section-note">
          {insight.saved ? "로그인 및 결제 완료 사용자로 DB에 저장되었습니다." : "비로그인 또는 미결제 상태라 저장되지 않았습니다."}
        </p>

        <div className="result-hero">
          <div className="sigil" />
          <div>
            <p className="result-kicker">질문</p>
            <h2>{insight.question}</h2>
          </div>
        </div>

        <div className="result-matrix">
          {insight.pillars.map((item) => (
            <article className="result-card" key={item.label}>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>

        {insight.sections.length > 0 ? (
          <div className="result-grid">
            {insight.sections.map((section) => (
              <article className="result-card result-card-hero" key={section.label}>
                <p>{section.label}</p>
                <strong>{section.title}</strong>
                <small>{section.value}</small>
              </article>
            ))}
          </div>
        ) : null}

        {insight.timing.length > 0 ? (
          <div className="result-bands">
            {insight.timing.map((item) => (
              <article className="stack-item" key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.value}</span>
              </article>
            ))}
          </div>
        ) : null}

        <div className="result-bands">
          <article className="stack-item">
            <strong>강점</strong>
            <span>{insight.strengths.length ? insight.strengths.join(" · ") : insight.advice}</span>
          </article>
          <article className="stack-item">
            <strong>주의</strong>
            <span>{insight.cautions.length ? insight.cautions.join(" · ") : insight.caution}</span>
          </article>
        </div>

        <div className="result-bands">
          <article className="stack-item">
            <strong>조언</strong>
            <span>{insight.advice}</span>
          </article>
          <article className="stack-item">
            <strong>주의 문장</strong>
            <span>{insight.caution}</span>
          </article>
        </div>

        <div className="auth-actions">
          <Link className="primary" href="/reading/saju">
            다시 사주
          </Link>
          <Link className="ghost" href="/reading/tarot">
            타로 보러가기
          </Link>
          <Link className="ghost" href="/">
            홈으로
          </Link>
        </div>
      </section>
    </main>
  );
}
