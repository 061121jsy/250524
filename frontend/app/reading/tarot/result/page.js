"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buildFallbackReading } from "../tarot-data";

function loadReading() {
  if (typeof window === "undefined") {
    return buildFallbackReading();
  }

  const raw = window.sessionStorage.getItem("tarot-reading");
  if (!raw) {
    return buildFallbackReading();
  }

  try {
    return JSON.parse(raw);
  } catch {
    return buildFallbackReading();
  }
}

function buildInsight(reading) {
  const response = reading.response || reading;
  const request = reading.request || reading;
  const cards = request.cards || reading.cards || [];
  const [first, second, third] = cards;

  return {
    title: `${request.mode?.title || reading.modeLabel || "타로"} 결과`,
    question: request.question || reading.question || "질문 없음",
    headline: response.headline,
    summary: response.summary,
    advice: response.advice,
    caution: response.caution,
    path: cards.map((card) => card.name).join(" · "),
    tone: reading.provider === "openai" ? "OpenAI 생성" : "로컬 생성",
    saved: reading.saved,
    model: reading.model,
    cards: cards.map((card) => ({
      ...card,
      generated: response.cardReadings?.find((item) => item.cardName === card.name),
      note:
        card.position === "현재" || card.position === "내 마음"
          ? "지금 가장 먼저 봐야 하는 카드"
          : card.position === "조언" || card.position === "결정의 열쇠" || card.position === "정리하는 말"
            ? "마무리 방향을 정리하는 카드"
            : "흐름을 연결하는 카드",
    })),
    matrix: [
      {
        label: "첫 흐름",
        value: response.cardReadings?.[0]?.interpretation || first?.interpretation || "카드가 없습니다.",
      },
      {
        label: "중간 흐름",
        value: response.cardReadings?.[1]?.interpretation || second?.interpretation || "카드가 없습니다.",
      },
      {
        label: "마지막 조언",
        value: response.cardReadings?.[2]?.interpretation || third?.detail || "카드가 없습니다.",
      },
    ],
  };
}

export default function TarotResultPage() {
  const [reading, setReading] = useState(null);

  useEffect(() => {
    setReading(loadReading());
  }, []);

  const insight = useMemo(() => (reading ? buildInsight(reading) : null), [reading]);

  if (!insight) {
    return (
      <main className="reading-shell">
        <section className="reading-card tarot-result-page">
          <p className="lead">결과를 불러오는 중입니다.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="reading-shell">
      <section className="reading-card tarot-result-page tarot-result-layout">
        <div className="tarot-result-visual">
          <img src="/assets/tarot-result-scene.svg" alt="" />
          <div className="tarot-result-visual-caption">
            <span>{insight.tone}</span>
            <strong>{insight.path}</strong>
          </div>
        </div>

        <div className="tarot-result-copy">
          <p className="eyebrow">tarot result</p>
          <h1>{insight.title}</h1>
          <p className="lead">{insight.question}</p>
          <p className="section-note">
            {insight.saved ? "로그인/결제 확인으로 DB에 저장되었습니다." : "로그인 및 결제 완료 상태가 아니어서 저장하지 않았습니다."}
            {insight.model ? ` 사용 모델: ${insight.model}` : ""}
          </p>

          <div className="result-hero">
            <div className="result-orb" />
            <div>
              <p className="result-kicker">종합 해석</p>
              <h2>{insight.headline}</h2>
              <p className="section-note">{insight.summary}</p>
            </div>
          </div>

          <div className="result-matrix">
            {insight.matrix.map((item) => (
              <article className="result-card" key={item.label}>
                <p>{item.label}</p>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>

          <div className="result-grid">
            {insight.cards.map((card) => (
              <article className={`result-card result-card-hero palette-${card.palette}`} key={`${card.slot}-${card.id}`}>
                <p>{card.position}</p>
                <strong>{card.name}</strong>
                <span>{card.upright.headline}</span>
                <small>{card.generated?.interpretation || card.upright.summary}</small>
                <em>{card.generated?.action || card.note}</em>
              </article>
            ))}
          </div>

          <div className="result-bands">
            <article className="stack-item">
              <strong>조언</strong>
              <span>{insight.advice}</span>
            </article>
            <article className="stack-item">
              <strong>주의점</strong>
              <span>{insight.caution}</span>
            </article>
          </div>

          <div className="auth-actions">
            <Link className="primary" href="/reading/tarot">
              다시 타로
            </Link>
            <Link className="ghost" href="/reading/saju">
              정통 사주
            </Link>
            <Link className="ghost" href="/">
              홈으로
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
