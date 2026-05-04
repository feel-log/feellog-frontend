'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/shared/ui/PageHeader';
import BottomSheet from '@/shared/ui/BottomSheet';
import Button from '@/shared/ui/Button';
import SelectField from '@/shared/ui/SelectField';
import { cn } from '@/shared/lib/utils';
import KeyBoardUserExperience from '@/shared/ui/record/KeyBoardUserExperience';
import { useToken, useUser } from '@/shared/store';
import { useUserGetter } from '@/entities/user';
import { useHouseHoldPost } from '@/features/post-house-hold/model/useHouseHoldPost';
import { evaluate } from 'mathjs';

interface RecordState {
  amount: number;
  type: 'income' | 'expense';
  date: string;
  categoryId: number | null;
  paymentMethodId: number | null;
  emotionIds?: number[];
  situationTagIds?: number[];
  memo: string;
}

const INCOME_CATEGORIES =
[
  {
  name: '급여',
  id: 1
  },
  {
    name: '용돈',
    id: 2
  },
  {
    name: '부수입',
    id: 3
  },
  {
    name: '상여금',
    id: 4
  },
  {
    name: '금융 수입',
    id: 5
  },
  {
    name: '기타',
    id: 6
  }
];

export const EXPENSE_CATEGORIES = [
  {
    group: '생활',
    items: [
      { label: '식비', emoji: '🍔', id: 1, },
      { label: '카페', emoji: '☕', id: 2, },
      { label: '생필품', emoji: '🧼', id: 3 },
    ],
  },
  {
    group: '소비',
    items: [
      { label: '의류', emoji: '👚', id: 4 },
      { label: '교통비', emoji: '🚌', id: 5 },
      { label: '의료', emoji: '🏥', id: 6 },
      { label: '교육', emoji: '✏️', id: 7 },
      { label: '경조사', emoji: '🎉', id: 8 },
    ],
  },
  {
    group: '고정',
    items: [
      { label: '공과금', emoji: '💸', id: 9 },
      { label: '주거', emoji: '🏠', id: 10 },
      { label: '보험료', emoji: '📄', id: 11 },
      { label: '저축', emoji: '💰', id: 12 },
    ],
  },
  {
    group: '여가',
    items: [
      { label: '취미', emoji: '🎨', id: 13 },
      { label: '뷰티', emoji: '💅', id: 14 },
      { label: '문화생활', emoji: '🎭', id: 15 },
    ],
  },
];

export const PAYMENT_METHODS = [
  {
    name: '카드',
    id: 1
  },
  {
    name: '현금',
    id: 2
  },
  {
    name: '계좌',
    id: 3
  },
  {
    name: '기타',
    id: 4
  }
];

export const EMOTIONS = [
  {
    group: '긍정',
    items: [
      { label: '기쁨', emoji: '/svg/emo/happy.svg', id: 1 },
      { label: '설렘', emoji: '/svg/emo/flut.svg', id: 2 },
      { label: '뿌듯함', emoji: '/svg/emo/proud.svg', id: 3 },
      { label: '고마움', emoji: '/svg/emo/thanks.svg', id: 4 },
    ],
  },
  {
    group: '부정',
    items: [
      { label: '짜증', emoji: '/svg/emo/annoy.svg', id: 5 },
      { label: '화남', emoji: '/svg/emo/angry.svg', id: 6 },
      { label: '불안함', emoji: '/svg/emo/anxios.svg', id: 7 },
      { label: '슬픔', emoji: '/svg/emo/sad.svg', id: 8 },
      { label: '스트레스', emoji: '/svg/emo/stress.svg', id: 9 },
      { label: '우울함', emoji: '/svg/emo/depressed.svg', id: 10 },
    ],
  },
  {
    group: '기타',
    items: [
      { label: '심심함', emoji: '/svg/emo/boring.svg', id: 11 },
      { label: '피곤함', emoji: '/svg/emo/tired.svg', id: 12 },
      { label: '공허함', emoji: '/svg/emo/emptiness.svg', id: 13 },
      { label: '외로움', emoji: '/svg/emo/lonely.svg', id: 14 },
      { label: '충동', emoji: '/svg/emo/impulse.svg', id: 15 },
    ],
  },
];

