# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 1. 절대 규칙

- 이 CLAUDE.md는 150(+-50)자로 유지해주세요.
- 기능 구현 시 TDD를 적용해서 개발해주세요.
- 새로운 커밋 전에 테스트 코드 실행, npm run lint, npm run typecheck, npm run format 체크한 후 성공 결과도 함께 보여주세요.
- 수정 한 내용이 있다면 관련된 테스트코드도 함께 수정해주세요.
- 커밋 메시지와 코드 안의 모든 주석, PR, Task는 반드시 한국어로 작성해주세요.

---

## 2. 명령어 치트시트

```bash
# 빌드 / 개발 서버
npm run dev              # http://localhost:3000
npm run build

# 테스트 (Vitest)
npm test                 # 전체 (1회 실행)
npm run test:watch       # watch 모드
npm test path/to/file    # 단일 파일

# Lint / 타입체크 / 포맷
npm run lint             # ESLint (next 기본 설정)
npm run typecheck        # tsc --noEmit
npm run format           # Prettier
```

---

## 3. 아키텍처 한눈에

Next.js 15 App Router + React 19 + Tailwind CSS 4 + TypeScript 프로젝트.
DB 없이 `lib/data/concepts.json`에서 데이터를 읽는 학습용 프로젝트.

```
app/                  # App Router 라우트
  api/concepts/       # GET /api/concepts, GET /api/concepts/[slug]
  api/feedback/       # POST /api/feedback (미완성 — IDEAS.md #3)
  agent-loop/         # 에이전트 루프 시각화 페이지
  memory-hierarchy/   # 메모리 계층 시각화 페이지
components/           # 클라이언트/서버 React 컴포넌트
lib/
  api/                # HTTP 클라이언트 (axios + fetch 공존 — 의도적)
  data/               # concepts.json (정적 데이터)
  concepts.ts         # listConcepts(), findConcept() 데이터 접근
  errors.ts           # AppError 클래스
  logger.ts           # 구조화된 JSON 로깅
tests/                # Vitest 테스트 (jsdom 환경)
```

**의도적 비일관성** (강의 Ch03 "50% 규칙" 학습 소재):

- HTTP: `axios`와 `fetch` 공존
- 로깅: `logger.info()`와 `console.log()` 공존
- 에러: `AppError`와 `throw new Error()` 혼용

---

## 4. 컨벤션

### 네이밍

- 파일: `kebab-case.ts`, 컴포넌트: `PascalCase.tsx`, hook: `useXxx.ts`
- 테스트: `<원본>.test.ts`

### 테스트

- 단위 테스트는 mocking OK
- 통합 테스트는 mocking 금지
- `vitest` globals 활성화 (`describe`, `it`, `expect` import 불필요)

### 스타일링

- Tailwind + CSS 변수 (`--color-bg`, `--color-fg`, `--color-brand` 등)
- 커스텀 클래스: `.surface`, `.surface-hover`, `.text-brand-gradient`
- 다크 모드 전용 (라이트 모드 미지원)

### 에러 처리

- API 라우트는 `lib/errors.ts`의 `AppError` 던지기
- catch 블록에서 `console.log` 금지 — `logger.error`만

---

## 5. 지금 진행 중 (TODO)

- [ ] 에러 응답에 `trackingId` (UUID) 포함(@IDEAS.md #5)

---

## 6. 참고 자료

- 학습 과제 목록: `IDEAS.md` (7개 과제, 각 90분 분량)
