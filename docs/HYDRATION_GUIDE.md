# Next.js Hydration 문제 해결 가이드

이 문서는 Feel-Log 프로젝트에서 Next.js의 **Hydration 문제를 근본적으로 해결**하는 방법을 설명합니다.

## 목차

1. [Hydration이란?](#hydration이란)
2. [문제 상황](#문제-상황)
3. [해결 전략](#해결-전략)
4. [구현 패턴](#구현-패턴)
5. [체크리스트](#체크리스트)

---

## Hydration이란?

### 개념

Hydration은 서버에서 렌더링된 정적 HTML에 React가 JavaScript를 "주입"하여 인터랙티브한 애플리케이션으로 만드는 과정입니다.

```
서버 렌더링(SSR) → 정적 HTML 전송 → 클라이언트에서 Hydration → 인터랙티브 앱
```

### 핵심 원칙

**서버와 클라이언트는 항상 동일한 초기 렌더링 결과를 생성해야 합니다.**

---

## 문제 상황

### 1. 서버와 클라이언트 렌더링 불일치

```typescript
// ❌ 잘못된 예시
export default function BadComponent() {
  // typeof window는 서버에서 'undefined', 클라이언트에서 'object'
  return <div>{typeof window !== 'undefined' && <p>클라이언트만 표시</p>}</div>;
}
```

### 2. 날짜/시간 문제

```typescript
// ❌ 잘못된 예시 - 서버와 클라이언트의 시간이 다를 수 있음
export default function BadTime() {
  return <div>{new Date().toLocaleString()}</div>;
}
```

### 3. 랜덤 값 사용

```typescript
// ❌ 잘못된 예시
export default function BadRandom() {
  return <div id={Math.random().toString()}>Random ID</div>;
}
```

### 4. 브라우저 API 직접 사용

```typescript
// ❌ 잘못된 예시
export default function BadBrowser() {
  const width = window.innerWidth; // 서버에서 window 없음
  return <div>Width: {width}</div>;
}
```

---

## 해결 전략

### 전략 1: `useIsMounted` 훅 사용 (권장)

서버와 클라이언트가 동일한 초기 렌더링을 하고, 클라이언트에서만 상태를 업데이트합니다.

```typescript
'use client';

import { useIsMounted } from '@/shared/hooks';

export default function SafeComponent() {
  const isMounted = useIsMounted();

  // 서버/첫 클라이언트: false 렌더링
  if (!isMounted) {
    return <div>로딩 중...</div>;
  }

  // 클라이언트 마운트 후: 실제 콘텐츠 렌더링
  return <div>창 너비: {window.innerWidth}px</div>;
}
```

### 전략 2: `ClientOnly` 컴포넌트 사용

클라이언트 전용 컴포넌트를 간단하게 래핑합니다.

```typescript
'use client';

import { ClientOnly } from '@/shared/ui';

export default function Page() {
  return (
    <div>
      <h1>서버에서도 렌더링됨</h1>
      <ClientOnly fallback={<Skeleton />}>
        <BrowserDependentComponent />
      </ClientOnly>
    </div>
  );
}
```

### 전략 3: `useFormattedDate` 훅 사용

타임존 안전한 날짜 포맷팅:

```typescript
'use client';

import { useFormattedDate } from '@/shared/hooks';

export default function EventDetails({ timestamp }: { timestamp: string }) {
  // 서버에서는 ISO 문자열 반환, 클라이언트에서만 로컬 포맷
  const displayDate = useFormattedDate(timestamp, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return <time dateTime={timestamp}>{displayDate}</time>;
}
```

### 전략 4: `useLocalStorage` 훅 사용

안전한 로컬스토리지 접근:

```typescript
'use client';

import { useLocalStorage } from '@/shared/hooks';

export default function UserPreferences() {
  const [theme, setTheme, isLoaded] = useLocalStorage('theme', 'light');

  if (!isLoaded) {
    return <div>로딩 중...</div>;
  }

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      현재 테마: {theme}
    </button>
  );
}
```

### 전략 5: `suppressHydrationWarning` 올바른 사용

⚠️ **주의**: 이것은 근본적인 해결책이 아닙니다. 다크모드나 테마 스크립트 등 **외부에서 속성을 수정하는 경우만** 사용합니다.

```typescript
// ✓ 올바른 사용 - 외부 다크모드 스크립트가 className 변경
export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
```

```typescript
// ❌ 잘못된 사용 - suppressHydrationWarning으로 근본 문제를 숨기려는 경우
export default function BadUsage() {
  return (
    <div suppressHydrationWarning>
      {typeof window !== 'undefined' && <p>클라이언트만 표시</p>}
    </div>
  );
}
```

---

## 구현 패턴

### 패턴 1: 감정 기록 컴포넌트

```typescript
'use client';

import { useFormattedDate } from '@/shared/hooks';

interface EmotionLogProps {
  id: string;
  emotion: string;
  timestamp: string;
  note?: string;
}

export function EmotionLog({ emotion, timestamp, note }: EmotionLogProps) {
  // 서버-클라이언트 안전한 날짜 포맷팅
  const displayDate = useFormattedDate(timestamp, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{emotion}</span>
        <time dateTime={timestamp} className="text-sm text-gray-500">
          {displayDate}
        </time>
      </div>
      {note && <p className="mt-2 text-gray-700">{note}</p>}
    </div>
  );
}
```

### 패턴 2: 사용자 설정 컴포넌트

```typescript
'use client';

import { useLocalStorage } from '@/shared/hooks';
import { ClientOnly } from '@/shared/ui';

export function UserSettings() {
  const [notifications, setNotifications, isLoaded] = useLocalStorage(
    'notifications_enabled',
    true
  );

  return (
    <ClientOnly fallback={<div>로딩 중...</div>}>
      <div className="p-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={notifications && isLoaded}
            onChange={(e) => setNotifications(e.target.checked)}
          />
          <span>알림 활성화</span>
        </label>
      </div>
    </ClientOnly>
  );
}
```

### 패턴 3: 차트 컴포넌트 (동적 로드)

```typescript
'use client';

import dynamic from 'next/dynamic';
import { useIsMounted } from '@/shared/hooks';

// 차트 라이브러리는 동적으로 로드 (SSR 비활성화)
const Chart = dynamic(() => import('chart-library'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
  ),
});

export function SpendingChart({ data }: { data: any[] }) {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return <div className="h-64 bg-gray-100 rounded-lg" />;
  }

  return <Chart data={data} />;
}
```

---

## 체크리스트

개발 시 다음을 확인하세요:

### 렌더링 일관성

- [ ] 초기 렌더링 결과가 서버와 클라이언트에서 동일한가?
- [ ] `window`, `document` 등 브라우저 API를 직접 사용하지 않았는가?
- [ ] `new Date()`, `Math.random()` 등 동적 값을 직접 렌더링하지 않았는가?

### 훅과 유틸 사용

- [ ] 클라이언트 전용 로직은 `useEffect` 내에 있는가?
- [ ] 날짜는 `useFormattedDate` 훅을 사용하고 있는가?
- [ ] 로컬스토리지는 `useLocalStorage` 훅으로 접근하는가?
- [ ] 브라우저 API가 필요한 부분은 `ClientOnly`로 감싸져 있는가?

### suppressHydrationWarning 사용

- [ ] `suppressHydrationWarning`이 정말 필요한가?
- [ ] 외부 스크립트가 속성을 수정하는 경우에만 사용했는가?
- [ ] 근본적인 불일치를 숨기는 용도로 사용하지 않았는가?

### 성능

- [ ] 무거운 라이브러리를 동적으로 로드하고 있는가? (`dynamic()`)
- [ ] 불필요한 `ClientOnly`로 감싼 컴포넌트는 없는가?
- [ ] 로딩 상태(fallback)를 제공했는가?

---

## 디버깅

### Hydration 오류 확인

개발 중에 콘솔에서 다음과 같은 오류가 보이면 Hydration 문제입니다:

```
Warning: Text content did not match. Server: "..." Client: "..."
Warning: Did not expect server HTML to contain a <...> in a <...>.
```

### 해결 과정

1. 오류 메시지에서 어느 컴포넌트인지 파악
2. 해당 컴포넌트에서 서버-클라이언트 불일치 지점 찾기
3. 위의 **해결 전략** 중 적절한 방법 적용
4. 개발 서버에서 경고 메시지 확인

### React DevTools 디버깅

- React DevTools의 "Highlight updates" 기능으로 불필요한 리렌더링 확인
- Component tree에서 서버/클라이언트 불일치 지점 파악

---

## 참고 자료

- [Next.js 공식: Hydration Mismatch](https://nextjs.org/docs/messages/hydration-mismatch)
- [React 공식: useEffect](https://react.dev/reference/react/useEffect)
- [Next.js 공식: Dynamic Imports](https://nextjs.org/docs/advanced-features/dynamic-import)

---

## 프로젝트 구조

```
src/
├── shared/
│   ├── hooks/
│   │   ├── useIsMounted.ts          # 마운트 상태 확인
│   │   ├── useFormattedDate.ts      # 안전한 날짜 포맷팅
│   │   ├── useLocalStorage.ts       # 안전한 로컬스토리지
│   │   └── index.ts
│   ├── ui/
│   │   ├── ClientOnly.tsx           # 클라이언트 전용 래퍼
│   │   └── index.ts
│   └── utils/
│       ├── date.ts                  # 날짜 유틸리티
│       └── index.ts
└── app/
    ├── layout.tsx                   # suppressHydrationWarning 적용
    ├── page.tsx                      # 'use client' 지시어 사용
    └── globals.css
```

---

## 최종 원칙

1. **서버-클라이언트 일관성**: 서버와 클라이언트는 동일하게 렌더링
2. **동적 로직은 클라이언트**: `useEffect`나 `ClientOnly`에서 처리
3. **안전한 유틸 사용**: 제공된 훅과 유틸리티 함수 활용
4. **외부 수정은 명시**: `suppressHydrationWarning`은 최후의 수단

이 가이드를 따르면 Hydration 문제 없이 안정적인 SSR 애플리케이션을 구축할 수 있습니다.
