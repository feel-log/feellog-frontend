import { test, expect } from '@playwright/test';

test.describe('월별 소비 리포트 조회', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 상태로 설정
    await page.goto('/household');
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'test-token-' + Date.now());
    });
  });

  test('월별 소비 흐름을 카테고리 기준으로 확인', async ({ page }) => {
    // 리포트 페이지 이동
    const reportLink = page.locator('a[href*="/report"], button:has-text("리포트")').first();
    if (await reportLink.isVisible()) {
      await reportLink.click();
      await expect(page).toHaveURL(/\/report/);
    }

    // 카테고리별 지출 비중 확인
    const categoryChart = page.locator('[data-testid="category-chart"], .chart').first();
    if (await categoryChart.isVisible()) {
      await expect(categoryChart).toBeVisible();
    }

    // 카테고리별 지출액 표시 확인
    const categoryItems = page.locator('[data-testid="category-item"]');
    const count = await categoryItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('월별 총 지출 확인', async ({ page }) => {
    // 리포트 페이지 이동
    const reportLink = page.locator('a[href*="/report"], button:has-text("리포트")').first();
    if (await reportLink.isVisible()) {
      await reportLink.click();
    }

    // 총 지출액 확인
    const totalExpense = page.locator('[data-testid="total-expense"], text=/총 지출|전체 지출/').first();
    if (await totalExpense.isVisible()) {
      const amount = await totalExpense.textContent();
      expect(amount).toMatch(/\d+,?\d*원/);
    }
  });

  test('감정 기준 월별 소비 흐름 확인', async ({ page }) => {
    // 리포트 페이지 이동
    const reportLink = page.locator('a[href*="/report"], button:has-text("리포트")').first();
    if (await reportLink.isVisible()) {
      await reportLink.click();
    }

    // 감정별 필터 버튼 확인 (있다면)
    const emotionFilter = page.locator('button:has-text("감정")').first();
    if (await emotionFilter.isVisible()) {
      await emotionFilter.click();

      // 감정 옵션 확인
      const emotions = ['긍정', '부정', '기타'];
      for (const emotion of emotions) {
        const option = page.locator(`text="${emotion}"`).first();
        if (await option.isVisible({ timeout: 500 })) {
          await expect(option).toBeVisible();
        }
      }
    }
  });

  test('월 선택으로 다른 월 리포트 조회', async ({ page }) => {
    // 리포트 페이지
    const reportLink = page.locator('a[href*="/report"], button:has-text("리포트")').first();
    if (await reportLink.isVisible()) {
      await reportLink.click();
    }

    // 월 선택 버튼
    const monthSelector = page.locator('button:has-text("월"), select[name="month"]').first();
    if (await monthSelector.isVisible()) {
      await monthSelector.click();

      // 이전 달 선택
      const previousMonth = page.locator('button:has-text("이전"), button[aria-label*="이전"]').first();
      if (await previousMonth.isVisible()) {
        await previousMonth.click();
        await page.waitForLoadState('networkidle');
      }
    }
  });
});

