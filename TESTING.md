# 테스트 가이드

이 문서는 feel-log-front 프로젝트의 테스트 환경 설정 및 실행 방법을 설명합니다.

## 목차

1. [E2E 테스트](#e2e-테스트)
2. [단위 테스트](#단위-테스트)
3. [테스트 작성 가이드](#테스트-작성-가이드)

## E2E 테스트

### 설치

```bash
# npm 의존성 설치
npm install

# Playwright 브라우저 설치 (처음 한 번만)
npx playwright install
```

### 실행

```bash
# 개발 서버 시작
npm run dev

# 다른 터미널에서 E2E 테스트 실행
npm run test:e2e
```

### 여러 실행 모드

```bash
# UI 모드 (권장 - 시각적으로 테스트 확인)
npm run test:e2e:ui

# 디버그 모드 (Inspector 포함)
npm run test:e2e:debug

# 브라우저 화면 보기
npm run test:e2e:headed

# HTML 리포트 보기
npm run test:e2e:report
```

### 특정 테스트만 실행

```bash
# 특정 파일 실행
npx playwright test tests/e2e/common-error-handling.spec.ts

# 특정 테스트 실행 (이름으로 검색)
npx playwright test --grep "필수 입력"

# 특정 브라우저에서만 실행
npx playwright test --project=chromium
npx playwright test --project="Mobile Chrome"

# 마지막 실패한 테스트만 실행
npx playwright test --last-failed
```

### 테스트 구조

```
tests/
├── e2e/
│   ├── common-error-handling.spec.ts       # 공통 오류 대응
│   ├── daily-expense-inquiry.spec.ts       # 일별 지출 내역 조회
│   ├── expense-record-registration.spec.ts # 지출 기록 등록
│   ├── monthly-report-and-review.spec.ts   # 월별 리포트 & 회고
│   ├── fixtures/
│   │   └── auth.ts                         # 인증 관련 fixture
│   ├── utils/
│   │   └── helpers.ts                      # 테스트 헬퍼 함수
│   ├── .env.example                        # 환경 변수 예시
│   └── README.md                           # E2E 테스트 문서
├── playwright.config.ts                    # Playwright 설정
└── TESTING.md                              # 이 파일
```

### CI 환경에서 실행

GitHub Actions 예시:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Build app
        run: npm run build
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## 테스트 작성 가이드

### 새로운 E2E 테스트 작성

1. **파일 생성**: `tests/e2e/` 디렉토리에 `*.spec.ts` 파일 생성

```typescript
import { test, expect } from '@playwright/test';

test.describe('기능 설명', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전 실행
    await page.goto('/');
    // 로그인 등
  });

  test('테스트 설명', async ({ page }) => {
    // 테스트 코드
    await page.click('button');
    await expect(page.locator('text')).toBeVisible();
  });
});
```

2. **헬퍼 함수 사용**:

```typescript
import { fillExpenseForm, saveExpense } from './utils/helpers';

test('지출 저장', async ({ page }) => {
  await page.goto('/expense/new');
  
  await fillExpenseForm(page, {
    amount: '10000',
    category: '식비',
    memo: '점심'
  });
  
  await saveExpense(page);
  await expect(page).toHaveURL(/\/household/);
});
```

3. **Selector 우선순위**:
   - `data-testid` 속성
   - `aria-label` 속성
   - `role` 속성
   - `placeholder` 속성
   - 텍스트 콘텐츠

### 테스트 작성 팁

#### 1. 대기 전략

```typescript
// 네트워크 완료 대기
await page.waitForLoadState('networkidle');

// 특정 요청 대기
await page.waitForResponse(response => 
  response.url().includes('/api/expense')
);

// 요소 표시 대기
await expect(page.locator('selector')).toBeVisible();

// 스피너 사라짐 대기
await page.locator('.spinner').waitFor({ state: 'hidden' });
```

#### 2. 오류 처리

```typescript
test('에러 메시지 확인', async ({ page }) => {
  // 에러 유발
  await page.fill('input', ''); // 빈 입력
  await page.click('button:has-text("저장")');

  // 에러 메시지 확인
  const error = page.locator('[role="alert"]');
  await expect(error).toBeVisible();
  await expect(error).toContainText('필수');
});
```

#### 3. 모바일 테스트

```typescript
// playwright.config.ts에 이미 Mobile Chrome, Mobile Safari 포함됨
// 모바일 뷰포트에서만 테스트:
test('모바일 지출 기록', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  // ...
});
```

#### 4. 스크린샷 및 비디오

```typescript
test('스크린샷 저장', async ({ page }) => {
  await page.screenshot({ path: 'screenshot.png' });
  // playwright.config.ts에서 자동 스크린샷 설정 가능
});
```

## 단위 테스트

프로젝트는 Vitest를 사용합니다 (Storybook과 통합).

```bash
# 현재는 Storybook 테스트만 설정됨
npm run test  # vitest 실행
```

Storybook 컴포넌트 테스트는 `.storybook/` 폴더에서 관리됩니다.

## 문제 해결

### 테스트 타임아웃

```typescript
// 전역 타임아웃 증가 (playwright.config.ts)
timeout: 60000,

// 또는 개별 테스트에서
test('slow test', async ({ page }) => {
  // ...
}, { timeout: 60000 });
```

### Selector 찾지 못함

```bash
# 디버그 모드로 실행하면서 DOM 확인
npm run test:e2e:debug

# 또는 headless 모드 비활성화
npm run test:e2e:headed
```

### 플로키한 테스트 (Flaky Tests)

```typescript
// 재시도 설정
test('flaky test', async ({ page }) => {
  // ...
}, { retries: 2 });

// 또는 명시적 대기 추가
await page.waitForLoadState('networkidle');
```

## 참고 자료

- [Playwright 공식 문서](https://playwright.dev)
- [테스트 Best Practices](https://playwright.dev/docs/best-practices)
- [Project CLAUDE.md](./CLAUDE.md) - 프로젝트 요구사항
- [tests/e2e/README.md](./tests/e2e/README.md) - E2E 테스트 상세 가이드

## 다음 단계

1. ✅ E2E 테스트 환경 구축 완료
2. 🔄 실제 UI에 `data-testid` 속성 추가
3. 🔄 Mock API 서버 설정 (필요시)
4. 🔄 CI/CD 파이프라인 통합
5. 🔄 테스트 커버리지 모니터링
