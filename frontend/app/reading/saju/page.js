"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function SajuPage() {
  const router = useRouter();
  const gateRef = useRef(null);
  const [profile, setProfile] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    gender: "unknown",
    calendarType: "solar",
  });
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [canGenerate, setCanGenerate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCanGenerate(true);
        }
      },
      { root: null, threshold: 1 }
    );

    if (gateRef.current) {
      observer.observe(gateRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const updateProfile = (key, value) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const generateResult = async (event) => {
    event.preventDefault();
    if (loading || !canGenerate) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";
      const response = await fetch(`${apiBase}/api/saju/readings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getMockAuthHeaders(),
        },
        body: JSON.stringify({ profile, question }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "사주 결과 생성에 실패했습니다.");
      }

      window.sessionStorage.setItem("saju-reading", JSON.stringify(data.reading));
      router.push("/reading/saju/result");
    } catch (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <main className={`reading-shell saju-page-shell ${loading ? "is-loading" : ""}`} aria-busy={loading}>
      <section className="reading-card saju-generate-panel saju-story-shell">
        <div className="saju-hero">
          <div className="saju-hero-copy">
            <p className="eyebrow">saju</p>
            <h1>정통 사주</h1>
            <p className="lead">생년월일과 시간을 입력하면 챗GPT가 사주 흐름을 정리합니다.</p>
          </div>

          <div className="saju-hero-meta">
            <div className="stack-item">
              <strong>입력 정보</strong>
              <span>이름, 생년월일, 태어난 시간, 성별, 달력</span>
            </div>
            <div className="stack-item">
              <strong>해석 흐름</strong>
              <span>띠, 별자리, 사주팔자, 오행, 관심 분야</span>
            </div>
          </div>
        </div>

        <form className="saju-form" onSubmit={generateResult}>
          <div className="saju-form-grid">
            <label htmlFor="saju-name">
              이름
              <input
                id="saju-name"
                name="name"
                type="text"
                value={profile.name}
                onChange={(event) => updateProfile("name", event.target.value)}
                placeholder="이름 입력"
                autoComplete="name"
              />
            </label>

            <label htmlFor="saju-birth-date">
              생년월일
              <input
                id="saju-birth-date"
                name="birthDate"
                type="date"
                value={profile.birthDate}
                onChange={(event) => updateProfile("birthDate", event.target.value)}
                required
              />
            </label>

            <label htmlFor="saju-birth-time">
              태어난 시간
              <input
                id="saju-birth-time"
                name="birthTime"
                type="time"
                value={profile.birthTime}
                onChange={(event) => updateProfile("birthTime", event.target.value)}
                required
              />
            </label>

            <label htmlFor="saju-gender">
              성별
              <select
                id="saju-gender"
                name="gender"
                value={profile.gender}
                onChange={(event) => updateProfile("gender", event.target.value)}
              >
                <option value="unknown">선택 안 함</option>
                <option value="female">여성</option>
                <option value="male">남성</option>
              </select>
            </label>

            <label htmlFor="saju-calendar">
              달력
              <select
                id="saju-calendar"
                name="calendarType"
                value={profile.calendarType}
                onChange={(event) => updateProfile("calendarType", event.target.value)}
              >
                <option value="solar">양력</option>
                <option value="lunar">음력</option>
              </select>
            </label>
          </div>

          <label className="saju-question-field" htmlFor="saju-question">
            질문
            <textarea
              id="saju-question"
              name="question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="지금 가장 알고 싶은 흐름을 적어보세요."
              rows={4}
            />
          </label>

          <div className="saju-webtoon">
            <div className="section-head">
              <div>
                <p className="eyebrow">webtoon</p>
                <h3>독할매카세 첫 사주 가이드</h3>
              </div>
            </div>

            <img
              className="saju-webtoon-image"
              src="/assets/saju-webtoon-grandma-v1.png"
              alt="독할매카세 웹툰 스타일 사주 가이드"
            />

            <div className="saju-story-grid">
              <article className="step">
                <span>01</span>
                <p>먼저 생년월일과 시간을 적어 기본 축을 잡습니다.</p>
              </article>
              <article className="step">
                <span>02</span>
                <p>띠와 별자리를 확인해 성향의 결을 함께 읽습니다.</p>
              </article>
              <article className="step">
                <span>03</span>
                <p>사주팔자 결과는 연애, 재물, 일, 학업 흐름까지 나눠 봅니다.</p>
              </article>
              <article className="step">
                <span>04</span>
                <p>아래 버튼은 내용을 끝까지 읽어야 열립니다.</p>
              </article>
            </div>
          </div>

          <div ref={gateRef} className="scroll-gate" aria-hidden="true" />

          {message ? <p className="form-message">{message}</p> : null}

          <div className="auth-actions saju-actions">
            <button type="submit" className="primary" disabled={loading || !canGenerate}>
              {loading ? "결과 생성 중" : canGenerate ? "사주보기" : "끝까지 내려서 확인"}
            </button>
            <Link className="ghost" href="/reading/tarot">
              타로로 이동
            </Link>
            <Link className="ghost" href="/">
              홈으로
            </Link>
          </div>
        </form>

        {loading ? (
          <div className="loading-overlay" role="status" aria-live="polite">
            <div className="loading-box">
              <span className="loading-spinner" aria-hidden="true" />
              <strong>사주 결과를 생성하고 있습니다</strong>
              <p>입력한 생년월일과 질문을 바탕으로 챗GPT가 해석 중입니다.</p>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
