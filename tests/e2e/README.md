# E2E 테스트 가이드

## 개요

이 디렉토리는 Playwright를 사용한 End-to-End 테스트를 포함합니다. CLAUDE.md의 E2E 테스트 설정 요구사항에 따라 구성되었습니다.

## 테스트 시나리오

### 1. 공통 / 오류 대응 (`common-error-handling.spec.ts`)
- ✅ 필수 입력 누락 시 에러 메시지 표시
- ✅ 저장 버튼 중복 클릭 방지
- ✅ 네트워크 오류 발생 시 재시도 옵션 제공
- ✅ 빈 상태(No Data) 표시
- ✅ 로딩 상태 표시
- ✅ 권한 / 로그인 정책 점검
- ✅ 세션 만료 처리

### 2. 일별 지출 내역 조회 (`daily-expense-inquiry.spec.ts`)
- ✅ 특정 날짜의 소비 내역과 총 지출 금액 확인
- ✅ 지출 내역 2건 이상 조회
- ✅ 날짜 이동으로 다른 날짜의 지출 조회
- ✅ 카테고리별 지출 내역 필터링
- ✅ 지출 내역 정렬 기능 (최신순, 금액 높은순, 금액 낮은순)
- ✅ 개별 지출 항목 상세 조회

### 3. 지출 기록 등록 (`expense-record-registration.spec.ts`)
- ✅ 기본 지출 정보 입력 및 저장
- ✅ 날짜 선택 바텀시트를 통한 지출 날짜 변경
- ✅ 카테고리 선택 바텀시트
- ✅ 감정 태그 선택
- ✅ 상황 태그 및 메모 입력
- ✅ 결제 수단 선택 (카드, 현금, 계좌, 기타)
- ✅ 지출 기록 저장 후 목록에 반영
- ✅ 선택적 필드 없이 최소 필수 정보만으로 저장
- ✅ 바텀시트 외부 클릭으로 닫기

### 4. 월별 소비 리포트 조회 & 회고 설문 (`monthly-report-and-review.spec.ts`)
- ✅ 월별 소비 흐름을 카테고리 기준으로 확인
- ✅ 월별 총 지출 확인
- ✅ 감정 기준 월별 소비 흐름 확인
- ✅ 월 선택으로 다른 월 리포트 조회
- ✅ 소비 회고 시작 - 하루 소비 요약 확인
- ✅ 회고 설문 항목 응답 (만족도, 내일 소비 의도)
- ✅ 회고 설문 제출 후 결과 피드백 확인
- ✅ 회고 설문 결과 유형별 피드백 제공
- ✅ 소비 데이터, 상황/감정 태그, 설문 응답 조합한 결과 제공

## 설정 및 실행

### 필수 의존성

```bash
npm install --save-dev @playwright/test
```

### 테스트 실행

```bash
# 모든 E2E 테스트 실행
npm run test:e2e

# UI 모드로 실행 (시각적으로 테스트 진행 상황 확인)
npm run test:e2e:ui

# 디버그 모드로 실행
npm run test:e2e:debug

# 브라우저 창으로 실행 (headless 모드 비활성화)
npm run test:e2e:headed

# 테스트 리포트 확인
npm run test:e2e:report
```

### 특정 파일만 테스트

```bash
# 특정 테스트 스펙 파일 실행
npx playwright test common-error-handling.spec.ts

# 특정 테스트만 실행
npx playwright test --grep "필수 입력 누락"

# 특정 브라우저로 테스트
npx playwright test --project=chromium
npx playwright test --project="Mobile Chrome"
```

## 프로젝트 설정

`playwright.config.ts`에는 다음이 포함됩니다:

- **기본 URL**: `http://localhost:3000`
- **Web Server**: 자동으로 `npm run dev` 실행
- **Reporters**: HTML, JSON, List 형식 리포트
- **Screenshots**: 테스트 실패 시만 캡처
- **Videos**: 테스트 실패 시만 저장
- **Browsers**: Chromium, Firefox, WebKit
- **Devices**: Desktop Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari

## 환경 설정

### 개발 환경에서 실행

```bash
npm run dev  # 터미널 1
npm run test:e2e:ui  # 터미널 2
```

### CI 환경에서 실행

CI 환경에서는 `playwright.config.ts`가 자동으로:
- Headless 모드 사용
- 재시도 횟수 증가 (2회)
- 단일 워커 사용

## 테스트 작성 가이드

### 기본 구조

```typescript
import { test, expect } from '@playwright/test';

test.describe('기능 설명', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전 실행
    await page.goto('/');
  });

  test('테스트 이름', async ({ page }) => {
    // 테스트 코드
    await page.click('button');
    await expect(page.locator('text')).toBeVisible();
  });
});
```

### Helper 함수 사용

```typescript
import { fillExpenseForm, saveExpense } from './utils/helpers';

test('지출 기록 저장', async ({ page }) => {
  await page.goto('/expense/new');
  
  await fillExpenseForm(page, {
    amount: '10000',
    category: '식비',
    memo: '점심 식사'
  });
  
  await saveExpense(page);
});
```

## Selectors 전략

테스트의 안정성을 위해 다음과 같은 선택자를 우선적으로 사용합니다:

1. **`data-testid`**: `data-testid="expense-item"`
2. **`aria-label`**: `button[aria-label="저장"]`
3. **`role`**: `button[role="button"]`
4. **`placeholder`**: `input[placeholder="금액"]`
5. **텍스트 콘텐츠**: `button:has-text("저장")`

## 트러블슈팅

### 테스트가 타임아웃되는 경우

```typescript
// 타임아웃 증가
await page.click('button', { timeout: 10000 });

// 또는 waitForLoadState 추가
await page.waitForLoadState('networkidle');
```

### 선택자를 찾을 수 없는 경우

```typescript
// 실제 DOM 구조 확인
npx playwright test --debug

// 또는 --headed 모드로 실행하면서 브라우저 개발자 도구 사용
npm run test:e2e:headed
```

### 네트워크 요청 관련 오류

```typescript
// 특정 요청 대기
await page.waitForResponse(response => response.url().includes('/api/expense'));

// 모든 네트워크 로드 완료 대기
await page.waitForLoadState('networkidle');
```

## CI/CD 통합

GitHub Actions에서 사용 예시:

```yaml
- name: Run E2E tests
  run: npm run test:e2e
  
- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## 추가 문서

- [Playwright 공식 문서](https://playwright.dev)
- [프로젝트 CLAUDE.md](../../CLAUDE.md)
- [Hydration 가이드](../../docs/HYDRATION_GUIDE.md)
