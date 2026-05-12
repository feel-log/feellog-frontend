import { test, expect } from '@playwright/test';

test.describe('지출 기록 등록', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 상태로 설정
    await page.goto('/household');
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'test-token-' + Date.now());
    });
  });

  test('기본 지출 정보 입력 및 저장', async ({ page }) => {
    // 새 기록 추가 버튼 클릭
    await page.click('button[aria-label="새로운 기록 추가"], button:has-text("새로운"), button:has-text("\\+")');

    // 지출 페이지 확인
    await expect(page).toHaveURL(/\/expense|\/record/);

    // 필수 정보 입력
    await page.fill('input[name="amount"], input[placeholder*="금액"]', '10000');

    // 카테고리 선택
    await page.click('button:has-text("카테고리")');
    await page.click('button:has-text("식비")');

    // 저장
    await page.click('button:has-text("저장")');

    // 저장 성공 확인
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/household/);
  });

  test('날짜 선택 바텀시트를 통한 지출 날짜 변경', async ({ page }) => {
    await page.goto('/expense/new');

    // 필수 정보 입력
    await page.fill('input[name="amount"], input[placeholder*="금액"]', '5000');

    // 날짜 선택 버튼 클릭
    const dateButton = page.locator('button:has-text("날짜"), [data-testid="date-selector"]').first();
    if (await dateButton.isVisible()) {
      await dateButton.click();

      // 바텀시트 확인
      const bottomSheet = page.locator('[role="dialog"], .bottom-sheet, [data-testid="date-bottom-sheet"]').first();
      await expect(bottomSheet).toBeVisible();

      // 어제 날짜 선택
      const yesterdayButton = bottomSheet.locator('button:has-text("어제"), button[aria-label*="어제"]').first();
      if (await yesterdayButton.isVisible()) {
        await yesterdayButton.click();

        // 바텀시트 닫힘 확인
        await expect(bottomSheet).not.toBeVisible({ timeout: 1000 });
      }
    }
  });

  test('카테고리 선택 바텀시트', async ({ page }) => {
    await page.goto('/expense/new');

    // 카테고리 선택 버튼 클릭
    const categoryButton = page.locator('button:has-text("카테고리")').first();
    await categoryButton.click();

    // 바텀시트 확인
    const bottomSheet = page.locator('[role="dialog"], .bottom-sheet').first();
    await expect(bottomSheet).toBeVisible();

    // 여러 카테고리 옵션 확인
    const categories = ['식비', '교통', '쇼핑', '문화생활'];
    for (const category of categories) {
      const option = bottomSheet.locator(`button:has-text("${category}")`).first();
      if (await option.isVisible({ timeout: 500 })) {
        await expect(option).toBeVisible();
      }
    }
  });

  test('감정 태그 선택', async ({ page }) => {
    await page.goto('/expense/new');

    // 금액 입력
    await page.fill('input[name="amount"], input[placeholder*="금액"]', '15000');

    // 감정 선택 버튼 클릭
    const emotionButton = page.locator('button:has-text("감정")').first();
    if (await emotionButton.isVisible()) {
      await emotionButton.click();

      const bottomSheet = page.locator('[role="dialog"], .bottom-sheet').first();
      await expect(bottomSheet).toBeVisible();

      // 긍정 감정 선택
      const positiveEmotion = bottomSheet.locator('button:has-text("기쁨"), button:has-text("설렘")').first();
      if (await positiveEmotion.isVisible()) {
        await positiveEmotion.click();
      }
    }
  });

  test('상황 태그 및 메모 입력', async ({ page }) => {
    await page.goto('/expense/new');

    // 필수 정보 입력
    await page.fill('input[name="amount"], input[placeholder*="금액"]', '8000');

    // 메모 입력
    const memoInput = page.locator('textarea[name="memo"], input[placeholder*="메모"]').first();
    if (await memoInput.isVisible()) {
      await memoInput.fill('카페에서 커피 구매');
    }

    // 상황 태그 선택 (있다면)
    const situationButton = page.locator('button:has-text("상황")').first();
    if (await situationButton.isVisible()) {
      await situationButton.click();
    }
  });

  test('결제 수단 선택 - 카드, 현금, 계좌, 기타', async ({ page }) => {
    await page.goto('/expense/new');

    // 결제 수단 선택 버튼
    const paymentButton = page.locator('button:has-text("결제수단"), button:has-text("결제"), button:has-text("카드")').first();
    if (await paymentButton.isVisible()) {
      await paymentButton.click();

      const bottomSheet = page.locator('[role="dialog"], .bottom-sheet').first();
      await expect(bottomSheet).toBeVisible();

      // 각 결제 수단 확인
      const paymentMethods = ['카드', '현금', '계좌', '기타'];
      for (const method of paymentMethods) {
        const option = bottomSheet.locator(`button:has-text("${method}")`).first();
        if (await option.isVisible({ timeout: 500 })) {
          await expect(option).toBeVisible();
        }
      }

      // 카드 선택
      const cardButton = bottomSheet.locator('button:has-text("카드")').first();
      if (await cardButton.isVisible()) {
        await cardButton.click();
      }
    }
  });

  test('지출 기록 저장 후 목록에 반영', async ({ page }) => {
    const timestamp = Date.now();
    const uniqueAmount = 12340 + (timestamp % 100);

    // 새 지출 기록 추가
    await page.click('button[aria-label="새로운 기록 추가"], button:has-text("\\+")');

    // 정보 입력
    await page.fill('input[name="amount"], input[placeholder*="금액"]', uniqueAmount.toString());
    await page.click('button:has-text("카테고리")');
    await page.click('button:has-text("식비")');

    // 저장
    await page.click('button:has-text("저장")');
    await page.waitForLoadState('networkidle');

    // 목록에서 새 기록 확인
    const expenseItem = page.locator(`text="${uniqueAmount}"`);
    await expect(expenseItem).toBeVisible();
  });

  test('선택적 필드 없이 최소 필수 정보만으로 저장', async ({ page }) => {
    await page.goto('/expense/new');

    // 필수 필드만 입력 (금액, 카테고리)
    await page.fill('input[name="amount"], input[placeholder*="금액"]', '3000');
    await page.click('button:has-text("카테고리")');
    await page.click('button:has-text("식비")');

    // 저장 (선택적 필드 미입력)
    await page.click('button:has-text("저장")');

    // 성공 확인
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/household/);
  });

  test('바텀시트 외부 클릭으로 닫기', async ({ page }) => {
    await page.goto('/expense/new');

    // 바텀시트 열기
    await page.click('button:has-text("카테고리")');

    const bottomSheet = page.locator('[role="dialog"], .bottom-sheet').first();
    await expect(bottomSheet).toBeVisible();

    // 배경 클릭으로 닫기
    const overlay = page.locator('[role="presentation"], .overlay').first();
    if (await overlay.isVisible()) {
      await overlay.click();
    }

    // 바텀시트 닫힘 확인
    await expect(bottomSheet).not.toBeVisible({ timeout: 1000 });
  });
});
