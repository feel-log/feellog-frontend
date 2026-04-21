# Feel-Log 프로젝트 설계 문서

## 프로젝트 개요

**목표**: 감정에 따라 소비 결과를 알려주는 Free-log 웹앱

사용자의 감정 상태를 기록하고, 해당 감정 상태에서 발생한 소비 내역을 추적하여 감정과 소비 패턴의 관계를 분석하는 웹 애플리케이션입니다.

## 기술 스택

| 항목 | 선택 |
|------|------|
| **언어** | TypeScript |
| **프레임워크** | Next.js (App Router) |
| **스타일** | TailwindCSS |
| **코드 포매팅** | Prettier + ESLint |
| **개발 환경** | VS Code |

## 프로젝트 구조 (FSD Convention)

```
src/
├── app/                          # Next.js App Router 레이아웃 및 페이지
├── shared/                       # 공유 코드
│   ├── ui/                       # 공유 UI 컴포넌트
│   ├── hooks/                    # 공유 커스텀 훅
│   ├── utils/                    # 유틸리티 함수
│   ├── types/                    # 공유 타입 정의
│   └── constants/                # 공유 상수
├── entities/                     # 비즈니스 엔티티
│   ├── user/                     # 사용자 엔티티
│   │   ├── model/                # 상태 관리, 타입
│   │   └── ui/                   # UI 컴포넌트
│   ├── emotion/                  # 감정 엔티티
│   │   ├── model/
│   │   └── ui/
│   └── spending/                 # 소비 엔티티
│       ├── model/
│       └── ui/
├── features/                     # 기능 단위
│   ├── emotionTracking/          # 감정 기록 기능
│   │   ├── ui/                   # 감정 기록 UI
│   │   └── model/                # 감정 기록 로직
│   └── spendingAnalysis/         # 소비 분석 기능
│       ├── ui/                   # 분석 UI
│       └── model/                # 분석 로직
├── widgets/                      # 재사용 가능한 위젯
│   ├── header/                   # 헤더
│   └── sidebar/                  # 사이드바
└── pages/                        # 페이지 레이아웃 (필요시)
```

## 개발 환경 설정

### Prettier 설정
- `.prettierrc.json`: Prettier 포매팅 규칙
- `.prettierignore`: 포매팅 제외 파일/디렉토리
- VS Code 자동 포매팅 활성화

### VS Code 설정
- `.vscode/settings.json`: 에디터 설정 (저장시 자동 포매팅)
- `.vscode/extensions.json`: 권장 확장 프로그램
  - Prettier
  - ESLint
  - Tailwind CSS IntelliSense

### Next.js 폰트 설정

현재 프로젝트에서 사용 중인 폰트 설정:

#### 주요 폰트
- **Geist Sans**: 기본 텍스트 폰트 (영문 기반)
  - CSS 변수: `--font-geist-sans`
  - 사용처: 본문, UI 컴포넌트

- **Geist Mono**: 모노스페이스 폰트 (코드 표시용)
  - CSS 변수: `--font-geist-mono`
  - 사용처: 코드, 기술 정보 표시

#### 폰트 적용 방식
1. **Next.js `next/font/google`** 사용
   - `src/app/layout.tsx`에서 폰트 로드
   - CSS 변수로 변환하여 TailwindCSS와 연동

2. **globals.css 설정**
   ```css
   body {
     font-family: var(--font-geist-sans);
   }
   ```

3. **TailwindCSS 통합**
   - `--font-sans`: Geist Sans (기본 폰트)
   - `--font-mono`: Geist Mono (모노스페이스)
   - `--font-heading`: Geist Sans (제목 폰트)

#### Pretendard 폰트 설정 (한글 지원)

**설치 및 적용:**
1. 로컬 폰트 파일 준비
   - `public/fonts/Pretendard-1.3.9/web/static/woff2/` 디렉토리에 폰트 파일 보관

2. **layout.tsx에서 localFont로 폰트 로드**
   ```typescript
   import localFont from "next/font/local";

   const pretendard = localFont({
     src: [
       {
         path: "../../public/fonts/Pretendard-1.3.9/web/static/woff2/Pretendard-Thin.woff2",
         weight: "100",
         style: "normal",
       },
       {
         path: "../../public/fonts/Pretendard-1.3.9/web/static/woff2/Pretendard-ExtraLight.woff2",
         weight: "200",
         style: "normal",
       },
       // ... 나머지 weight 설정
       {
         path: "../../public/fonts/Pretendard-1.3.9/web/static/woff2/Pretendard-Black.woff2",
         weight: "900",
         style: "normal",
       },
     ],
     variable: "--font-pretendard",
   });
   ```

3. **HTML 클래스에 CSS 변수 추가**
   ```typescript
   <html className={`${pretendard.variable} ...`}>
   ```

4. **globals.css에서 폰트 적용**
   ```css
   body {
     font-family: var(--font-pretendard), var(--font-geist-sans), system-ui, -apple-system, sans-serif;
   }

   @theme inline {
     --font-sans: var(--font-pretendard), var(--font-geist-sans);
     --font-heading: var(--font-pretendard), var(--font-geist-sans);
   }
   ```

**폰트 우선순위:**
- 1순위: Pretendard (한글 + 영문 지원)
- 2순위: Geist Sans (영문 폴백)
- 3순위: 시스템 기본 폰트

**지원 Weight:**
- 100 (Thin)
- 200 (ExtraLight)
- 300 (Light)
- 400 (Regular)
- 500 (Medium)
- 600 (SemiBold)
- 700 (Bold)
- 800 (ExtraBold)
- 900 (Black)
