import "./globals.css";

export const metadata = {
  title: "독할매카세",
  description: "사주와 타로 리딩을 위한 로컬 테스트 앱",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
