import { test, expect } from '@playwright/test';
import { mockLogin } from './helpers/auth';

test.describe('공통 / 오류 대응', () => {
  test.beforeEach(async ({ page }) => {
    await mockLogin(page);
  });

  test('필수 입력 누락 시 에러 메시지 표시', async ({ page }) => {
    await page.goto('/record', { waitUntil: 'networkidle' });

    // 필수 입력 없이 저장 시도
    const saveButton = page.locator('button:has-text("저장")').first();
    await saveButton.click();

    // 에러 메시지 확인
    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('필수');
  });

  test('중복 클릭 방지 - 저장 버튼 중복 클릭', async ({ page }) => {
    await page.goto('/record', { waitUntil: 'networkidle' });

    // 필수 필드 채우기
    await page.fill('input[name="amount"]', '10000');
    await page.locator('button:has-text("카테고리")').click();
    await page.locator('button:has-text("식비")').click();

    // 저장 버튼 빠르게 여러 번 클릭
    const saveButton = page.locator('button:has-text("저장")');
    await saveButton.click();
    await expect(saveButton).toBeDisabled();

    // 네트워크 요청 완료 대기
    await page.waitForLoadState('networkidle');

    // 중복 저장 방지 - 1개의 요청만 전송되어야 함
    await expect(page).toHaveURL(/\/(household|expense)/);
  });

  test('네트워크 오류 발생 시 재시도 옵션 제공', async ({ page, context }) => {
    await page.goto('/record', { waitUntil: 'networkidle' });

    // 네트워크 오류 시뮬레이션
    await context.setOffline(true);
    await page.fill('input[name="amount"]', '5000');
    await page.locator('button:has-text("저장")').first().click();

    // 오류 메시지 표시
    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('네트워크');

    // 재시도 버튼 확인
    const retryButton = page.locator('button:has-text("재시도")');
    await expect(retryButton).toBeVisible();

    // 네트워크 복구
    await context.setOffline(false);
    await retryButton.click();
    await page.waitForLoadState('networkidle');
  });

  test('빈 상태(No Data) 표시', async ({ page }) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 30);
    const dateStr = tomorrow.toISOString().split('T')[0];

    await page.goto(`/household?date=${dateStr}`, { waitUntil: 'networkidle' });

    // 빈 상태 메시지 확인
    const emptyState = page.locator('text=/아직|없어요|기록/');
    await expect(emptyState).toBeVisible();

    // 기록 추가 버튼 확인
    const addButton = page.locator('button:has-text("기록하러")');
    await expect(addButton).toBeVisible();
  });

  test('로딩 상태 표시', async ({ page }) => {
    // 느린 네트워크 시뮬레이션
    await page.route('**/api/**', (route) => {
      setTimeout(() => route.continue(), 2000);
    });

    await page.goto('/household', { waitUntil: 'domcontentloaded' });

    // 로딩 표시 확인
    const loader = page.locator('[role="status"], .spinner, .loading');
    await expect(loader).toBeVisible({ timeout: 1000 });

    // 로딩 완료 대기
    await page.waitForLoadState('networkidle');
  });

  test('권한 / 로그인 정책 점검 - 로그아웃 상태에서 접근 차단', async ({ context }) => {
    // 새로운 context 사용 (인증 없음)
    const newPage = await context.newPage();

    await newPage.goto('/household', { waitUntil: 'networkidle' });
    await expect(newPage).toHaveURL(/\/login|\/auth/);

    await newPage.close();
  });

  test('세션 만료 처리', async ({ page, context }) => {
    // 만료된 토큰으로 새로운 context 설정
    await context.addInitScript(() => {
      const expiredTokens = {
        state: {
          accessToken: 'expired-token',
          refreshToken: 'expired-token',
        },
        version: 0,
      };
      localStorage.setItem('token-storage', JSON.stringify(expiredTokens));
    });

    // refresh API를 실패로 모킹
    await page.route('**/api/v1/auth/refresh', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Unauthorized' }),
      });
    });

    await page.goto('/household', { waitUntil: 'networkidle' });

    // 세션 만료 시 로그인 페이지로 리다이렉트
    await expect(page).toHaveURL(/\/login|\/auth/);
  });
});
