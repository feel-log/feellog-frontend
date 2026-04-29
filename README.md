# Feel-Log Frontend

감정에 따라 소비 결과를 분석하는 가계부 웹 애플리케이션

## 프로젝트 개요

Feel-Log는 사용자의 감정 상태를 기록하고, 해당 감정 상태에서 발생한 소비 내역을 추적하여 감정과 소비 패턴의 관계를 분석하는 웹 애플리케이션입니다.

## 기술 스택

| 항목 | 버전 | 설명 |
|------|------|------|
| **Framework** | Next.js 16.2.3 | App Router 기반 |
| **Language** | TypeScript | 타입 안전성 |
| **UI Library** | React 19.2.4 | UI 구성 |
| **Styling** | TailwindCSS 4 | Utility-first CSS |
| **상태 관리** | TanStack React Query 5.100.6 | 서버 상태 관리 |
| **Component Library** | shadcn/ui, Radix UI | 접근성 높은 컴포넌트 |
| **Carousel** | Embla Carousel | 슬라이드 컴포넌트 |
| **Icons** | Lucide React | 아이콘 라이브러리 |
| **폰트** | Pretendard 1.3.9 | 한글/영문 웹폰트 |
| **Code Formatting** | Prettier 3.8.2 | 코드 포매팅 |
| **Linting** | ESLint 9 | 코드 품질 관리 |

## 프로젝트 구조 (FSD Convention)

```
src/
├── app/                          # Next.js App Router 레이아웃 및 페이지
│   ├── page.tsx                  # 메인 페이지
│   ├── record/                   # 가계부 기록
│   ├── asset/                    # 자산 관리
│   ├── report/                   # 통계 및 분석
│   ├── retro/                    # 회고 기능
│   ├── calendar/                 # 캘린더
│   ├── login/                    # 로그인
│   └── layout.tsx                # 루트 레이아웃
├── shared/                       # 공유 코드
│   ├── ui/                       # 공유 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── PageHeader.tsx
│   │   ├── EmotionIcon.tsx
│   │   └── ...
│   ├── hooks/                    # 공유 커스텀 훅
│   ├── utils/                    # 유틸리티 함수
│   ├── api/                      # API 인스턴스 및 설정
│   ├── types/                    # 공유 타입 정의
│   ├── constants/                # 공유 상수
│   └── lib/                      # 라이브러리 설정
├── entities/                     # 비즈니스 엔티티
│   ├── user/                     # 사용자 엔티티
│   ├── emotion/                  # 감정 엔티티
│   └── spending/                 # 소비 엔티티
├── features/                     # 기능 단위
│   ├── emotionTracking/          # 감정 기록
│   └── spendingAnalysis/         # 소비 분석
└── widgets/                      # 재사용 가능한 위젯
    ├── house-hold/               # 가계부 위젯
    ├── asset/                    # 자산 위젯
    ├── report/                   # 리포트 위젯
    ├── retro/                    # 회고 위젯
    ├── calendar/                 # 캘린더 위젯
    └── ...
```

## 구현된 주요 기능

### 1. **메인 페이지** (`/`)
- 오늘의 지출 현황 표시
- 이번주 지출 내역 (탭 네비게이션)
- 날짜별 지출 내역 열람
- 회고 기능으로 이동 버튼

### 2. **가계부 기록** (`/record`)
- **수입 기록 탭**
  - 수입 금액 입력
  - 카테고리 선택 (급여, 용돈, 부수입 등)
  - 메모 입력
  
- **지출 기록 탭**
  - 지출 금액 입력
  - 카테고리 선택 (바텀시트)
  - 결제 수단 선택 (카드, 현금, 계좌, 기타)
  - 감정 선택 (긍정/부정/기타)
  - 상황 태그 / 메모
  - 날짜 선택 (캘린더 바텀시트)

### 3. **리포트 페이지** (`/report`)
- **월별 분석** (`/report/monthly`)
  - 월 선택 피커
  - 월별 지출/수입 통계
  - 카테고리별 지출 비율
  
- **카테고리 상세** (`/report/category/[categoryId]`)
  - 카테고리별 지출 내역
  - 정렬 기능 (최신순, 높은 금액, 낮은 금액)
  
- **감정 분석** (`/report/emotion/[emotionId]`)
  - 감정별 지출 분석
  - 감정과 소비 패턴 관계

### 4. **자산 관리** (`/asset`)
- 자산 추가 (`/asset/add`)
- 자산 카테고리별 분류
  - 저축, 투자, 보험, 기타
- 자산 상세 페이지 (`/asset/[category]`)
- 정렬 기능

### 5. **회고 기능** (`/retro`)
- 일일 회고 설문조사 (`/retro/survey`)
- 회고 결과 분석 (`/retro/result`)
- 감정과 지출 패턴 피드백

### 6. **기타 기능**
- 캘린더 조회 (`/calendar`)
- 데이터 내보내기 (`/export`)
- 로그인/회원가입 (`/login`)

## 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 코드 린트 확인
npm run lint
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

## 주요 개발 가이드

### Hydration 문제 대응
- 클라이언트에서만 렌더링되어야 하는 컴포넌트는 `ClientOnly.tsx` 래퍼 사용
- 날짜 기반 컴포넌트는 `HYDRATION_GUIDE.md` 참고

### 바텀시트 구현
- 공통 `BottomSheet.tsx` 컴포넌트 사용
- 카테고리, 날짜, 감정 선택 등에서 재사용

### API 연동
- `shared/api/api-instance.ts`에서 Fetch Wrapper 설정
- TanStack React Query로 서버 상태 관리
- 캐싱 전략 적용

### 스타일링
- TailwindCSS 유틸리티 클래스 사용
- `prettier-plugin-tailwindcss`로 자동 정렬
- Pretendard 폰트 기본 적용 (한글 지원)

## 최근 작업 이력

### 주요 커밋
- **e33ce4f**: API 데이터 페칭 설계 개선
- **aba6b57**: 빌드 에러 수정
- **6d2e878**: QueryProvider 구성 및 features/entities 분리
- **f2cea3c**: useClickOutside 반환 타입 수정
- **8dcec04**: 폴더 구조 정리 (FSD Convention 적용)
- **683d69c**: 리포트 디자인 업데이트
- **9dbe4a4**: 캐싱 전략 설정
- **7739887**: 공통 Fetch 래퍼 설정

### 진행 중인 작업
- [ ] 백엔드 API 통합
- [ ] 사용자 인증 시스템 완성
- [ ] 데이터 동기화

## 문서

자세한 설정 및 구현 가이드는 `docs/` 디렉토리를 참고하세요:

- `PROJECT_DESIGN.md` - 프로젝트 설계 및 기술 스택
- `HYDRATION_GUIDE.md` - Next.js Hydration 문제 해결
- `CLAUDE.md` - 개발 가이드 및 구현 체크리스트

## 팀 정보

- **프로젝트 관리자**: kotasung (cotasi135@gmail.com)
- **마지막 업데이트**: 2026-04-30

## 라이선스

Private Project
