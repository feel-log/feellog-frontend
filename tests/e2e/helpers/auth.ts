import { BrowserContext, Page } from '@playwright/test';

export const setupAuth = async (context: BrowserContext) => {
  await context.addInitScript(() => {
    const tokenData = {
      state: {
        accessToken: 'test-access-token-' + Math.random().toString(36),
        refreshToken: 'test-refresh-token-' + Math.random().toString(36),
      },
      version: 0,
    };
    localStorage.setItem('token-storage', JSON.stringify(tokenData));
  });
};

export const mockAuthApis = async (page: Page) => {
  await page.route('**/api/v1/auth/refresh', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        accessToken: 'test-access-token-' + Math.random().toString(36),
        refreshToken: 'test-refresh-token-' + Math.random().toString(36),
      }),
    });
  });

  await page.route('**/api/v1/auth/**', (route) => {
    route.continue();
  });
};

export const setupAuthAndMock = async (page: Page, context: BrowserContext) => {
  await setupAuth(context);
  await mockAuthApis(page);
};
