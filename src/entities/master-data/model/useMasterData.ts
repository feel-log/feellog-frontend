'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToken } from '@/shared/store';
import { masterDataQueries, type MasterData } from '@/entities/master-data';
import { CATEGORY_EMOJI_MAP, EMOTION_SVG_MAP } from './master-data-emoji';

interface ExpenseCategory {
  group: string;
  items: Array<{
    label: string;
    emoji: string;
    id: number;
  }>;
}

interface Emotion {
  group: string;
  items: Array<{
    label: string;
    emoji: string;
    id: number;
  }>;
}

interface SituationTag {
  label: string;
  id: number;
}

interface PaymentMethod {
  label: string;
  id: number;
}

interface IncomeCategory {
  label: string;
  id: number;
}

function buildExpenseCategories(masterData?: MasterData): ExpenseCategory[] {
  if (!masterData?.categoryGroups) return [];

  return masterData.categoryGroups.map((group) => ({
    group: group.name,
    items: group.categories.map((category) => ({
      label: category.name,
      emoji: CATEGORY_EMOJI_MAP[category.id] || '',
      id: category.id,
    })),
  }));
}

function buildEmotions(masterData?: MasterData): Emotion[] {
  if (!masterData?.emotionGroups) return [];

  return masterData.emotionGroups.map((group) => ({
    group: group.name,
    items: group.emotions.map((emotion) => ({
      label: emotion.name,
      emoji: EMOTION_SVG_MAP[emotion.id] || '',
      id: emotion.id,
    })),
  }));
}

function buildSituationTags(masterData?: MasterData): SituationTag[] {
  if (!masterData?.situationTags) return [];

  return masterData.situationTags.map((tag): SituationTag => ({
    label: tag.name,
    id: tag.id,
  }));
}

function buildPaymentMethods(masterData?: MasterData): PaymentMethod[] {
  if (!masterData?.paymentMethods) return [];

  return masterData.paymentMethods.map((method) => ({
    label: method.name,
    id: method.id,
  }));
}

function buildIncomeCategories(masterData?: MasterData): IncomeCategory[] {
  if (!masterData?.incomeCategories) return [];

  return masterData.incomeCategories.map((category) => ({
    label: category.name,
    id: category.id,
  }));
}

export function useMasterData() {
  const { getAccessToken } = useToken();
  const token = getAccessToken();

  const { data: masterData, isLoading, error } = useQuery({
    ...masterDataQueries.data(token || ''),
  });

  const expenseCategories = useMemo(
    () => buildExpenseCategories(masterData),
    [masterData],
  );

  const emotions = useMemo(() => buildEmotions(masterData), [masterData]);

  const situationTags = useMemo(
    () => buildSituationTags(masterData),
    [masterData],
  );

  const paymentMethods = useMemo(
    () => buildPaymentMethods(masterData),
    [masterData],
  );

  const incomeCategories = useMemo(
    () => buildIncomeCategories(masterData),
    [masterData],
  );

  return {
    expenseCategories,
    emotions,
    situationTags,
    paymentMethods,
    incomeCategories,
    masterData,
    isLoading,
    error,
  };
}
