# Architecture Research: AI 얼굴 분석 퀴즈 플랫폼 (가칭)

> Source of Truth 문서. 모든 개발은 이 문서와 이후 작성될 `plan.md` 기준으로 진행.

## 1. 비즈니스 요약

| 항목 | 결정 |
|---|---|
| 수익 모델 | Google AdSense (트래픽 최대화) |
| MVP 범위 | 혈액형 + 나이 측정 + 관상, 3종 퀴즈 플랫폼 |
| 트래픽 소스 | 인스타/틱톡 결과 공유 바이럴 + SEO(각 퀴즈별 랜딩) |
| 브랜드 | **FaceLab (페이스랩)**, 도메인: facelab.app | nextidealab과 완전 분리, Vercel 신규 프로젝트 |
| 배포 | Vercel (신규 프로젝트로 분리 생성) |

## 2. 블로킹 액션 아이템 (착수 전 필수 확인)

- [x] 모델 소유권 확인 완료 → **본인 모델 아님 (튜토리얼 파생)**. 기존 `_M9B9ilaU` 모델은 정식 배포에서 폐기.
- [ ] **3종 모델 신규 학습 (Teachable Machine)**
  - 혈액형(A/B/O/AB): 기존 라벨 유지, 데이터셋만 재구축
  - 나이 측정: TM은 분류 모델만 지원 → 연속값 회귀 대신 **연령대 구간 분류**(10대/20대/30대/40대+ 등)로 설계
  - 관상: 라벨 체계부터 새로 설계 필요 (아래 참고)
- [ ] **관상 콘텐츠 리스크 처리**: 관상은 과학적 근거가 없는 재미 콘텐츠 → 결과 카피에 "재미로 보는 콘텐츠"임을 명시해야 AdSense 정책(오해 소지 있는 콘텐츠) 및 사용자 신뢰 문제 회피 가능
- [ ] 브랜드명 확정 (11번 참고) → 도메인 구매
- [ ] 개인정보처리방침 페이지 작성 (사진이 서버로 전송/저장되지 않는다는 점 명시 — AdSense 심사 + 사용자 신뢰 둘 다 해결)
- [ ] AddThis(서비스 종료됨), Disqus 등 레거시 서드파티 스크립트 전량 제거

## 3. 추천 기술 스택 (비용 최소화 우선)

| 영역 | 선택 | 이유 |
|---|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind + shadcn/ui | 기존 스택 재사용, SSR/ISR로 SEO 확보 |
| AI 추론 | TensorFlow.js, 브라우저 내 클라이언트 추론 | **서버 GPU 비용 0원**, 이미지가 서버로 안 가서 프라이버시 정책도 단순해짐 |
| 모델 | Teachable Machine (MobileNet 전이학습) 자체 재학습 | 라벨 확장 자유, 저작권 리스크 해소 |
| 호스팅 | Vercel (기존 인프라 재사용) | 기존 프로젝트들과 동일 워크플로우 (git push 자동배포) |
| DB | Firebase Firestore (클라이언트 SDK, write-only) | Supabase 무료 계정 한도(계정당 2개) 문제로 변경. 서버 API/서비스 계정 키 없이 브라우저에서 직접 write — 더 가벼움 |
| 공유 이미지 | Next.js OG Image API (Vercel 내장, Satori 기반) | 서버리스, 별도 렌더링 비용 없음 — 바이럴 루프 핵심 |
| 광고 | Google AdSense | 별도 서버 불필요, 스니펫만 삽입 |
| 분석 | GA4 + Vercel Analytics | 무료 |

## 4. 플러그인형 아키텍처 (다중 퀴즈 확장 대비)

새 퀴즈 추가 시 **코드 수정 없이 데이터만 추가**하는 구조로 설계:

```
/config/quizzes/
  blood-type.ts       ← { slug, title, modelUrl, labels, resultCopy, ogTemplate }
  age-estimate.ts      ← 나이 측정 (연령대 구간 분류)
  face-reading.ts      ← 관상 (재미 콘텐츠 disclaimer 포함)
```

- 공통 컴포넌트 1개(`<QuizRunner quiz={config} />`)가 업로드 → 추론 → 결과 → 공유카드 전체를 처리
- URL: `/quiz/[slug]` 동적 라우트, 신규 퀴즈는 config 파일 하나 + 모델 URL만 추가하면 끝

## 5. DB 스키마 (Firebase Firestore, 최소 구성)

```
컬렉션: quiz_results
문서 필드:
  quizSlug: string       (예: 'blood-type')
  resultLabel: string    (예: 'B형')
  createdAt: Timestamp   (서버 타임스탬프)
```

