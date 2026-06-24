"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const periods = [
  { id: "today", label: "오늘의 운세" },
  { id: "tomorrow", label: "내일의 운세" },
  { id: "week", label: "이주의 운세" },
  { id: "month", label: "이달의 운세" },
];

const fortuneTypes = [
  { id: "general", label: "기본 운세" },
  { id: "zodiacAnimal", label: "띠별 운세" },
  { id: "constellation", label: "별자리 운세" },
  { id: "fortuneCookie", label: "포춘쿠키" },
];

const topics = ["총운", "애정운", "금전운", "직장운", "학업", "성적"];
const zodiacAnimals = ["쥐띠", "소띠", "호랑이띠", "토끼띠", "용띠", "뱀띠", "말띠", "양띠", "원숭이띠", "닭띠", "개띠", "돼지띠"];
const constellations = ["양자리", "황소자리", "쌍둥이자리", "게자리", "사자자리", "처녀자리", "천칭자리", "전갈자리", "사수자리", "염소자리", "물병자리", "물고기자리"];

function getMockAuthHeaders() {
  if (typeof window === "undefined") return {};

  const raw = window.localStorage.getItem("mock-auth");
  if (!raw) return {};

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

function getReadingsUrl(apiBase, kind) {
  if (apiBase.includes("/functions/v1")) {
    return `${apiBase}/readings?kind=${kind}`;
  }

  return `${apiBase}/api/${kind}/readings`;
}

export default function FortunePage() {
  const router = useRouter();
  const [period, setPeriod] = useState("today");
  const [fortuneType, setFortuneType] = useState("general");
  const [profile, setProfile] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    gender: "unknown",
    calendarType: "solar",
    zodiacAnimal: "쥐띠",
    constellation: "양자리",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const updateProfile = (key, value) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const generateResult = async (event) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";
      const response = await fetch(getReadingsUrl(apiBase, "fortune"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getMockAuthHeaders(),
        },
        body: JSON.stringify({
          period,
          fortuneType,
          profile,
          selectedTopics: topics,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "운세 결과 생성에 실패했습니다.");
      }

      window.sessionStorage.setItem("fortune-reading", JSON.stringify(data.reading));
      router.push("/reading/fortune/result");
    } catch (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <main className={`reading-shell ${loading ? "is-loading" : ""}`} aria-busy={loading}>
      <section className="reading-card saju-generate-panel">
        <p className="eyebrow">fortune</p>
        <h1>오늘의 운세</h1>
        <p className="lead">기간과 운세 종류를 고르면 총운, 애정운, 금전운, 직장운, 학업, 성적을 모두 생성합니다.</p>

        <form className="saju-form" onSubmit={generateResult}>
          <div className="fortune-tabs" role="tablist" aria-label="운세 기간">
            {periods.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`fortune-tab ${period === item.id ? "active" : ""}`}
                onClick={() => setPeriod(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="fortune-tabs" role="tablist" aria-label="운세 종류">
            {fortuneTypes.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`fortune-tab ${fortuneType === item.id ? "active" : ""}`}
                onClick={() => setFortuneType(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="saju-form-grid">
            <label htmlFor="fortune-name">
              이름
              <input
                id="fortune-name"
                name="name"
                type="text"
                value={profile.name}
                onChange={(event) => updateProfile("name", event.target.value)}
                placeholder="이름 입력"
                autoComplete="name"
              />
            </label>

            <label htmlFor="fortune-birth-date">
              생년월일
              <input
                id="fortune-birth-date"
                name="birthDate"
                type="date"
                value={profile.birthDate}
                onChange={(event) => updateProfile("birthDate", event.target.value)}
                required
              />
            </label>

            <label htmlFor="fortune-birth-time">
              태어난 시간
              <input
                id="fortune-birth-time"
                name="birthTime"
                type="time"
                value={profile.birthTime}
                onChange={(event) => updateProfile("birthTime", event.target.value)}
              />
            </label>

            <label htmlFor="fortune-gender">
              성별
              <select id="fortune-gender" name="gender" value={profile.gender} onChange={(event) => updateProfile("gender", event.target.value)}>
                <option value="unknown">선택 안 함</option>
                <option value="female">여성</option>
                <option value="male">남성</option>
              </select>
            </label>

            <label htmlFor="fortune-calendar">
              달력
              <select
                id="fortune-calendar"
                name="calendarType"
                value={profile.calendarType}
                onChange={(event) => updateProfile("calendarType", event.target.value)}
              >
                <option value="solar">양력</option>
                <option value="lunar">음력</option>
              </select>
            </label>

            <label htmlFor="fortune-zodiac">
              띠
              <select
                id="fortune-zodiac"
                name="zodiacAnimal"
                value={profile.zodiacAnimal}
                onChange={(event) => updateProfile("zodiacAnimal", event.target.value)}
              >
                {zodiacAnimals.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="fortune-constellation">
              별자리
              <select
                id="fortune-constellation"
                name="constellation"
                value={profile.constellation}
                onChange={(event) => updateProfile("constellation", event.target.value)}
              >
                {constellations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="fortune-topic-grid" aria-label="생성 항목">
            {topics.map((topic) => (
              <label className="fortune-topic active" key={topic}>
                <input type="checkbox" name="selectedTopics" value={topic} checked readOnly />
                {topic}
              </label>
            ))}
          </div>

          {message ? <p className="form-message">{message}</p> : null}

          <div className="auth-actions">
            <button type="submit" className="primary" disabled={loading}>
              {loading ? "결과 생성 중" : "AI 운세 결과 생성"}
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
              <strong>운세 결과를 생성하고 있습니다</strong>
              <p>선택한 기간과 운세 종류를 바탕으로 6개 항목을 모두 작성 중입니다.</p>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
