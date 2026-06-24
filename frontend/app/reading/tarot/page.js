"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { buildTarotReading, shuffleDeck, tarotCards, tarotModes } from "./tarot-data";

export default function TarotPage() {
  const router = useRouter();
  const [mode, setMode] = useState(tarotModes[0]);
  const [question, setQuestion] = useState("");
  const [deck, setDeck] = useState(tarotCards);
  const [revealed, setRevealed] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const selectedCards = useMemo(
    () => selectedIds.map((id) => tarotCards.find((card) => card.id === id)).filter(Boolean),
    [selectedIds]
  );

  const resetReading = () => {
    setDeck(shuffleDeck(tarotCards));
    setSelectedIds([]);
    setRevealed(false);
    setShuffling(false);
  };

  const handleModeSelect = (nextMode) => {
    setMode(nextMode);
    resetReading();
  };

  const handleSpread = () => {
    setShuffling(true);
    setSelectedIds([]);
    setDeck(shuffleDeck(tarotCards));
    window.setTimeout(() => {
      setShuffling(false);
      setRevealed(true);
    }, 900);
  };

  const handleCardClick = (card) => {
    if (!revealed) {
      return;
    }

    setSelectedIds((current) => {
      if (current.includes(card.id) || current.length >= 3) {
        return current;
      }

      return [...current, card.id];
    });
  };

  const handleConfirmSelection = () => {
    const draft = buildTarotReading({
      modeId: mode.id,
      question,
      cards: selectedCards,
    });

    window.sessionStorage.setItem("tarot-draft", JSON.stringify(draft));
    router.push("/reading/tarot/confirm");
  };

  return (
    <main className="tarot-shell">
      <section className="tarot-hero">
        <div>
          <p className="eyebrow">tarot reading</p>
          <h1>타로 리딩</h1>
          <p className="lead">78장의 타로 덱을 낱장으로 펼치고, 뒷면 카드 중에서 3장을 선택합니다.</p>
        </div>
        <div className="tarot-hero-actions">
          <Link className="ghost" href="/">
            홈으로
          </Link>
          <Link className="ghost" href="/login">
            로그인
          </Link>
        </div>
      </section>

      <section className="tarot-panel">
        <div className="tarot-mode-row">
          {tarotModes.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`mode-chip ${mode.id === item.id ? "active" : ""}`}
              onClick={() => handleModeSelect(item)}
            >
              <span>{item.label}</span>
              <small>{item.focus}</small>
            </button>
          ))}
        </div>

        <div className="tarot-stage">
          <div className="tarot-stage-copy">
            <p className="eyebrow">{mode.title}</p>
            <h2>{mode.lead}</h2>
            <p className="section-note">{mode.prompt}</p>

            <label className="question-field" htmlFor="tarot-question">
              <span>질문</span>
              <input
                id="tarot-question"
                name="question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="이번 선택에서 무엇을 먼저 봐야 할까?"
                autoComplete="off"
              />
            </label>

            <div className="tarot-stage-actions">
              <button type="button" className="primary" onClick={handleSpread}>
                카드 펼치기
              </button>
              <button type="button" className="ghost" onClick={resetReading}>
                다시 섞기
              </button>
            </div>

            <div className="tarot-hint-row">
              <span>선택 순서</span>
              <strong>{mode.spread.join(" · ")}</strong>
            </div>
          </div>

          <div className={`tarot-table tarot-picker-table ${shuffling ? "shuffling" : ""} ${revealed ? "revealed" : ""}`}>
            <div className="tarot-table-glow" aria-hidden="true" />
            {deck.map((card, index) => {
              const isSelected = selectedIds.includes(card.id);
              return (
                <button
                  key={card.id}
                  type="button"
                  className={`tarot-card ${revealed ? "deal-ready" : ""} ${isSelected ? "selected" : ""}`}
                  style={{
                    "--delay": `${index * 12}ms`,
                  }}
                  onClick={() => handleCardClick(card)}
                  aria-label={`${index + 1}번째 타로 카드 선택`}
                >
                  <span className="tarot-card-inner">
                    <span className="tarot-card-back">
                      <span className="tarot-card-back-kicker">독할매카세</span>
                      <strong>TAROT</strong>
                      <em>선택 전</em>
                    </span>
                  </span>

                  {isSelected ? <span className="tarot-card-badge">선택됨</span> : null}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="tarot-result-preview">
        <div className="stack-list tarot-summary-strip">
          <article className="stack-item">
            <strong>선택한 카드</strong>
            <span>{selectedCards.length}/3</span>
          </article>
          <article className="stack-item">
            <strong>카드 확인</strong>
            <span>
              {selectedCards.length === 0
                ? "아직 선택 전"
                : selectedCards.map((card, index) => `${index + 1}번째 카드 선택`).join(" · ")}
            </span>
          </article>
          <article className="stack-item">
            <strong>질문</strong>
            <span>{question || "질문을 입력하면 결과에 반영됩니다."}</span>
          </article>
        </div>

        <div className="tarot-picked-row">
          {selectedCards.map((card, index) => (
            <article className="picked-card" key={card.id}>
              <p>{mode.spread[index]}</p>
              <strong>{index + 1}번째 카드</strong>
              <span>다음 화면에서 뒤집어 확인합니다.</span>
              <small>카드 내용은 아직 공개되지 않았습니다.</small>
            </article>
          ))}
          {Array.from({ length: 3 - selectedCards.length }).map((_, index) => (
            <article className="picked-card empty" key={`empty-${index}`}>
              <p>{mode.spread[selectedCards.length + index]}</p>
              <strong>대기 중</strong>
              <span>부채꼴 덱에서 카드를 선택하세요.</span>
            </article>
          ))}
        </div>

        <div className="tarot-confirm-summary">
          <strong>3장 선택 진행</strong>
          <span>
            {selectedCards.length === 0
              ? "카드를 선택하면 확인 단계로 이동할 수 있습니다."
              : selectedCards.map((card, index) => `${index + 1}번째 카드 선택`).join(" · ")}
          </span>
        </div>

        <button
          type="button"
          className="primary tarot-result-button"
          onClick={handleConfirmSelection}
          disabled={selectedCards.length !== 3}
        >
          선택 카드 확인
        </button>
      </section>
    </main>
  );
}
