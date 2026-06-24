import Link from "next/link";

export default function AuthPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark" aria-hidden="true">
            <img src="/assets/logo.svg" alt="" />
          </div>
          <div>
            <p className="eyebrow">auth</p>
            <h1>인증 허브</h1>
          </div>
        </div>

        <p className="lead">로그인과 회원가입으로 이동하는 진입점입니다.</p>

        <div className="auth-actions">
          <Link className="primary" href="/login">
            로그인
          </Link>
          <Link className="ghost" href="/signup">
            회원가입
          </Link>
          <Link className="ghost" href="/mypage">
            마이페이지
          </Link>
        </div>
      </section>
    </main>
  );
}
