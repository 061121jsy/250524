"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TarotCardArt from "./tarot-card-art";
import { getReadingsUrl } from "../../../lib/api-base";

function loadDraft() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem("tarot-draft");
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getMockAuthHeaders() {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem("mock-auth");
  if (!raw) {
    return {};
  }

  try {
    const user = JSON.parse(raw);
    return {
      "X-User-Id": user.id || "",
      "X-User-Paid": user.isPaid ? "true" : "false",
    };
  } catch {
    return {};
  }
}

export default function TarotConfirmPage() {
  const router = useRouter();
  const [draft, setDraft] = useState(null);
  const [flippedIds, setFlippedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDraft(loadDraft());
  }, []);

  const cards = draft?.cards || [];
  const allFlipped = useMemo(
    () => cards.length === 3 && cards.every((card) => flippedIds.includes(card.id)),
    [cards, flippedIds]
  );

  const flipCard = (cardId) => {
    if (loading) {
      return;
    }

    setFlippedIds((current) => (current.includes(cardId) ? current : [...current, cardId]));
  };

  const generateResult = async () => {
    if (!draft || !allFlipped || loading) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(getReadingsUrl("tarot"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getMockAuthHeaders(),
        },
        body: JSON.stringify({
          mode: {
            id: draft.mode,
            title: draft.modeLabel,
            focus: draft.focus,
            spread: cards.map((card) => card.position),
          },
          question: draft.question,
          cards,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "결과 생성에 실패했습니다.");
      }

      window.sessionStorage.setItem("tarot-reading", JSON.stringify(data.reading));
      router.push("/reading/tarot/result");
    } catch (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  if (!draft) {
    return (
      <main className="reading-shell">
        <section className="reading-card">
          <p className="eyebrow">tarot confirm</p>
          <h1>선택한 카드가 없습니다</h1>
          <p className="lead">타로 화면에서 3장을 먼저 선택하세요.</p>
          <Link className="primary" href="/reading/tarot">
            타로로 이동
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={`tarot-shell ${loading ? "is-loading" : ""}`} aria-busy={loading}>
      <section className="tarot-hero">
        <div>
          <p className="eyebrow">card confirm</p>
          <h1>선택한 3장 확인</h1>
          <p className="lead">카드를 하나씩 뒤집어 본 뒤 결과를 생성합니다.</p>
        </div>
        <div className="tarot-hero-actions">
          <Link className="ghost" href="/reading/tarot">
            다시 선택
          </Link>
        </div>
      </section>

      <section className="tarot-result-preview tarot-generate-panel">
        <div className="stack-list tarot-summary-strip">
          <article className="stack-item">
            <strong>리딩 항목</strong>
            <span>{draft.modeLabel}</span>
          </article>
          <article className="stack-item">
            <strong>질문</strong>
            <span>{draft.question || "질문 없음"}</span>
          </article>
          <article className="stack-item">
            <strong>확인</strong>
            <span>{flippedIds.length}/3</span>
          </article>
        </div>

        <div className="tarot-picked-row tarot-confirm-cards">
          {cards.map((card) => {
            const isFlipped = flippedIds.includes(card.id);

            return (
              <article className={`picked-card confirm-card ${isFlipped ? "is-flipped" : ""}`} key={card.id}>
                <p>{card.position}</p>
                <button
                  type="button"
                  className="confirm-card-button"
                  onClick={() => flipCard(card.id)}
                  aria-pressed={isFlipped}
                  disabled={loading}
                >
                  <span className="confirm-card-back">
                    <strong>TAROT</strong>
                    <small>선택 전</small>
                  </span>
                  <span className="confirm-card-front">
                    <TarotCardArt card={card} />
                  </span>
                </button>
                <span>{isFlipped ? "선택 완료" : "카드를 눌러 뒤집어 보세요."}</span>
              </article>
            );
          })}
        </div>

        {message ? <p className="form-message">{message}</p> : null}

        <button type="button" className="primary tarot-result-button" onClick={generateResult} disabled={!allFlipped || loading}>
          {loading ? "결과 생성 중" : "챗GPT로 결과 생성"}
        </button>

        {loading ? (
          <div className="loading-overlay" role="status" aria-live="polite">
            <div className="loading-box">
              <span className="loading-spinner" aria-hidden="true" />
              <strong>타로 결과를 생성하고 있습니다</strong>
              <p>선택한 3장의 흐름을 챗GPT가 해석하는 중입니다.</p>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
