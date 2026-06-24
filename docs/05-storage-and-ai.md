# 05. Storage and AI

## Storage

- 이미지 파일은 Supabase Storage Bucket에 저장한다.
- 생성 결과와 메타데이터는 Supabase Postgres에 보관한다.
- 파일 경로와 사용자 식별자는 분리해 관리한다.

## AI

- 백엔드 테스트 서버에서 OpenAI 요청 포맷을 먼저 검증한다.
- 최종 응답은 사주 해석, 요약, 주의 포인트로 나눈다.
- 결과는 섹션별로 저장할 수 있게 구조를 분리한다.
