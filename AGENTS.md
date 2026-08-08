# AGENTS.md — FaceLab

> 모든 AI 세션(Antigravity CLI 등)은 작업 시작 전 이 파일 전체를 읽는다.
> 이 파일과 `architecture_research.md`, `plan.md`가 충돌하면 `plan.md`의 현재 태스크가 우선한다.

## 프로젝트 개요

- **이름**: FaceLab (페이스랩)
- **도메인**: facelab.app
- **한 줄 설명**: 사진 한 장으로 혈액형/나이/관상을 분석하는 AI 얼굴 분석 퀴즈 플랫폼
- **수익 모델**: Google AdSense
- **트래픽 전략**: 결과 공유 카드(인스타 스토리) 바이럴 + SEO
- **참고 문서**: `architecture_research.md`(아키텍처), `plan.md`(태스크 계획, 현재 진행 상태)

## 기술 스택

| 영역 | 선택 |
|---|---|
| Framework | Next.js 14, App Router, TypeScript |
| Styling | Tailwind CSS |
| UI | shadcn/ui |
| AI 추론 | TensorFlow.js — **클라이언트(브라우저)에서만 실행, 서버 전송 없음** |
| DB | Supabase (Postgres) |
| 배포 | Vercel |
| 패키지 매니저 | pnpm |

## 디자인 토큰 (변경 금지, `wireframe_main.html` 기준 확정)

```
paper:  #F5F6F2   (배경)
ink:    #12141A   (텍스트)
inkfade:#5B5F6B   (보조 텍스트)
scan:   #2D5BFF   (공용 액센트 / CTA)
blood:  #E63950   (혈액형 퀴즈 전용)
amber:  #F2A93C   (나이 측정 퀴즈 전용)
jade:   #1FA37D   (관상 퀴즈 전용)
line:   #DEDFD8   (보더)

font-display: Sora
font-body:    IBM Plex Sans KR
font-mono:    IBM Plex Mono  (카탈로그 태그, 데이터 라벨 전용)
```

시그니처 요소(뷰파인더 브라켓 + 스캔라인)는 `components/ViewfinderFrame.tsx` 하나로 관리하고 재사용한다. 임의로 새 버전 만들지 말 것.

## 코딩 컨벤션

- **지정된 파일 외 절대 건드리지 않는다.** 태스크 프롬프트에 명시된 파일만 수정.
- 파일 변경은 diff가 아니라 **완전한 파일 교체** 방식으로 작성한다.
- 새 퀴즈 추가 시 `config/quizzes/*.ts`에 config 파일만 추가 — 컴포넌트 코드 수정 금지 (플러그인 구조 유지).
- 커밋 메시지는 태스크 번호 포함: `TASK-003: 홈페이지 정적 마크업`

## 민감 파일 — 절대 커밋 금지

```
.env
.env.local
google-services.json
```

매 태스크 완료 후 커밋 전 `git status`로 위 파일이 스테이징되지 않았는지 확인한다.

## 워크플로우

1. 세션 시작 시 이 파일 + `plan.md`의 미완료 태스크 확인
2. 프롬프트에 명시된 **딱 하나의 태스크만** 수행
3. 완료 후 사용자 검증 대기 — **다음 태스크로 자동 진행하지 않는다**
4. 사용자 확인 후: `plan.md`의 해당 태스크를 `[x]`로 표시, 이 파일 하단 진행 로그 갱신
5. git commit & push

## 진행 로그

| 날짜 | 태스크 | 비고 |
|---|---|---|
| - | - | 아직 시작 전 |

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
