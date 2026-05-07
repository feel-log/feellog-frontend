'use client';

import { useEffect, useMemo, useReducer } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/shared/ui/PageHeader';
import { cn } from '@/shared/lib/utils';
import { useToken, useUser } from '@/shared/store';
import { useUserGetter } from '@/entities/user';
import { useMasterData } from '@/entities/master-data';
import { useHouseHoldPost } from '@/features/post-house-hold/model/useHouseHoldPost';
import { useUpdateExpense } from '@/features/update-expense/model/useUpdateExpense';
import { useDailyExpend } from '@/entities/daily-expend/model/useDailyExpend';
import { useGetAssets } from '@/entities/get-assets/useGetAssets';
import type { AssetItem } from '@/entities/get-assets/get-assets-api';
import { usePostAsset } from '@/features/post-asset/model/usePostAsset';
import { useUpdateAsset } from '@/features/post-asset/model/useUpdateAsset';
import { usePostIncome } from '@/features/post-income/model/usePostIncome';
import type { DailyExpendType } from '@/entities/daily-expend/model/daily-expend-type';
import {
  formatDateDisplay,
  calculateExpression,
  getDisplayAmount,
  RecordState
} from '@/shared/utils/record';
import { useAmountInput } from '@/shared/hooks/useAmountInput';
import DatePickerBottomSheet from './DatePickerBottomSheet';
import CategoryBottomSheet from './CategoryBottomSheet';
import PaymentMethodBottomSheet from './PaymentMethodBottomSheet';
import EmotionBottomSheet from './EmotionBottomSheet';
import SituationMemoBottomSheet from './SituationMemoBottomSheet';
import IncomeMemoBottomSheet from './IncomeMemoBottomSheet';
import SaveButtonSection from './SaveButtonSection';
import SelectField from '@/shared/ui/SelectField';

