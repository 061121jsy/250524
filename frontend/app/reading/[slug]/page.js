import Link from "next/link";

const content = {
  saju: {
    title: "정통 사주",
    desc: "생년월일을 바탕으로 성향과 흐름을 읽는 영역입니다.",
  },
  tarot: {
    title: "타로",
    desc: "질문 하나를 중심으로 지금 필요한 방향을 읽는 영역입니다.",
  },
};

export default async function ReadingPage({ params }) {
  const { slug } = await params;
  const item = content[slug] ?? content.saju;

  return (
    <main className="reading-shell">
      <section className="reading-card">
        <p className="eyebrow">reading</p>
        <h1>{item.title}</h1>
        <p className="lead">{item.desc}</p>

        <div className="reading-visual">
          <div className="sigil" />
          <div className="sigil-text">
            <strong>AI 해석 준비 완료</strong>
            <span>리딩 입력 후 결과 영역으로 연결합니다.</span>
          </div>
        </div>

        <div className="reading-meta">
          <div>
            <span>데이터</span>
            <strong>Supabase</strong>
          </div>
          <div>
            <span>AI</span>
            <strong>OpenAI</strong>
          </div>
          <div>
            <span>배포</span>
            <strong>Vercel</strong>
          </div>
        </div>

        <Link className="primary" href="/">
          홈으로
        </Link>
      </section>
    </main>
  );
}
