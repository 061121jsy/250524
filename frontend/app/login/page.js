"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", isPaid: false });
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    window.localStorage.setItem(
      "mock-auth",
      JSON.stringify({
        id: form.email,
        email: form.email,
        isPaid: form.isPaid,
      })
    );
    setMessage("로그인 요청을 접수했습니다. 로컬 테스트 화면으로 이동합니다.");
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
            <p className="eyebrow">login</p>
            <h1>로그인</h1>
          </div>
        </div>

        <p className="lead">Supabase Auth 연결 전 로컬 테스트용 로그인 화면입니다.</p>

        <div className="auth-actions">
          <Link className="ghost" href="/signup">
            회원가입
          </Link>
          <Link className="ghost" href="/auth">
            인증 허브
          </Link>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-fields">
            <label htmlFor="login-email">
              이메일
              <input
                id="login-email"
                name="email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </label>
            <label htmlFor="login-password">
              비밀번호
              <input
                id="login-password"
                name="password"
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="8자 이상 입력"
                autoComplete="current-password"
                required
              />
            </label>
            <label className="check-field" htmlFor="login-is-paid">
              <input
                id="login-is-paid"
                name="isPaid"
                type="checkbox"
                checked={form.isPaid}
                onChange={(event) => setForm((prev) => ({ ...prev, isPaid: event.target.checked }))}
              />
              결제 완료 사용자로 테스트
            </label>
          </div>

          {message ? <p className="form-message">{message}</p> : null}

          <div className="auth-actions">
            <button type="submit" className="primary">
              로그인
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