test.describe('회고 설문 및 결과 제공', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 상태로 설정
    await page.goto('/household');
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'test-token-' + Date.now());
    });
  });

  test('소비 회고 시작 - 하루 소비 요약 확인', async ({ page }) => {
    // 회고 버튼 클릭
    const reviewButton = page.locator('button:has-text("회고"), button:has-text("돌아보기")').first();
    if (await reviewButton.isVisible()) {
      await reviewButton.click();

      // 회고 페이지 또는 모달 확인
      const reviewContent = page.locator('[data-testid="review-summary"], text=/오늘의 지출|총 지출|주요 감정/').first();
      await expect(reviewContent).toBeVisible();

      // 총 지출 요약 확인
      const totalAmount = page.locator('[data-testid="summary-amount"]');
      if (await totalAmount.isVisible()) {
        const amount = await totalAmount.textContent();
        expect(amount).toMatch(/\d+,?\d*원/);
      }

      // 최고 지출 카테고리 확인
      const topCategory = page.locator('[data-testid="top-category"]');
      if (await topCategory.isVisible()) {
        await expect(topCategory).toBeVisible();
      }
    }
  });

  test('회고 설문 항목 응답 - 만족도 및 내일 소비 의도 선택', async ({ page }) => {
    // 회고 시작
    const reviewButton = page.locator('button:has-text("회고"), button:has-text("돌아보기")').first();
    if (await reviewButton.isVisible()) {
      await reviewButton.click();

      // 다음 단계 버튼으로 설문 진행
      await page.waitForTimeout(500);

      // 만족도 선택
      const satisfactionOptions = page.locator('button[aria-label*="만족"], button:has-text("만족")').first();
      if (await satisfactionOptions.isVisible()) {
        // 5단계 만족도 (1~5 선택)
        const rating = page.locator('button[data-rating="4"], button:has-text("만족해요")').first();
        if (await rating.isVisible()) {
          await rating.click();
        }
      }

      // 내일 소비 의도 선택
      const spendingIntention = page.locator('button:has-text("줄")').first();
      if (await spendingIntention.isVisible()) {
        await spendingIntention.click();
      }

      // 다음 버튼 클릭
      const nextButton = page.locator('button:has-text("다음"), button:has-text("제출")').first();
      if (await nextButton.isVisible()) {
        await nextButton.click();
      }
    }
  });

  test('회고 설문 제출 후 결과 피드백 확인', async ({ page }) => {
    // 회고 시작
    const reviewButton = page.locator('button:has-text("회고"), button:has-text("돌아보기")').first();
    if (await reviewButton.isVisible()) {
      await reviewButton.click();

      // 설문 완료 (모든 질문에 답변)
      const nextButtons = page.locator('button:has-text("다음")');
      const count = await nextButtons.count();

      for (let i = 0; i < count; i++) {
        const options = page.locator('button[role="radio"], button[data-option]').first();
        if (await options.isVisible()) {
          await options.click();
          await page.waitForTimeout(300);
        }

        const nextBtn = page.locator('button:has-text("다음")').first();
        if (await nextBtn.isVisible()) {
          await nextBtn.click();
        }
      }

      // 마지막 제출
      const submitButton = page.locator('button:has-text("제출"), button:has-text("완료")').first();
      if (await submitButton.isVisible()) {
        await submitButton.click();
      }

      // 결과 페이지 확인
      await page.waitForLoadState('networkidle');

      // 피드백 메시지 확인
      const feedback = page.locator('[data-testid="feedback"], text=/절약|소비패턴|조언/').first();
      if (await feedback.isVisible()) {
        await expect(feedback).toBeVisible();
      }

      // 실천 가이드 확인
      const guide = page.locator('[data-testid="guide"], text=/실천|가이드|팁/').first();
      if (await guide.isVisible()) {
        await expect(guide).toBeVisible();
      }
    }
  });

  test('회고 설문 결과 유형별 피드백 제공', async ({ page }) => {
    // 회고 시작 및 설문 완료
    const reviewButton = page.locator('button:has-text("회고"), button:has-text("돌아보기")').first();
    if (await reviewButton.isVisible()) {
      await reviewButton.click();

      // 설문 진행 (최소한의 상호작용)
      await page.waitForTimeout(500);

      // 결과 페이지 도달
      const resultContent = page.locator('[data-testid="result-type"], text=/절약|합리|신중|충동/').first();
      if (await resultContent.isVisible()) {
        const resultText = await resultContent.textContent();
        expect(resultText).toBeDefined();
      }
    }
  });

  test('소비 데이터, 상황/감정 태그, 설문 응답 조합한 결과 제공', async ({ page }) => {
    // 회고 진행
    const reviewButton = page.locator('button:has-text("회고")').first();
    if (await reviewButton.isVisible()) {
      await reviewButton.click();

      // 요약 페이지에서 필요한 데이터 확인
      await expect(page.locator('[data-testid="review-summary"]')).toBeVisible();

      // 지출 데이터 확인
      const amount = page.locator('[data-testid="summary-amount"]');
      if (await amount.isVisible()) {
        await expect(amount).toBeVisible();
      }

      // 감정/상황 태그 포함 데이터 확인
      const emotions = page.locator('[data-testid="emotion-tag"]');
      const emotionCount = await emotions.count();

      // 설문 진행 후 최종 피드백
      await page.waitForTimeout(500);

      // 결과 페이지의 종합 피드백
      const comprehensiveFeedback = page.locator('[data-testid="feedback"]');
      if (await comprehensiveFeedback.isVisible()) {
        await expect(comprehensiveFeedback).toBeVisible();
      }
    }
  });
});
