import { Page, BrowserContext } from '@playwright/test';

interface MockUserData {
  id?: number;
  email?: string;
  nickname?: string;
  birthDay?: string | null;
  gender?: string | null;
}

interface MockTokenData {
  accessToken?: string;
  refreshToken?: string;
}

export async function mockLogin(
  pageOrContext: Page | BrowserContext,
  userData: MockUserData = {},
  tokenData: MockTokenData = {}
) {
  const defaultUser = {
    id: 1,
    email: 'test@test.com',
    nickname: 'test_user',
    birthDay: null,
    gender: null,
  };

  const defaultTokens = {
    accessToken: 'mocked-access-token',
    refreshToken: 'mocked-refresh-token',
  };

  const user = { ...defaultUser, ...userData };
  const tokens = { ...defaultTokens, ...tokenData };

  await pageOrContext.addInitScript(({ user, tokens }) => {
    localStorage.setItem(
      'token-storage',
      JSON.stringify({
        state: tokens,
      })
    );

    localStorage.setItem(
      'user-storage',
      JSON.stringify({
        state: user,
      })
    );
  }, { user, tokens });
}

export async function mockLogout(pageOrContext: Page | BrowserContext) {
  await pageOrContext.addInitScript(() => {
    localStorage.removeItem('token-storage');
    localStorage.removeItem('user-storage');
  });
}
