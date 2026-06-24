import Link from "next/link";

const readings = [
  { title: "정통 사주", date: "2026-06-23", status: "저장 완료" },
  { title: "타로", date: "2026-06-22", status: "확인 필요" },
  { title: "궁합", date: "2026-06-20", status: "공유됨" },
];

const settings = ["Supabase Auth 계정 연동", "결과 저장 동기화", "이미지 버킷 연결 상태"];

export default function MyPage() {
  return (
    <main className="reading-shell">
      <section className="reading-card">
        <p className="eyebrow">my page</p>
        <h1>마이페이지</h1>
        <p className="lead">저장된 리딩 결과와 계정 연결 상태를 확인하는 사용자 영역입니다.</p>

        <div className="reading-meta">
          <div>
            <span>계정</span>
            <strong>Supabase</strong>
          </div>
          <div>
            <span>저장소</span>
            <strong>Storage</strong>
          </div>
          <div>
            <span>AI</span>
            <strong>OpenAI</strong>
          </div>
        </div>

        <section className="profile-band">
          <div className="profile-avatar" aria-hidden="true">
            독
          </div>
          <div>
            <p className="profile-name">독할매카세 사용자</p>
            <span className="profile-note">회원가입 상태 · 로그인 연결 · 결과 보관</span>
          </div>
        </section>

        <div className="mygrid">
          <div className="panel panel-tight">
            <p className="eyebrow">recent</p>
            <h3>최근 결과</h3>
            <div className="stack-list">
              {readings.map((item) => (
                <article className="stack-item" key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.date}</span>
                  <small>{item.status}</small>
                </article>
              ))}
            </div>
          </div>

          <div className="panel panel-tight">
            <p className="eyebrow">settings</p>
            <h3>연결 상태</h3>
            <div className="stack-list">
              {settings.map((item) => (
                <article className="stack-item" key={item}>
                  <strong>{item}</strong>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="auth-actions">
          <Link className="primary" href="/">
            홈으로
          </Link>
          <Link className="ghost" href="/login">
            로그인
          </Link>
          <Link className="ghost" href="/signup">
            회원가입
          </Link>
        </div>
      </section>
    </main>
  );
}
