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