- 회원가입/로그인 불필요, 완전 익명
- 이미지 자체는 저장하지 않음 (privacy + 비용 회피)
- Firestore 보안 규칙: **create만 허용, read/update/delete는 전부 차단**
  ```
  match /quiz_results/{doc} {
    allow create: if request.resource.data.keys().hasOnly(['quizSlug', 'resultLabel', 'createdAt'])
                  && request.resource.data.quizSlug is string
                  && request.resource.data.resultLabel is string;
    allow read, update, delete: if false;
  }
  ```
  → 이렇게 하면 서버 API 라우트나 서비스 계정 키 없이 클라이언트 SDK로 바로 write 가능, 집계 확인은 Firebase Console에서만.

## 6. API/라우트 스펙

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/quiz/[slug]` | 퀴즈 페이지 (ISR, SEO 대응) |
| GET | `/api/og?quiz=&result=` | 공유용 OG 이미지 동적 생성 |

> 결과 로그는 별도 API 라우트 없이 `QuizRunner`에서 Firestore 클라이언트 SDK로 직접 write (서버/서비스 계정 키 불필요).

## 7. 수익화 설계

- 광고 배치: 결과 페이지 상단 1개 + 결과 카드 하단 반응형 1개 (과다 배치는 AdSense 정책 위반 → 승인 거절 사유)
- 승인 전 체크리스트: 개인정보처리방침 / 이용약관 / 퀴즈별 설명 콘텐츠(최소 200~300자) / About 페이지
- 트래픽 임계치 도달 전엔 심사조차 안 열릴 수 있음 → 바이럴 공유 기능(OG 카드)이 사실상 수익화의 전제조건

## 8. 3일 MVP 실행 순서 (Time-to-Market)

| Day | 작업 |
|---|---|
| 1 | 신규 Vercel 프로젝트 셋업, 브랜드 디자인 시스템 적용, 혈액형 퀴즈(재학습 모델) 포팅, 레거시 스크립트 제거 |
| 2 | 나이 측정 + 관상 퀴즈 골격 추가(플러그인 구조 검증), OG 공유카드 구현 |
| 3 | AdSense 슬롯, 개인정보처리방침/약관/About 페이지, 배포 |

> 주의: 3종 모델 학습(데이터 수집 포함)은 이 3일 일정에 포함되지 않음 — 병행 또는 선행 작업으로 별도 진행 필요.

## 9. 비용 추정

| 항목 | 비용 |
|---|---|
| Vercel Hobby | $0 (트래픽 늘면 Pro $20/mo) |
| Firebase Firestore Free | $0 |
| AdSense | 가입 무료, 수익만 발생 |
| 도메인 | nextidealab.app 서브도메인 활용 시 $0 |

## 11. 브랜드 확정

**FaceLab (페이스랩)** — 도메인: `facelab.app`

| 후보 검토 | 톤 |
|---|---|
| ~~관상연구소~~ | 전통/신뢰 (탈락) |
| ~~낯보기~~ | 순우리말 (탈락) |
| ~~AI관상소~~ | AI+전통 (탈락) |
| **페이스랩 (FaceLab)** ✅ | 모던/영어, 확장성 좋음 (혈액형/나이/관상 외 향후 퀴즈 추가 시 브랜드명 제약 없음) |

## 12. 퀴즈별 결과 생성 전략 (모델 미보유 문제의 실질적 해결)

3개 퀴즈는 문제 성격이 완전히 달라서 동일한 방식(Teachable Machine 학습)으로 접근하지 않는다.

| 퀴즈 | 방식 | 이유 |
|---|---|---|
| **혈액형** | 클라이언트 결정론적 함수 (사진 픽셀/색상 특징 → 해시 → 라벨) | 얼굴↔혈액형 간 과학적 신호가 존재하지 않음(이용약관에도 명시). Teachable Machine으로 학습해도 결국 임의 패턴 학습에 불과 → 학습 비용 들일 이유 없음. 같은 사진 = 같은 결과 보장되는 함수로 대체 |
| **나이 측정** | Teachable Machine 실제 학습, UTKFace 공개 데이터셋 기반 | 얼굴↔나이는 실제 신호가 있는 문제. 공개 데이터셋(2만장+, 무료, 라이선스 문제 없음)으로 빠르게 실질적 정확도 확보 가능 |
| **관상** | MediaPipe FaceMesh(사전학습 랜드마크 모델, 무료) + 규칙 기반 서술형 문구뱅크 | 국내 경쟁 관상 앱과 동일한 방식. 단답형(예: '온화한 상') 대신 눈/코/입/얼굴형 랜드마크 비율을 조합해 2~3문단 서술형 리포트 생성. 별도 학습 불필요 — 특징 추출은 사전학습 모델 재사용, 문구뱅크만 직접 설계 |

관상 문구뱅크(`config/face-reading-phrases.ts`)는 Claude가 카피라이팅 형태로 직접 설계하고, Antigravity는 랜드마크 추출 로직과 조합 엔진만 구현한다.

## 13. 확장 로드맵 (참고용, 지금 안 함)

- Phase 2: 일본/영어 다국어 대응으로 해외 바이럴 트래픽 확보
- Phase 3: 상세 분석 리포트 유료화(프리미엄 결과지)
