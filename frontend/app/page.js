import Link from "next/link";

const navItems = [
  { label: "정통 사주", href: "/reading/saju" },
  { label: "타로", href: "/reading/tarot" },
  { label: "오늘의 운세", href: "/reading/fortune" },
  { label: "마이페이지", href: "/mypage" },
];

const categories = [
  {
    title: "정통 사주",
    subtitle: "생년월일 기반의 흐름 해석",
    href: "/reading/saju",
    accent: "amber",
    image: "/assets/reading-saju-grandma-v3.png",
  },
  {
    title: "타로",
    subtitle: "질문 중심의 3장 리딩",
    href: "/reading/tarot",
    accent: "rose",
    image: "/assets/reading-tarot-grandma-v3.png",
  },
  {
    title: "오늘의 운세",
    subtitle: "총운·애정운·금전운까지 AI 생성",
    href: "/reading/fortune",
    accent: "earth",
    image: "/assets/grandma-hero-v2.png",
  },
];

const timeline = ["리딩 선택", "질문 입력", "카드 또는 정보를 확인", "결과 저장과 공유"];

export default function HomePage() {
  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <img src="/assets/logo.svg" alt="" />
          </div>
          <div>
            <p className="eyebrow">dokhalmaekase</p>
            <h1>독할매카세</h1>
          </div>
        </div>
        <nav className="topbar-nav" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <Link className="nav-link" href={item.href} key={item.label}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="topbar-actions">
          <Link className="ghost" href="/login">
            로그인
          </Link>
          <Link className="ghost" href="/signup">
            회원가입
          </Link>
          <Link className="primary" href="/reading/tarot">
            무료 시작
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">사주 · 타로</p>
          <h2>질문을 중심으로 정리하는 리딩 경험</h2>
          <p className="lead">
            정통 사주, 타로, 오늘의 운세를 한 화면 흐름으로 정리했습니다. 지금은 로컬 테스트용 화면이며,
            카드 선택과 결과 확인 흐름을 먼저 검증합니다.
          </p>
          <div className="hero-actions">
            <Link className="primary" href="/reading/tarot">
              타로 보기
            </Link>
            <Link className="ghost" href="/reading/saju">
              사주 보기
            </Link>
            <Link className="ghost" href="/reading/fortune">
              오늘의 운세
            </Link>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-frame">
            <img className="hero-photo" src="/assets/grandma-hero-v2.png" alt="" />
            <div className="hero-caption">
              <span>질문에서 결과까지 이어지는 화면</span>
              <strong>정통 사주 · 타로</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">flow</p>
            <h3>간단한 리딩 흐름</h3>
          </div>
        </div>
        <div className="steps">
          {timeline.map((item, index) => (
            <article className="step" key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">categories</p>
            <h3>리딩 목록</h3>
          </div>
        </div>
        <div className="card-grid">
          {categories.map((item) => (
            <Link className={`fortune-card ${item.accent}`} href={item.href} key={item.title}>
              <div className="card-image">
                <img src={item.image} alt="" />
              </div>
              <div className="card-body">
                <p>{item.title}</p>
                <span>{item.subtitle}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