export const SITUATION_TAGS = [
  { label: '피로회복', id: 1 },
  { label: '기분전환', id: 2 },
  { label: '보상심리', id: 3 },
  { label: '할인', id: 4 },
  { label: '충동소비', id: 5 },
  { label: '필요', id: 6 },
  { label: '약속', id: 7 },
  { label: '지각', id: 8 },
  { label: '기타', id: 9 },
];

const DAY_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

function formatDateDisplay(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = DAY_OF_WEEK[date.getDay()];
  return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`;
}

function getCategoryDisplay (categoryId: number | null){
  return EXPENSE_CATEGORIES.flatMap(g => g.items)
    .find(item => item.id === categoryId)?.label ?? '';
};

export default function RecordContent() {
  const searchParams = useSearchParams();

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const selectedDate = searchParams?.get('date') || today;
  const typeParam = searchParams?.get('type');
  const isAssetMode = typeParam === 'asset';
  const initialType: 'income' | 'expense' =
    typeParam === 'income' || isAssetMode ? 'income' : 'expense';

  const [record, setRecord] = useState<RecordState>({
    amount: 0,
    type: initialType,
    date: selectedDate,
    categoryId: null,
    paymentMethodId: null,
    emotionIds: [],
    situationTagIds: [],
    memo: '',
  });

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isEmotionOpen, setIsEmotionOpen] = useState(false);
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [isSituationOpen, setIsSituationOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<number[]>([]);
  const [memoInput, setMemoInput] = useState('');
  const [tempTags, setTempTags] = useState<number[]>([]);
  const [tempMemo, setTempMemo] = useState('');
  const [isDateSelected, setIsDateSelected] = useState(false);


  const [amountInput, setAmountInput] = useState(''); // amount 값
  const [isAmountEditing, setIsAmountEditing] = useState(false);

  // userId 가져오기
  const { getAccessToken } = useToken();
  const accessToken = getAccessToken();
  useUserGetter(accessToken!)
  const { getUser } = useUser();
  const user = getUser();

  const [calendarMonth, setCalendarMonth] = useState(() => {
    const [year, month] = selectedDate.split('-').map(Number);
    return { year, month };
  });
  const [tempDate, setTempDate] = useState(selectedDate);

  const calculateExpression = (expression: string): number => {
    try {
      if (!expression || expression.trim() === '') {
        return 0;
      }
      const normalized = expression.replace(/,00/g, '.00').replace(/,000/g, '.000');

      const result = evaluate(normalized);
      return Math.round((result || 0) * 100) / 100;
    } catch {
      // eval 에러 시 마지막 숫자만 추출
      const numbers = expression.match(/\d+/g);
      return numbers ? parseInt(numbers[numbers.length - 1]) : 0;
    }
  };

  const getDisplayAmount = (): number => {
    if (!amountInput) return 0;
    try {
      const normalized = amountInput.replace(/,00/g, '.00').replace(/,000/g, '.000');
      const result = evaluate(normalized);
      return Math.round((result || 0) * 100) / 100;
    } catch {
      // 에러 시 마지막 숫자 반환
      const numbers = amountInput.match(/\d+/g);
      return numbers ? parseInt(numbers[numbers.length - 1]) : 0;
    }
  };

  const handleAmountChange = (value: string) => {
    if (value === 'equals') {
      const calculated = calculateExpression(amountInput);
      setAmountInput(calculated.toString());
      setRecord((rec) => ({
        ...rec,
        amount: calculated,
      }));
      setIsAmountEditing(false);
    } else {
      setAmountInput((prev) => {
        let result = prev;

        if (value === 'backspace') {
          result = prev.slice(0, -1);
        } else if (value === '+' || value === '-' || value === '*' || value === '/') {
          if (!/[+\-*/]$/.test(result) && result !== '') {
            const calculated = calculateExpression(result);
            result = calculated.toString() + value;
          } else if (result === '') {
            result = '0' + value;
          }
        } else if (value === ',00' || value === ',000') {
          const zeros = value === ',00' ? '00' : '000';
          if (!/[+\-*/]$/.test(result)) {
            result = prev + zeros;
          }
        } else {
          if (result.length < 15) {
            result = prev + value;
          }
        }

        return result;
      });
    }
  };

  const handleCategorySelect = (category: number) => {
    setSelectedCategoryId(category);
  };

  const handleCategorySave = () => {
    setRecord((prev) => ({
      ...prev,
      categoryId: selectedCategoryId,
    }));
    console.log(record);
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

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const getCalendarDays = () => {
    const { year, month } = calendarMonth;
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        date: `${year}-${String(month - 1).padStart(2, '0')}-${String(daysInPrevMonth - i).padStart(2, '0')}`,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      });
    }

    const TOTAL_CELLS = 42;
    const remaining = TOTAL_CELLS - days.length;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      });
    }

    return days;
  };

  const date = new Date(record.date);
  const hhmm = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

  console.log(record);
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

  const isFormValid = () => {
    if (record.type === 'expense') {
      return isDateSelected && record.paymentMethodId !== null && record.categoryId !== null;
    }
    return true;
  };

  const submitHouseHoldPost = () => {
    if (isFormValid()) {
      houseHoldPost();
    }
  }


  return (
    <div className="min-h-screen bg-white">
      <PageHeader title={isAssetMode ? '자산 추가' : '가계부'} />

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
                  (isAmountEditing ? getDisplayAmount() : record.amount) !== 0
                  ? 'text-[#eb1c1c]'
                  : 'text-[#030303]'
              )}
            >
              {isAmountEditing ? getDisplayAmount().toLocaleString() : record.amount.toLocaleString()}원
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
          value={isDateSelected ? formatDateDisplay(record.date) : ''}
          placeholder="날짜를 선택하세요"
          onClick={() => {
            setTempDate(record.date);
            setCalendarMonth(() => {
              const [year, month] = record.date.split('-').map(Number);
              return { year, month };
            });
            setIsDateOpen(true);
          }}
        />

        {/* Payment Method Section (Expense Only) */}
        {record.type === 'expense' && (
          <SelectField
            label="결제 수단"
            value={record.paymentMethodId ? PAYMENT_METHODS[record.paymentMethodId - 1].name : null}
            placeholder="결제 수단을 선택하세요"
            onClick={() => setIsPaymentOpen(true)}
          />
        )}

        {/* Category Section */}
        <SelectField
          label="카테고리"
          value={getCategoryDisplay(record.categoryId)}
          placeholder="카테고리를 선택하세요"
          onClick={() => setIsCategoryOpen(true)}
        />

        {/* Emotion Section (Expense Only) */}
        {record.type === 'expense' && (
          <SelectField
            label="감정"
            value={record.emotionIds?.map((emotionId: number) => {
              const emotion = EMOTIONS.flatMap(g => g.items).find(item => item.id === emotionId);
              return emotion ? `${emotion.label}` : '';
            }).filter(Boolean).join(', ') ?? ''}
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
            value={`${record.situationTagIds?.map((tagId: number) => {
              return SITUATION_TAGS.find(item => item.id === tagId)?.label;
            }).filter(Boolean).join(', ') ?? ''}${record.situationTagIds && record.situationTagIds.length > 0 && record.memo ? ' / ' : ''}${record.memo ?? ''}`}
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
      <BottomSheet
        isOpen={isDateOpen}
        title="날짜를 선택해주세요"
        onClose={() => setIsDateOpen(false)}
        onSave={handleDateSave}
        height={636}
      >
        <div>
          <div className="mb-5 flex items-center gap-5">
            <button
              onClick={() => {
                if (calendarMonth.month === 1) {
                  setCalendarMonth({ year: calendarMonth.year - 1, month: 12 });
                } else {
                  setCalendarMonth({ ...calendarMonth, month: calendarMonth.month - 1 });
                }
              }}
              className="cursor-pointer"
              aria-label="이전 달"
            >
              <Image src={'/svg/icon_arrow_left_fill.svg'} alt={'left'} width={30} height={30} />
            </button>
            <h3 className="min-w-13.5 text-center text-[20px] font-bold tracking-[-0.025em] text-[#27282c]">
              {calendarMonth.year === 2026 ? `${calendarMonth.month}월` : `${calendarMonth.year}년 ${calendarMonth.month}월`}
            </h3>
            <button
              onClick={() => {
                if (calendarMonth.month === 12) {
                  setCalendarMonth({ year: calendarMonth.year + 1, month: 1 });
                } else {
                  setCalendarMonth({ ...calendarMonth, month: calendarMonth.month + 1 });
                }
              }}
              className="cursor-pointer"
              aria-label="다음 달"
            >
              <Image
                src={'/svg/icon_arrow_left_fill.svg'}
                alt={'right'}
                width={30}
                height={30}
                className={'rotate-180'}
              />
            </button>
          </div>

          <div className="mb-5 grid grid-cols-7 text-center">
            {DAY_OF_WEEK.map((day) => (
              <div key={day} className="text-[14px] font-medium tracking-[-0.025em] text-[#73787e]">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-5 text-center">
            {getCalendarDays().map((item, idx) => {
              const isSelected = item.date === tempDate;
              const handleDayClick = () => {
                if (!item.isCurrentMonth) {
                  const [y, m] = item.date.split('-').map(Number);
                  setCalendarMonth({ year: y, month: m });
                }
                setTempDate(item.date);
              };
              return (
                <button
                  key={idx}
                  onClick={handleDayClick}
                  className={cn(
                    'relative mx-auto flex h-7.5 w-7.5 cursor-pointer items-center justify-center text-[18px] font-semibold tracking-[-0.025em] transition-colors',
                    isSelected
                      ? 'rounded-full bg-[#13278a] text-white'
                      : item.isCurrentMonth
                        ? 'text-[#030303]'
                        : 'text-[#9fa4a8]'
                  )}
                >
                  {item.day}
                </button>
              );
            })}
          </div>
        </div>
      </BottomSheet>

      {/* Category Bottom Sheet */}
      <BottomSheet
        isOpen={isCategoryOpen}
        title="카테고리를 선택해주세요"
        subtitle={record.type === 'expense' ? '한 가지만 선택할 수 있어요' : undefined}
        onClose={() => {
          setIsCategoryOpen(false);
          setSelectedCategoryId(null);
        }}
        onSave={handleCategorySave}
        isSaveDisabled={selectedCategoryId === null}
        height={record.type === 'expense' ? 636 : 492}
      >
        {record.type === 'income' ? (
          <div className="flex flex-wrap gap-2">
            {INCOME_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={cn(
                  'flex h-9.5 w-26.25 cursor-pointer items-center justify-center rounded-full border text-[16px] font-medium tracking-[-0.025em] transition-colors',
                  selectedCategoryId === category.id
                    ? 'border-[#13278a] bg-[#ecf2fb] text-[#13278a]'
                    : 'border-[#e5e5e5] text-[#474c52]'
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {EXPENSE_CATEGORIES.map((group) => (
              <div key={group.group} className="flex flex-col gap-3">
                <h3 className="text-[18px] font-semibold tracking-[-0.025em] text-[#27282c]">{group.group}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleCategorySelect(item.id)}
                      className={cn(
                        'flex h-9.5 w-26.25 cursor-pointer items-center justify-center gap-2 rounded-full border text-[16px] font-medium tracking-[-0.025em] transition-colors',
                        selectedCategoryId === item.id
                          ? 'border-[#13278a] bg-[#ecf2fb] text-[#13278a]'
                          : 'border-[#e5e5e5] text-[#474c52]'
                      )}
                    >
                      <span>{item.emoji}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </BottomSheet>

      {/* Payment Method Bottom Sheet (Expense Only) */}
      {record.type === 'expense' && (
        <BottomSheet
          isOpen={isPaymentOpen}
          title="결제 수단을 선택해주세요"
          onClose={() => {
            setIsPaymentOpen(false);
            setSelectedPaymentId(null);
          }}
          onSave={handlePaymentSave}
          isSaveDisabled={selectedPaymentId === null}
          height={492}
        >
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPaymentId(method.id)}
                className={cn(
                  'flex h-9.5 w-26.25 cursor-pointer items-center justify-center rounded-full border text-[16px] font-medium tracking-[-0.025em] transition-colors',
                  selectedPaymentId === method.id
                    ? 'border-[#13278a] bg-[#ecf2fb] text-[#13278a]'
                    : 'border-[#e5e5e5] text-[#474c52]'
                )}
              >
                {method.name}
              </button>
            ))}
          </div>
        </BottomSheet>
      )}

      {/* Emotion Bottom Sheet (Expense Only) */}
      {record.type === 'expense' && (
        <BottomSheet
          isOpen={isEmotionOpen}
          title="지출할 때의 감정을 선택해주세요"
          subtitle="세 가지까지 선택할 수 있어요"
          onClose={() => {
            setIsEmotionOpen(false);
            setSelectedEmotions([]);
          }}
          onSave={handleEmotionSave}
          isSaveDisabled={false}
          height={636}
        >
          <div className="flex flex-col gap-10">
            {EMOTIONS.map((group) => (
              <div key={group.group} className="flex flex-col gap-3">
                <h3 className="text-[18px] font-semibold tracking-[-0.025em] text-[#27282c]">{group.group}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleEmotionToggle(item.id)}
                      className={cn(
                        'flex h-9.5 w-26.25 cursor-pointer items-center justify-center gap-2 rounded-full border text-[16px] font-medium tracking-[-0.025em] transition-colors',
                        selectedEmotions.includes(item.id)
                          ? 'border-[#13278a] bg-[#ecf2fb] text-[#13278a]'
                          : 'border-[#e5e5e5] text-[#27282c]'
                      )}
                    >
                      <Image src={item.emoji} alt={item.label} width={24} height={24} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </BottomSheet>
      )}

      {/* Memo Bottom Sheet (Income) */}
      {record.type === 'income' && (
        <BottomSheet
          isOpen={isMemoOpen}
          title="메모를 입력해주세요"
          onClose={() => setIsMemoOpen(false)}
          onSave={handleMemoSave}
          height={429}
        >
          <textarea
            value={memoInput}
            onChange={(e) => setMemoInput(e.target.value.slice(0, 50))}
            placeholder="50자 이내로 입력해주세요"
            autoFocus
            className="h-25.25 w-full resize-none rounded-[10px] border border-[#e5e5e5] p-4 text-[16px] font-medium tracking-[-0.025em] text-[#27282c] placeholder:font-medium placeholder:text-[#9fa4a8] focus:border-[#13278a] focus:outline-none"
          />
          <div className="mt-2 text-right text-[14px] font-medium tracking-[-0.025em] text-[#9fa4a8]">
            {memoInput.length}/50
          </div>
        </BottomSheet>
      )}

      {/* Situation Tags & Memo Bottom Sheet (Expense) */}
      {record.type === 'expense' && (
        <BottomSheet
          isOpen={isSituationOpen}
          title="상황 태그 · 메모를 입력해주세요"
          subtitle="상황 태그는 두 가지만 선택할 수 있어요"
          onClose={() => setIsSituationOpen(false)}
          onSave={handleSituationSave}
          height={650}
        >
          <div className="flex flex-col gap-10">
            {/* 상황 태그 Section */}
            <div className="flex flex-col gap-3">
              <h3 className="text-[18px] font-semibold tracking-[-0.025em] text-[#27282c]">상황 태그</h3>
              <div className="flex flex-wrap gap-x-2 gap-y-2.5">
                {SITUATION_TAGS.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={cn(
                      'flex h-9.5 w-26.25 cursor-pointer items-center justify-center rounded-full border text-[16px] font-medium tracking-[-0.025em] transition-colors',
                      tempTags.includes(tag.id)
                        ? 'border-[#13278a] bg-[#ecf2fb] text-[#13278a]'
                        : 'border-[#e5e5e5] text-[#27282c]'
                    )}
                  >
                    #{tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 메모 Section */}
            <div className="flex flex-col gap-2">
              <h3 className="text-[18px] font-semibold tracking-[-0.025em] text-[#27282c]">메모</h3>
              <textarea
                value={tempMemo}
                onChange={(e) => setTempMemo(e.target.value.slice(0, 50))}
                placeholder="50자 이내로 입력해주세요"
                className="h-25.25 w-full resize-none rounded-[10px] border border-[#e5e5e5] p-4 text-[16px] font-medium tracking-[-0.025em] text-[#27282c] placeholder:font-medium placeholder:text-[#9fa4a8] focus:border-[#13278a] focus:outline-none"
              />
              <div className="text-right text-[14px] font-medium tracking-[-0.025em] text-[#9fa4a8]">
                {tempMemo.length}/50
              </div>
            </div>
          </div>
        </BottomSheet>
      )}

      {/* Save Button */}
      <div className="fixed right-0 bottom-0 left-0 mx-auto max-w-md bg-white">
        {!isAmountEditing && (
          <div className="px-4 pt-6 pb-12">
            <Button
              size="lg"
              onClick={submitHouseHoldPost}
              disabled={!isFormValid()}
            >
              저장
            </Button>
          </div>
        )}
        {isAmountEditing && <KeyBoardUserExperience changeAmount={handleAmountChange} />}
      </div>
    </div>
  );
}