export default function RecordContent() {
  const { expenseCategories, emotions, situationTags, paymentMethods, incomeCategories, isLoading } = useMasterData();
  const searchParams = useSearchParams();

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const selectedDate = searchParams?.get('date') || today;
  const typeParam = searchParams?.get('type');
  const expenseIdParam = searchParams?.get('expenseId');
  const assetIdParam = searchParams?.get('assetId');
  const modeParam = searchParams?.get('mode');
  const isEditMode = !!(modeParam === 'edit' && expenseIdParam);
  const isAssetEditMode = !!(typeParam === 'asset' && assetIdParam);
  const isAssetMode = typeParam === 'asset';
  const initialType: 'income' | 'expense' =
    typeParam === 'income' || isAssetMode ? 'income' : 'expense';

  // Edit 모드일 때 기존 데이터 로드
  const expenseYear = parseInt(selectedDate.split('-')[0]);
  const expenseMonth = parseInt(selectedDate.split('-')[1]);
  const expenseDay = parseInt(selectedDate.split('-')[2]);
  const { data: dailyExpenseData = [] } = useDailyExpend(expenseYear, expenseMonth, expenseDay);

  // 자산 edit 모드일 때만 자산 데이터 로드
  const { data: assetsData } = useGetAssets(
    {
      sort: 'LATEST',
      page: 0,
      size: 1000,
    },
    isAssetEditMode
  );

  // Memoize expense for stable reference
  const targetExpense = useMemo(() => {
    if (!isEditMode || !expenseIdParam || dailyExpenseData.length === 0) return null;
    return dailyExpenseData.find((e) => e.expenseId === parseInt(expenseIdParam));
  }, [isEditMode, expenseIdParam, dailyExpenseData]);

  // Memoize asset for stable reference
  const targetAsset = useMemo(() => {
    if (!isAssetEditMode || !assetIdParam || !assetsData?.data) return null;
    const parsedAssetId = parseInt(assetIdParam);
    return assetsData.data.find((a) => a.assetId === parsedAssetId);
  }, [isAssetEditMode, assetIdParam, assetsData]);

  interface FormState {
    record: RecordState;
    selectedCategoryId: number | null;
    selectedPaymentId: number | null;
    selectedEmotions: number[];
    tempTags: number[];
    tempMemo: string;
    memoInput: string;
    tempDate: string;
    isDateSelected: boolean;
    isCategoryOpen: boolean;
    isPaymentOpen: boolean;
    isEmotionOpen: boolean;
    isMemoOpen: boolean;
    isSituationOpen: boolean;
    isDateOpen: boolean;
  }

  type FormAction =
    | { type: 'LOAD_EXPENSE'; payload: DailyExpendType }
    | { type: 'LOAD_ASSET'; payload: AssetItem }
    | { type: 'SET_RECORD'; payload: RecordState }
    | { type: 'SET_CATEGORY'; payload: number | null }
    | { type: 'SET_PAYMENT'; payload: number | null }
    | { type: 'SET_EMOTIONS'; payload: number[] }
    | { type: 'SET_TAGS'; payload: number[] }
    | { type: 'SET_MEMO'; payload: string }
    | { type: 'SET_MEMO_INPUT'; payload: string }
    | { type: 'SET_DATE'; payload: string }
    | { type: 'SET_DATE_SELECTED'; payload: boolean }
    | { type: 'SET_CATEGORY_OPEN'; payload: boolean }
    | { type: 'SET_PAYMENT_OPEN'; payload: boolean }
    | { type: 'SET_EMOTION_OPEN'; payload: boolean }
    | { type: 'SET_MEMO_OPEN'; payload: boolean }
    | { type: 'SET_SITUATION_OPEN'; payload: boolean }
    | { type: 'SET_DATE_OPEN'; payload: boolean };

  const initialFormState: FormState = {
    record: {
      amount: 0,
      type: initialType,
      date: selectedDate,
      categoryId: null,
      paymentMethodId: null,
      emotionIds: [],
      situationTagIds: [],
      memo: '',
    },
    selectedCategoryId: null,
    selectedPaymentId: null,
    selectedEmotions: [],
    tempTags: [],
    tempMemo: '',
    memoInput: '',
    tempDate: selectedDate,
    isDateSelected: false,
    isCategoryOpen: false,
    isPaymentOpen: false,
    isEmotionOpen: false,
    isMemoOpen: false,
    isSituationOpen: false,
    isDateOpen: false,
  };

  const formReducer = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
      case 'LOAD_EXPENSE':
        return {
          ...state,
          record: {
            amount: action.payload.amount,
            type: 'expense',
            date: action.payload.expenseDate,
            categoryId: action.payload.categoryId,
            paymentMethodId: action.payload.paymentMethodId,
            emotionIds: action.payload.emotionIds,
            situationTagIds: action.payload.situationTagIds,
            memo: action.payload.memo,
          },
          selectedCategoryId: action.payload.categoryId,
          selectedPaymentId: action.payload.paymentMethodId,
          selectedEmotions: action.payload.emotionIds,
          tempTags: action.payload.situationTagIds,
          tempMemo: action.payload.memo,
        };
      case 'LOAD_ASSET':
        return {
          ...state,
          record: {
            amount: action.payload.amount,
            type: 'income',
            date: action.payload.assetDate,
            categoryId: action.payload.assetCategoryId,
            paymentMethodId: null,
            emotionIds: [],
            situationTagIds: [],
            memo: action.payload.memo || '',
          },
          selectedCategoryId: action.payload.assetCategoryId,
          tempMemo: action.payload.memo || '',
        };
      case 'SET_RECORD':
        return { ...state, record: action.payload };
      case 'SET_CATEGORY':
        return { ...state, selectedCategoryId: action.payload };
      case 'SET_PAYMENT':
        return { ...state, selectedPaymentId: action.payload };
      case 'SET_EMOTIONS':
        return { ...state, selectedEmotions: action.payload };
      case 'SET_TAGS':
        return { ...state, tempTags: action.payload };
      case 'SET_MEMO':
        return { ...state, tempMemo: action.payload };
      case 'SET_MEMO_INPUT':
        return { ...state, memoInput: action.payload };
      case 'SET_DATE':
        return { ...state, tempDate: action.payload };
      case 'SET_DATE_SELECTED':
        return { ...state, isDateSelected: action.payload };
      case 'SET_CATEGORY_OPEN':
        return { ...state, isCategoryOpen: action.payload };
      case 'SET_PAYMENT_OPEN':
        return { ...state, isPaymentOpen: action.payload };
      case 'SET_EMOTION_OPEN':
        return { ...state, isEmotionOpen: action.payload };
      case 'SET_MEMO_OPEN':
        return { ...state, isMemoOpen: action.payload };
      case 'SET_SITUATION_OPEN':
        return { ...state, isSituationOpen: action.payload };
      case 'SET_DATE_OPEN':
        return { ...state, isDateOpen: action.payload };
      default:
        return state;
    }
  };

  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const {
    record,
    selectedCategoryId,
    selectedPaymentId,
    selectedEmotions,
    tempTags,
    tempMemo,
    memoInput,
    tempDate,
    isDateSelected,
    isCategoryOpen,
    isPaymentOpen,
    isEmotionOpen,
    isMemoOpen,
    isSituationOpen,
    isDateOpen,
  } = formState;

  const setRecord = (newRecord: RecordState | ((prev: RecordState) => RecordState)) => {
    if (typeof newRecord === 'function') {
      dispatch({ type: 'SET_RECORD', payload: newRecord(record) });
    } else {
      dispatch({ type: 'SET_RECORD', payload: newRecord });
    }
  };
  const setSelectedCategoryId = (id: number | null) => dispatch({ type: 'SET_CATEGORY', payload: id });
  const setSelectedPaymentId = (id: number | null) => dispatch({ type: 'SET_PAYMENT', payload: id });
  const setSelectedEmotions = (emotions: number[]) => dispatch({ type: 'SET_EMOTIONS', payload: emotions });
  const setTempTags = (tags: number[]) => dispatch({ type: 'SET_TAGS', payload: tags });
  const setTempMemo = (memo: string) => dispatch({ type: 'SET_MEMO', payload: memo });
  const setMemoInput = (memo: string) => dispatch({ type: 'SET_MEMO_INPUT', payload: memo });
  const setTempDate = (date: string) => dispatch({ type: 'SET_DATE', payload: date });
  const setIsDateSelected = (selected: boolean) => dispatch({ type: 'SET_DATE_SELECTED', payload: selected });
  const setIsCategoryOpen = (open: boolean) => dispatch({ type: 'SET_CATEGORY_OPEN', payload: open });
  const setIsPaymentOpen = (open: boolean) => dispatch({ type: 'SET_PAYMENT_OPEN', payload: open });
  const setIsEmotionOpen = (open: boolean) => dispatch({ type: 'SET_EMOTION_OPEN', payload: open });
  const setIsMemoOpen = (open: boolean) => dispatch({ type: 'SET_MEMO_OPEN', payload: open });
  const setIsSituationOpen = (open: boolean) => dispatch({ type: 'SET_SITUATION_OPEN', payload: open });
  const setIsDateOpen = (open: boolean) => dispatch({ type: 'SET_DATE_OPEN', payload: open });

  const { amountInput, setAmountInput, isAmountEditing, setIsAmountEditing, handleAmountChange, displayAmount } = useAmountInput();

  useEffect(() => {
    if (targetExpense) {
      dispatch({ type: 'LOAD_EXPENSE', payload: targetExpense });
      setAmountInput(targetExpense.amount.toString());
    }
  }, [targetExpense, setAmountInput]);

  useEffect(() => {
    if (targetAsset) {
      dispatch({ type: 'LOAD_ASSET', payload: targetAsset });
      setAmountInput(targetAsset.amount.toString());
    }
  }, [targetAsset, setAmountInput]);

  // userId 가져오기
  const { getAccessToken } = useToken();
  const accessToken = getAccessToken();
  useUserGetter(accessToken!)
  const { getUser } = useUser();
  const user = getUser();


  const handleCategorySelect = (category: number) => {
    setSelectedCategoryId(category);
  };

  const handleCategorySave = () => {
    setRecord((prev) => ({
      ...prev,
      categoryId: selectedCategoryId,
    }));
    setIsCategoryOpen(false);
    setSelectedCategoryId(null);
  };

  const handlePaymentSave = () => {
    setRecord((prev) => ({
      ...prev,
      paymentMethodId: selectedPaymentId,
    }));
    setIsPaymentOpen(false);
    setSelectedPaymentId(null);
  };

  const handleEmotionSave = () => {
    setRecord((prev) => ({
      ...prev,
      emotionIds: selectedEmotions,
    }));
    setIsEmotionOpen(false);
    setSelectedEmotions([]);
  };

  const handleEmotionToggle = (emotionId: number) => {
    if (selectedEmotions.includes(emotionId)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== emotionId));
    } else if (selectedEmotions.length < 3) {
      setSelectedEmotions([...selectedEmotions, emotionId]);
    }
  };

  const handleMemoSave = () => {
    setRecord((prev) => ({
      ...prev,
      memo: memoInput,
    }));
    setIsMemoOpen(false);
  };

  const handleDateSave = () => {
    setRecord((prev) => ({
      ...prev,
      date: tempDate,
    }));
    setIsDateOpen(false);
    setIsDateSelected(true);
  };

  const handleSituationSave = () => {
    setRecord((prev) => ({
      ...prev,
      situationTagIds: tempTags,
      memo: tempMemo,
    }));
    setIsSituationOpen(false);
    setTempTags([]);
    setTempMemo('');
  };

  const handleTagToggle = (tagId: number) => {
    if (tempTags.includes(tagId)) {
      setTempTags(tempTags.filter((t) => t !== tagId));
    } else if (tempTags.length < 2) {
      setTempTags([...tempTags, tagId]);
    }
  };

  const nowForTime = new Date();
  const hhmm = `${String(nowForTime.getHours()).padStart(2, '0')}:${String(nowForTime.getMinutes()).padStart(2, '0')}:${String(nowForTime.getSeconds()).padStart(2, '0')}`;

  // API 호출
  const { mutate: houseHoldPost } = useHouseHoldPost('expense', {
    userId: user?.id ?? 0,
    categoryId: record.categoryId ?? null,
    paymentMethodId: record.paymentMethodId ?? null,
    amount: record.amount ?? 0,
    memo: record.memo ?? "",
    merchantId: 0,
    expenseDate: record.date,
    expenseTime: hhmm,
    emotionIds: record.emotionIds ?? [],
    situationTagIds: record.situationTagIds ?? []
  });

  const updateExpenseMutation = useUpdateExpense();
  const postAssetMutation = usePostAsset();
  const updateAssetMutation = useUpdateAsset();
  const postIncomeMutation = usePostIncome();

  const isFormValid = () => {
    if (record.type === 'expense') {
      return record.amount > 0 && record.paymentMethodId !== null && record.categoryId !== null;
    }
    if (isAssetMode) {
      return record.amount > 0 && record.categoryId !== null;
    }
    return record.amount > 0 && record.categoryId !== null;
  };

  const submitHouseHoldPost = () => {
    if (isFormValid()) {
      if (isAssetEditMode && assetIdParam) {
        updateAssetMutation.mutate({
          assetId: parseInt(assetIdParam),
          request: {
            assetCategoryId: record.categoryId ?? 0,
            amount: record.amount ?? 0,
            assetDate: record.date,
            memo: record.memo ?? ""
          }
        });
      } else if (isAssetMode) {
        postAssetMutation.mutate({
          assetCategoryId: record.categoryId ?? 0,
          amount: record.amount ?? 0,
          assetDate: record.date,
          memo: record.memo ?? ""
        });
      } else if (record.type === 'income') {
        postIncomeMutation.mutate({
          userId: user?.id ?? 0,
          amount: record.amount ?? 0,
          incomeCategoryId: record.categoryId ?? 0,
          incomeDate: record.date,
          memo: record.memo ?? ""
        });
      } else if (isEditMode && expenseIdParam) {
        updateExpenseMutation.mutate({
          expenseId: parseInt(expenseIdParam),
          request: {
            userId: user?.id ?? 0,
            categoryId: record.categoryId ?? null,
            paymentMethodId: record.paymentMethodId ?? null,
            amount: record.amount ?? 0,
            memo: record.memo ?? "",
            merchantName: "",
            expenseDate: record.date,
            expenseTime: hhmm,
            emotionIds: record.emotionIds ?? [],
            situationTagIds: record.situationTagIds ?? []
          },
        });
      } else {
        houseHoldPost();
      }
    }
  }


  const handleOutsideClick = () => {
    if (isAmountEditing) {
      const calculated = calculateExpression(amountInput);
      setRecord((rec) => ({
        ...rec,
        amount: calculated,
      }));
      setIsAmountEditing(false);
    }
  };

  const handleAmountChangeCallback = (value: string) => {
    const newAmount = handleAmountChange(value);
    setRecord((rec) => ({
      ...rec,
      amount: newAmount,
    }));
  };

  return (
    <div className="min-h-dvh bg-white" onClick={handleOutsideClick}>
      <PageHeader title={isEditMode ? '지출 수정' : isAssetEditMode ? '자산 수정' : isAssetMode ? '자산 추가' : '가계부'} />

      <div className="px-6 py-6 pb-40">
        {/* Amount Section */}
        <div
          className={cn(
            'mb-1',
            isAssetMode && 'mb-7.5 border-b border-[#E5E5E5] pb-3.75'
          )}
        >
          <div className="flex items-center gap-1.25">
            <h2
              className={cn(
                'text-[28px] font-semibold tracking-[-0.025em]',
                !isAssetMode && 'pb-4',
                record.type === 'expense' &&
                  (isAmountEditing ? getDisplayAmount(amountInput) : record.amount) !== 0
                  ? 'text-[#eb1c1c]'
                  : 'text-[#030303]'
              )}
            >
              {isAmountEditing ? getDisplayAmount(amountInput).toLocaleString() : record.amount.toLocaleString()}원
            </h2>
            <button
              onClick={() => {
                setAmountInput(record.amount.toString());
                setIsAmountEditing(true);
              }}
              className={cn('cursor-pointer', !isAssetMode && 'pb-4')}
            >
              <Image src="/svg/icon_pencil.svg" alt="edit" width={30} height={30} />
            </button>
          </div>
        </div>

        {/* Type Selection (Hidden in Asset Mode) */}
        {!isAssetMode && (
          <div className="mb-8 flex gap-2">
            {(['income', 'expense'] as const).map((type) => {
              const isActive = record.type === type;
              return (
                <button
                  key={type}
                  onClick={() => {
                    setRecord((prev) => ({
                      ...prev,
                      type,
                      amount: 0,
                      date: today,
                      category: '',
                      paymentMethod: '',
                      emotion: [],
                      situationTags: [],
                      memo: '',
                    }));
                    setIsDateSelected(false);
                  }}
                  className={cn(
                    'flex h-7.25 cursor-pointer items-center justify-center rounded-[20px] border px-5 py-1 text-[14px] font-medium tracking-[-0.025em] transition-colors',
                    isActive
                      ? 'border-[#1c1d1f] text-[#27282c]'
                      : 'border-[#9fa4a8] text-[#9fa4a8]'
                  )}
                >
                  {type === 'income' ? '수입' : '지출'}
                </button>
              );
            })}
          </div>
        )}

        {/* Date Section */}
        <SelectField
          label="날짜"
          value={formatDateDisplay(record.date)}
          placeholder="날짜를 선택하세요"
          isDefault={!isDateSelected}
          onClick={() => {
            setTempDate(record.date);
            setIsDateOpen(true);
          }}
        />

        {/* Payment Method Section (Expense Only) */}
        {record.type === 'expense' && (
          <SelectField
            label="결제 수단"
            value={record.paymentMethodId ? paymentMethods.find(m => m.id === record.paymentMethodId)?.label ?? null : null}
            placeholder="결제 수단을 선택하세요"
            onClick={() => setIsPaymentOpen(true)}
          />
        )}

        {/* Category Section */}
        <SelectField
          label="카테고리"
          value={
            isAssetMode
              ? incomeCategories.find((c) => c.id === record.categoryId)?.label ?? ''
              : record.type === 'income'
              ? incomeCategories.find((c) => c.id === record.categoryId)?.label ?? ''
              : expenseCategories
                .flatMap((g) => g.items)
                .find((item) => item.id === record.categoryId)?.label ?? ''
          }
          placeholder="카테고리를 선택하세요"
          onClick={() => {
            setSelectedCategoryId(record.categoryId);
            setIsCategoryOpen(true);
          }}
        />

        {/* Emotion Section (Expense Only) */}
        {record.type === 'expense' && (
          <SelectField
            label="감정"
            value={
              record.emotionIds && record.emotionIds.length > 0
                ? record.emotionIds.map((emotionId: number) => {
                    const emotion = emotions.flatMap((g) => g.items).find((item) => item.id === emotionId);
                    return emotion ? `${emotion.label}` : '';
                  }).filter(Boolean).join(', ')
                : ''
            }
            placeholder="감정을 선택하세요"
            onClick={() => {
              setSelectedEmotions(record.emotionIds || []);
              setIsEmotionOpen(true);
            }}
          />
        )}

        {/* Situation Tags & Memo (Expense Only) or Memo (Income) */}
        {record.type === 'expense' ? (
          <SelectField
            label="상황 태그 · 메모"
            value={
              `${
                record.situationTagIds && record.situationTagIds.length > 0
                  ? record.situationTagIds.map((tagId: number) => {
                      return situationTags.find((item) => item.id === tagId)?.label;
                    }).filter(Boolean).join(', ')
                  : ''
              }${record.situationTagIds && record.situationTagIds.length > 0 && record.memo ? ' / ' : ''}${record.memo ?? ''}`
            }
            placeholder="상황 태그·메모를 입력하세요"
            onClick={() => {
              setTempTags([...(record.situationTagIds || [])]);
              setTempMemo(record.memo);
              setIsSituationOpen(true);
            }}
          />
        ) : (
          <SelectField
            label="메모"
            value={record.memo}
            placeholder="내용을 입력하세요"
            onClick={() => {
              setMemoInput(record.memo);
              setIsMemoOpen(true);
            }}
          />
        )}
      </div>

      {/* Date Picker Bottom Sheet */}
      <DatePickerBottomSheet
        isOpen={isDateOpen}
        selectedDate={record.date}
        today={today}
        onClose={() => setIsDateOpen(false)}
        onSave={handleDateSave}
      />

      {/* Category Bottom Sheet */}
      <CategoryBottomSheet
        isOpen={isCategoryOpen}
        recordType={record.type}
        isAssetMode={isAssetMode}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories.map(cat => ({ id: cat.id, name: cat.label }))}
        assetCategories={incomeCategories.map(cat => ({ id: cat.id, name: cat.label }))}
        selectedCategoryId={selectedCategoryId}
        onCategorySelect={handleCategorySelect}
        onClose={() => setIsCategoryOpen(false)}
        onSave={handleCategorySave}
      />

      {/* Payment Method Bottom Sheet (Expense Only) */}
      {record.type === 'expense' && (
        <PaymentMethodBottomSheet
          isOpen={isPaymentOpen}
          selectedPaymentId={selectedPaymentId}
          paymentMethods={paymentMethods.map(method => ({ id: method.id, name: method.label }))}
          onPaymentSelect={setSelectedPaymentId}
          onClose={() => setIsPaymentOpen(false)}
          onSave={handlePaymentSave}
        />
      )}

      {/* Emotion Bottom Sheet (Expense Only) */}
      {record.type === 'expense' && (
        <EmotionBottomSheet
          isOpen={isEmotionOpen}
          emotions={emotions}
          selectedEmotions={selectedEmotions}
          isLoading={isLoading}
          onEmotionToggle={handleEmotionToggle}
          onClose={() => setIsEmotionOpen(false)}
          onSave={handleEmotionSave}
        />
      )}

      {/* Memo Bottom Sheet (Income) */}
      {record.type === 'income' && (
        <IncomeMemoBottomSheet
          isOpen={isMemoOpen}
          memoInput={memoInput}
          onMemoChange={setMemoInput}
          onClose={() => setIsMemoOpen(false)}
          onSave={handleMemoSave}
        />
      )}

      {/* Situation Tags & Memo Bottom Sheet (Expense) */}
      {record.type === 'expense' && (
        <SituationMemoBottomSheet
          isOpen={isSituationOpen}
          situationTags={situationTags}
          tempTags={tempTags}
          tempMemo={tempMemo}
          isLoading={isLoading}
          onTagToggle={handleTagToggle}
          onMemoChange={setTempMemo}
          onClose={() => setIsSituationOpen(false)}
          onSave={handleSituationSave}
        />
      )}

      {/* Save Button */}
      <SaveButtonSection
        isAmountEditing={isAmountEditing}
        isFormValid={isFormValid()}
        onSubmit={submitHouseHoldPost}
        onAmountChange={handleAmountChangeCallback}
      />
    </div>
  );
}
