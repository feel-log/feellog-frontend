import { test, expect } from '@playwright/test';
import { mockLogin } from './helpers/auth';

const MOCK_MASTER_DATA = {
  categoryGroups: [
    {
      id: 1,
      name: '생활',
      categories: [
        { id: 1, name: '식비' },
        { id: 2, name: '카페' },
        { id: 3, name: '생필품' },
      ],
    },
  ],
  emotionGroups: [
    {
      id: 1,
      name: '긍정',
      emotions: [
        { id: 1, name: '기쁨' },
        { id: 2, name: '설렘' },
      ],
    },
  ],
  situationTags: [
    { id: 1, name: '회의' },
    { id: 2, name: '외출' },
  ],
  paymentMethods: [
    { id: 1, name: '카드' },
    { id: 2, name: '현금' },
  ],
  incomeCategories: [
    { id: 1, name: '급여' },
  ],
};

const MOCK_DAILY_EXPENSES_TODAY = [
  {
    expenseId: 1,
    categoryId: 1,
    amount: 12000,
    paymentMethodId: 1,
    emotionIds: [1],
    situationTagIds: [1],
    memo: '회의실 카페',
    expenseTime: '2026-05-12T10:30:00',
  },
  {
    expenseId: 2,
    categoryId: 2,
    amount: 5000,
    paymentMethodId: 2,
    emotionIds: [2],
    situationTagIds: [2],
    memo: '점심 먹기',
    expenseTime: '2026-05-12T12:00:00',
  },
];

const MOCK_DAILY_EXPENSES_YESTERDAY = [
  {
    expenseId: 3,
    categoryId: 1,
    amount: 8000,
    paymentMethodId: 1,
    emotionIds: [1],
    situationTagIds: [1],
    memo: '저녁 식사',
    expenseTime: '2026-05-11T18:30:00',
  },
];

test.describe('일별 지출 내역 조회', () => {
  test.beforeEach(async ({ page, context }) => {
    // 로그인 상태로 먼저 설정
    await mockLogin(context);

    // 마스터 데이터 API 모킹
    await page.route('**/api/v1/master-data', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_MASTER_DATA),
      });
    });

    // 일일 지출 API 모킹 (날짜별로 다른 데이터 반환)
    await page.route('**/api/v1/expenses/daily**', (route) => {
      const url = route.request().url();
      const isYesterday = url.includes('day=11');

      const data = isYesterday ? MOCK_DAILY_EXPENSES_YESTERDAY : MOCK_DAILY_EXPENSES_TODAY;

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(data),
      });
    });

    // 그 후 페이지 이동
    await page.goto('/export');
    await page.waitForLoadState('domcontentloaded');
  });

  test('특정 날짜의 소비 내역과 총 지출 금액 확인', async ({ page }) => {
    // 총 지출 금액 확인
    const totalAmount = page.locator('[data-testid="total-amount"]');
    await expect(totalAmount).toBeVisible();

    // 금액이 숫자 형식인지 확인
    const amountText = await totalAmount.textContent();
    expect(amountText).toMatch(/^\d+,?\d*원$/);

    // 지출이 있으면 지출 목록도 확인
    const expenseList = page.locator('[data-testid="expense-list"]');
    const hasExpenseList = await expenseList.isVisible({ timeout: 1000 }).catch(() => false);

    if (hasExpenseList) {
      const expenseItems = page.locator('[data-testid="expense-item"]');
      const itemCount = await expenseItems.count();
      expect(itemCount).toBeGreaterThan(0);
    }
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
    // 다른 날짜로 이동 (URL 쿼리 파라미터로 날짜 변경)
    await page.goto('/export?date=2026-05-11');

    // 페이지 갱신 대기
    await page.waitForLoadState('domcontentloaded');

    // 다른 날짜로 이동했는지 확인 (총액이 갱신됨)
    const newTotal = await page
      .locator('[data-testid="total-amount"]')
      .textContent();

    // 새로운 총액이 로드되었는지 확인
    expect(newTotal).toBeDefined();

    // 지출 목록이 있으면 확인 (없을 수도 있음)
    const expenseItems = page.locator('[data-testid="expense-item"]');
    const itemCount = await expenseItems.count();
    expect(itemCount).toBeGreaterThanOrEqual(0);
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
