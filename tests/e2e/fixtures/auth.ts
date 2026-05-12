import { test as base, Page, expect } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // 로그인 페이지로 이동
    await page.goto('/');

    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('domcontentloaded');

    // 토큰이 필요한 경우 localStorage에 저장
    // 테스트 환경에서는 mock 토큰 사용
    await page.evaluate(() => {
      localStorage.setItem(
        'authToken',
        'test-token-' + Date.now()
      );
    });

    await use(page);

    // cleanup
    await page.evaluate(() => {
      localStorage.removeItem('authToken');
    });
  },
});

export { expect };