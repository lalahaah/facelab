# plan.md — FaceLab 실행 계획

> Source of Truth. `architecture_research.md` + `wireframe_main.html` 확정 기준.
> 워크플로우: Claude(설계) → Antigravity CLI(실행) → Laha(검증) → git commit/push → 다음 태스크
> **"구현해" 명령 전까지 코드 작성 금지.** 완료된 태스크는 `[x]`로 표시하며 이 문서를 갱신.

## 0. 사전 준비 (Laha 직접 수행)

- [ ] Vercel 신규 프로젝트 생성 (`facelab`)
- [ ] `facelab.app` 도메인 구매 + Vercel 연결
- [ ] Supabase 신규 프로젝트 생성
- [ ] GitHub 신규 레포 생성 (`lalahaah/facelab`)
- [ ] 로컬에 `cd facelab` 후 `agy` 실행 준비

## 1. 프로젝트 구조

```
facelab/
├── AGENTS.md
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # 홈 (히어로 + 카탈로그 + 프로세스 + 푸터)
│   ├── quiz/[slug]/page.tsx        # 퀴즈 실행 페이지
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── about/page.tsx
│   └── api/
│       ├── result-log/route.ts
│       └── og/route.tsx
├── components/
│   ├── ViewfinderFrame.tsx         # 브라켓+스캔라인 시그니처 컴포넌트
│   ├── QuizCard.tsx
│   ├── QuizRunner.tsx              # 업로드→추론→결과 공통 로직
│   └── ShareCard.tsx
├── config/
│   └── quizzes/
│       ├── blood-type.ts
│       ├── age-estimate.ts
│       └── face-reading.ts
├── lib/
│   └── supabase.ts
└── public/
    └── models/                     # TM 모델 export (모델 학습 완료 후)
```

## 2. DB 스키마 (Supabase) — architecture_research.md 기준 확정

```sql
create table quiz_results (
  id uuid primary key default gen_random_uuid(),
  quiz_slug text not null,
  result_label text not null,
  created_at timestamptz default now()
);
```

이미지/PII 컬럼 없음. `quizzes` 메타데이터는 DB 대신 `config/quizzes/*.ts` 정적 파일로 관리(관리자 페이지 불필요, 배포 즉시 반영).

## 3. API 스펙

| 메서드 | 경로 | 요청 | 응답 |
|---|---|---|---|
| POST | `/api/result-log` | `{ quizSlug, resultLabel }` | `{ ok: true }` |
| GET | `/api/og` | `?quiz=&result=` | PNG (OG 이미지) |

## 4. 태스크 목록

### Day 1 — 뼈대 + 홈페이지

- [ ] **TASK-001** Next.js 14 프로젝트 초기화 (TS, App Router, Tailwind, shadcn/ui) + `AGENTS.md` 생성
  - 파일: 전체 스캐폴딩, `AGENTS.md`
  - 검증: `pnpm dev` 로컬 구동 확인
- [ ] **TASK-002** 디자인 토큰 이식 (`tailwind.config.ts`, `app/globals.css`, 폰트 로드)
  - 파일: `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`
  - 값: paper #F5F6F2 / ink #12141A / scan #2D5BFF / blood #E63950 / amber #F2A93C / jade #1FA37D, Sora + IBM Plex Sans KR + IBM Plex Mono
  - 검증: 와이어프레임과 색/폰트 육안 대조
- [ ] **TASK-003** 홈페이지 정적 마크업 (`wireframe_main.html` → JSX 변환)
  - 파일: `app/page.tsx`, `components/ViewfinderFrame.tsx`, `components/QuizCard.tsx`
  - 검증: 데스크톱/모바일 반응형, 와이어프레임과 레이아웃 일치

### Day 2 — 퀴즈 플로우 + 공유카드

- [ ] **TASK-004** `quizzes` config 구조 + `/quiz/[slug]` 라우트 스캐폴딩 (UI만, 모델 미연동)
  - 파일: `config/quizzes/*.ts`, `app/quiz/[slug]/page.tsx`
  - 검증: 3개 슬러그 모두 라우팅 정상, 업로드 UI 표시
- [ ] **TASK-005** TensorFlow.js 클라이언트 추론 연동
  - 파일: `components/QuizRunner.tsx`
  - ⚠️ 전제조건: 3종 모델(혈액형/나이/관상) 학습 완료 후 `public/models/`에 배치. **미완료 시 플레이스홀더 모델로 UI 검증만 진행**
  - 검증: 업로드→분석→결과 화면까지 전체 플로우 동작
- [ ] **TASK-006** OG 이미지 공유카드 API
  - 파일: `app/api/og/route.tsx`, `components/ShareCard.tsx`
  - 검증: `/api/og?quiz=blood-type&result=B형` 접속 시 9:16 이미지 생성 확인

### Day 3 — 정책 페이지 + 수익화 + 배포

- [ ] **TASK-007** Supabase 연결 + `quiz_results` 테이블 + `/api/result-log`
  - 파일: `lib/supabase.ts`, `app/api/result-log/route.ts`
  - 검증: Supabase Table Editor에서 결과 적재 확인
- [ ] **TASK-008** 정책 페이지 3종 (개인정보처리방침 / 이용약관 / About)
  - 파일: `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/about/page.tsx`
  - 필수 문구: "사진은 서버로 전송/저장되지 않으며 브라우저에서만 처리됩니다"
- [ ] **TASK-009** AdSense 스크립트 삽입 (슬롯 자리만, 승인 전 비활성 상태로)
  - 파일: `app/layout.tsx`, `components/AdSlot.tsx`
- [ ] **TASK-010** Vercel 배포 + `facelab.app` 도메인 연결 + env 변수 설정
  - 검증: 실제 도메인 접속 확인, Lighthouse 모바일 점수 체크

## 5. 사전 커밋 체크 (매 태스크 공통)

```
[ ] .env, .env.local, google-services.json 등 미포함 확인
[ ] 지정된 파일 외 변경 없음 확인 (git diff 확인)
[ ] pnpm build 성공 확인
```

## 6. 병행 트랙 (Day 1-3와 별개, 블로킹 아님)

- [ ] 혈액형 모델 재학습 (Teachable Machine, 신규 데이터셋)
- [ ] 나이 측정 모델 학습 (연령대 구간 분류: 10대/20대/30대/40대+)
- [ ] 관상 모델 학습 (라벨 체계 설계 필요 — 별도 논의)

모델 3종은 TASK-005 전에만 완료되면 됨. 없어도 Day1~4(정책/배포)는 진행 가능.
