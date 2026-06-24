"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("회원가입 요청을 접수했습니다. 마이페이지로 이동합니다.");
    window.setTimeout(() => {
      router.push("/mypage");
    }, 700);
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark" aria-hidden="true">
            <img src="/assets/logo.svg" alt="" />
          </div>
          <div>
            <p className="eyebrow">signup</p>
            <h1>회원가입</h1>
          </div>
        </div>

        <p className="lead">일반 회원가입과 소셜 가입 흐름을 분리하기 위한 테스트 화면입니다.</p>

        <div className="auth-actions">
          <Link className="ghost" href="/login">
            로그인
          </Link>
          <Link className="ghost" href="/auth">
            인증 허브
          </Link>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-fields">
            <label htmlFor="signup-name">
              이름
              <input
                id="signup-name"
                name="name"
                type="text"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="이름 입력"
                autoComplete="name"
                required
              />
            </label>
            <label htmlFor="signup-email">
              이메일
              <input
                id="signup-email"
                name="email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </label>
            <label htmlFor="signup-password">
              비밀번호
              <input
                id="signup-password"
                name="password"
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="8자 이상 입력"
                autoComplete="new-password"
                required
              />
            </label>
          </div>

          {message ? <p className="form-message">{message}</p> : null}

          <div className="auth-actions">
            <button type="submit" className="primary">
              회원가입
            </button>
            <button type="button" className="ghost" onClick={() => router.push("/reading/tarot")}>
              타로 보기
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
