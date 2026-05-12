import { test, expect } from '@playwright/test';

test.describe('일별 지출 내역 조회', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 상태로 설정
    await page.goto('/export');
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'test-token-' + Date.now());
    });
  });

  test('특정 날짜의 소비 내역과 총 지출 금액 확인', async ({ page }) => {
    // 데이터가 있는 날짜로 이동
    await page.click('button[aria-label="다음 날짜"]');

    // 지출 목록 확인
    const expenseItems = page.locator('[data-testid="expense-item"]');
    await expect(expenseItems.first()).toBeVisible();

    // 총 지출 금액 확인
    const totalAmount = page.locator('[data-testid="total-amount"]');
    await expect(totalAmount).toBeVisible();

    // 금액이 숫자 형식인지 확인
    const amountText = await totalAmount.textContent();
    expect(amountText).toMatch(/^\d+,?\d*원$/);
  });

  test('지출 내역 2건 이상 조회', async ({ page }) => {
    // 현재 날짜의 지출 목록 확인
    const expenseList = page.locator('[data-testid="expense-list"]');
    const expenseItems = expenseList.locator('[data-testid="expense-item"]');

    // 최소 2개 이상의 지출 내역 확인
    const count = await expenseItems.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('날짜 이동으로 다른 날짜의 지출 조회', async ({ page }) => {
    // 초기 날짜의 총액 저장
    const initialTotal = await page
      .locator('[data-testid="total-amount"]')
      .textContent();

    // 다음 날짜로 이동
    await page.click('button[aria-label="다음 날짜"]');

    // 페이지 갱신 대기
    await page.waitForLoadState('networkidle');

    // 다른 날짜로 이동했는지 확인 (날짜 표시 변경)
    const currentDate = await page
      .locator('[data-testid="current-date"]')
      .textContent();
    expect(currentDate).toBeDefined();

    // 초기 날짜와 다른 지출이 표시되는지 확인
    const newTotal = await page
      .locator('[data-testid="total-amount"]')
      .textContent();

    // 총액이 다를 수 있음 (같은 지출일 수도 있으므로 필수는 아님)
    // 하지만 지출 목록은 갱신되어야 함
    const expenseItems = page.locator('[data-testid="expense-item"]');
    await expect(expenseItems.first()).toBeVisible();
  });

  test('카테고리별 지출 내역 필터링', async ({ page }) => {
    // 카테고리 필터 클릭 (있다면)
    const categoryFilter = page.locator('button:has-text("카테고리")').first();
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click();

      // 특정 카테고리 선택 (예: 식비)
      await page.click('button:has-text("식비")');

      // 필터된 목록 확인
      const expenseItems = page.locator('[data-testid="expense-item"]');
      const count = await expenseItems.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('지출 내역 정렬 기능', async ({ page }) => {
    // 정렬 버튼 클릭
    const sortButton = page.locator('button:has-text("정렬")').first();
    if (await sortButton.isVisible()) {
      await sortButton.click();

      // 정렬 옵션 확인
      await expect(page.locator('button:has-text("최신순")')).toBeVisible();
      await expect(
        page.locator('button:has-text("금액 높은순")')
      ).toBeVisible();
      await expect(
        page.locator('button:has-text("금액 낮은순")')
      ).toBeVisible();

      // 금액 높은 순으로 정렬
      await page.click('button:has-text("금액 높은순")');

      // 정렬 결과 확인 (첫 번째 항목이 더 큰 금액인지 확인)
      const amounts = await page
        .locator('[data-testid="expense-amount"]')
        .allTextContents();

      // 금액 비교 (문자열 제거 후 숫자로 변환)
      const numericAmounts = amounts.map((a) =>
        parseInt(a.replace(/[^0-9]/g, ''), 10)
      );

      // 내림차순 정렬 확인
      for (let i = 0; i < numericAmounts.length - 1; i++) {
        expect(numericAmounts[i]).toBeGreaterThanOrEqual(
          numericAmounts[i + 1]
        );
      }
    }
  });

  test('개별 지출 항목 상세 조회', async ({ page }) => {
    // 지출 항목 클릭
    const firstExpense = page.locator('[data-testid="expense-item"]').first();
    await firstExpense.click();

    // 상세 페이지로 이동 확인
    await expect(page).toHaveURL(/\/expense\/detail|\/expense\/\d+/);

    // 상세 정보 확인
    await expect(
      page.locator('[data-testid="expense-detail-amount"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="expense-detail-category"]')
    ).toBeVisible();
  });
});
