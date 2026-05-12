import { Page } from '@playwright/test';

export async function login(page: Page, email: string = 'test@example.com', password: string = 'test123456') {
  await page.goto('/login');
  await page.fill('input[name="email"], input[type="email"]', email);
  await page.fill('input[name="password"], input[type="password"]', password);
  await page.click('button:has-text("로그인"), button[type="submit"]');
  await page.waitForLoadState('networkidle');
}

export async function logout(page: Page) {
  const menuButton = page.locator('button[aria-label="메뉴"], button:has-text("메뉴")').first();
  if (await menuButton.isVisible()) {
    await menuButton.click();
  }

  const logoutButton = page.locator('button:has-text("로그아웃")').first();
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
  }

  await page.waitForLoadState('networkidle');
}

export async function fillExpenseForm(page: Page, data: {
  amount: string;
  category?: string;
  date?: string;
  paymentMethod?: string;
  emotion?: string;
  memo?: string;
}) {
  // 금액 입력
  await page.fill('input[name="amount"], input[placeholder*="금액"]', data.amount);

  // 카테고리 선택
  if (data.category) {
    await page.click('button:has-text("카테고리")');
    await page.click(`button:has-text("${data.category}")`);
  }

  // 날짜 선택
  if (data.date) {
    await page.click('button[aria-label*="날짜"], button:has-text("날짜")');
    const dateButton = page.locator(`button:has-text("${data.date}")`).first();
    if (await dateButton.isVisible()) {
      await dateButton.click();
    }
  }

  // 결제 수단 선택
  if (data.paymentMethod) {
    const paymentButton = page.locator('button:has-text("결제수단"), button:has-text("결제")').first();
    if (await paymentButton.isVisible()) {
      await paymentButton.click();
      await page.click(`button:has-text("${data.paymentMethod}")`);
    }
  }

  // 감정 선택
  if (data.emotion) {
    const emotionButton = page.locator('button:has-text("감정")').first();
    if (await emotionButton.isVisible()) {
      await emotionButton.click();
      await page.click(`button:has-text("${data.emotion}")`);
    }
  }

  // 메모 입력
  if (data.memo) {
    const memoInput = page.locator('textarea[name="memo"], input[placeholder*="메모"]').first();
    if (await memoInput.isVisible()) {
      await memoInput.fill(data.memo);
    }
  }
}

export async function saveExpense(page: Page) {
  await page.click('button:has-text("저장")');
  await page.waitForLoadState('networkidle');
}

export async function navigateToDailyExpense(page: Page) {
  await page.locator('button:has-text("오늘의 지출"), a[href*="/expense/daily"]').first().click();
  await page.waitForLoadState('networkidle');
}

export async function getExpenseAmount(text: string): number {
  const match = text.match(/(\d+),?(\d+)?/);
  if (match) {
    const amount = match[1] + (match[2] || '');
    return parseInt(amount, 10);
  }
  return 0;
}

export async function waitForNetworkIdle(page: Page, timeout = 5000) {
  await page.waitForLoadState('networkidle');
}
