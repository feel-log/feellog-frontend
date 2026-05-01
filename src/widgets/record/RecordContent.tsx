'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/shared/ui/PageHeader';
import BottomSheet from '@/shared/ui/BottomSheet';
import Button from '@/shared/ui/Button';
import SelectField from '@/shared/ui/SelectField';
import { cn } from '@/shared/lib/utils';
import KeyBoardUserExperience from '@/shared/ui/record/KeyBoardUserExperience';

interface RecordState {
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
  paymentMethod?: string;
  emotion?: string;
  situationTags?: string[];
  memo: string;
}

const INCOME_CATEGORIES = ['급여', '용돈', '부수입', '상여금', '금융 수입', '기타'];

const EXPENSE_CATEGORIES = [
  {
    group: '생활',
    items: [
      { label: '식비', emoji: '🍔' },
      { label: '카페', emoji: '☕' },
      { label: '생필품', emoji: '🧼' },
    ],
  },
  {
    group: '소비',
    items: [
      { label: '의류', emoji: '👚' },
      { label: '교통비', emoji: '🚌' },
      { label: '의료', emoji: '🏥' },
      { label: '교육', emoji: '✏️' },
      { label: '경조사', emoji: '🎉' },
    ],
  },
  {
    group: '고정',
    items: [
      { label: '공과금', emoji: '💸' },
      { label: '주거', emoji: '🏠' },
      { label: '보험료', emoji: '📄' },
      { label: '저축', emoji: '💰' },
    ],
  },
  {
    group: '여가',
    items: [
      { label: '취미', emoji: '🎨' },
      { label: '뷰티', emoji: '💅' },
      { label: '문화생활', emoji: '🎭' },
    ],
  },
];

const PAYMENT_METHODS = ['카드', '현금', '계좌', '기타'];

const EMOTIONS = [
  {
    group: '긍정',
    items: [
      { label: '기쁨', emoji: '/svg/emo/happy.svg' },
      { label: '설렘', emoji: '/svg/emo/flut.svg' },
      { label: '뿌듯함', emoji: '/svg/emo/proud.svg' },
      { label: '고마움', emoji: '/svg/emo/thanks.svg' },
    ],
  },
  {
    group: '부정',
    items: [
      { label: '짜증', emoji: '/svg/emo/annoy.svg' },
      { label: '화남', emoji: '/svg/emo/angry.svg' },
      { label: '불안함', emoji: '/svg/emo/anxios.svg' },
      { label: '슬픔', emoji: '/svg/emo/sad.svg' },
      { label: '스트레스', emoji: '/svg/emo/stress.svg' },
      { label: '우울함', emoji: '/svg/emo/depressed.svg' },
    ],
  },
  {
    group: '기타',
    items: [
      { label: '심심함', emoji: '/svg/emo/boring.svg' },
      { label: '피곤함', emoji: '/svg/emo/tired.svg' },
      { label: '공허함', emoji: '/svg/emo/emptiness.svg' },
      { label: '외로움', emoji: '/svg/emo/lonely.svg' },
      { label: '충동', emoji: '/svg/emo/impulse.svg' },
    ],
  },
];

const SITUATION_TAGS = ['#피로회복', '#기분전환', '#보상심리', '#할인', '#충동소비', '#필요', '#약속', '#지각', '#기타'];

const DAY_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

function formatDateDisplay(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = DAY_OF_WEEK[date.getDay()];
  return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`;
}

function getCategoryDisplay(category: string): string {
  return category;
}

function renderSituationTagsDisplay(tags: string[], memo: string): React.ReactNode {
  const cleanTags = (tags || []).map((tag) => tag.replace(/^#/, ''));
  if (cleanTags.length === 0 && !memo) return '';

  return (
    <div className="flex items-center gap-1.5">
      {cleanTags.length > 0 && (
        <span className="text-[17px] font-semibold tracking-[-0.025em] text-[#13278a]">
          {cleanTags.join(' ')}
        </span>
      )}
      {cleanTags.length > 0 && memo && <span className="h-3 w-px bg-[#cacdd2]" />}
      {memo && (
        <span className="text-[17px] font-semibold tracking-[-0.025em] text-[#13278a]">
          {memo}
        </span>
      )}
    </div>
  );
}

export default function RecordContent() {
  const searchParams = useSearchParams();

  const today = '2026-04-22';
  const selectedDate = searchParams?.get('date') || today;
  const typeParam = searchParams?.get('type');
  const isAssetMode = typeParam === 'asset';
  const initialType: 'income' | 'expense' = typeParam === 'income' ? 'income' : 'expense';

  const [record, setRecord] = useState<RecordState>({
    amount: 0,
    type: initialType,
    date: selectedDate,
    category: '',
    paymentMethod: '',
    emotion: '',
    situationTags: [],
    memo: '',
  });

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isEmotionOpen, setIsEmotionOpen] = useState(false);
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [isSituationOpen, setIsSituationOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [memoInput, setMemoInput] = useState('');
  const [tempTags, setTempTags] = useState<string[]>([]);
  const [tempMemo, setTempMemo] = useState('');
  const [isDateSelected, setIsDateSelected] = useState(false);

  const [amountInput, setAmountInput] = useState('');
  const [isAmountEditing, setIsAmountEditing] = useState(false);
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
      // eslint-disable-next-line no-eval
      const result = eval(normalized);
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
      // eslint-disable-next-line no-eval
      const result = eval(normalized);
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

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCategorySave = () => {
    setRecord((prev) => ({
      ...prev,
      category: selectedCategory,
    }));
    setIsCategoryOpen(false);
    setSelectedCategory('');
  };

  const handlePaymentSave = () => {
    setRecord((prev) => ({
      ...prev,
      paymentMethod: selectedPayment,
    }));
    setIsPaymentOpen(false);
    setSelectedPayment('');
  };

  const handleEmotionSave = () => {
    setRecord((prev) => ({
      ...prev,
      emotion: selectedEmotion,
    }));
    setIsEmotionOpen(false);
    setSelectedEmotion('');
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
      situationTags: tempTags,
      memo: tempMemo,
    }));
    setIsSituationOpen(false);
    setTempTags([]);
    setTempMemo('');
  };

  const handleTagToggle = (tag: string) => {
    if (tempTags.includes(tag)) {
      setTempTags(tempTags.filter((t) => t !== tag));
    } else if (tempTags.length < 2) {
      setTempTags([...tempTags, tag]);
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


  return (
    <div className="min-h-screen bg-white">
      <PageHeader title={isAssetMode ? '자산' : '가계부'} />

      <div className="px-6 py-6 pb-40">
        {/* Amount Section */}
        <div className="mb-1">
          <div className="flex items-center gap-1.25">
            <>
              <h2 className={cn('pb-4 text-[28px] font-semibold tracking-[-0.025em]', record.type === 'expense' && (isAmountEditing ? getDisplayAmount() : record.amount) !== 0 ? 'text-[#eb1c1c]' : 'text-[#030303]')}>
                {isAmountEditing ? getDisplayAmount().toLocaleString() : record.amount.toLocaleString()}원
              </h2>
              <button
                onClick={() => {
                  setAmountInput(record.amount.toString());
                  setIsAmountEditing(true);
                }}
                className="cursor-pointer pb-4"
              >
                <Image src="/svg/icon_pencil.svg" alt="edit" width={30} height={30} />
              </button>
            </>
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
                  onClick={() =>
                    setRecord((prev) => ({
                      ...prev,
                      type,
                      category: '',
                      paymentMethod: '',
                      emotion: '',
                      situationTags: [],
                      memo: '',
                    }))
                  }
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

        {/* Date Section (Hidden in Asset Mode) */}
        {!isAssetMode && (
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
        )}

        {/* Payment Method Section (Expense Only) */}
        {record.type === 'expense' && (
          <SelectField
            label="결제 수단"
            value={record.paymentMethod || ''}
            placeholder="결제 수단을 선택하세요"
            onClick={() => setIsPaymentOpen(true)}
          />
        )}

        {/* Category Section */}
        <SelectField
          label="카테고리"
          value={getCategoryDisplay(record.category)}
          placeholder="카테고리를 선택하세요"
          onClick={() => setIsCategoryOpen(true)}
        />

        {/* Emotion Section (Expense Only) */}
        {record.type === 'expense' && (
          <SelectField
            label="감정"
            value={record.emotion || ''}
            placeholder="감정을 선택하세요"
            onClick={() => setIsEmotionOpen(true)}
          />
        )}

        {/* Situation Tags & Memo (Expense Only) or Memo (Income) */}
        {record.type === 'expense' ? (
          <SelectField
            label="상황 태그 · 메모"
            value={renderSituationTagsDisplay(record.situationTags || [], record.memo)}
            placeholder="상황 태그·메모를 입력하세요"
            onClick={() => {
              setTempTags([...(record.situationTags || [])]);
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
              disabled={
                calendarMonth.year === new Date(today).getFullYear() &&
                calendarMonth.month === new Date(today).getMonth() + 1
              }
              className={cn(
                calendarMonth.year === new Date(today).getFullYear() &&
                calendarMonth.month === new Date(today).getMonth() + 1
                  ? 'cursor-not-allowed opacity-45'
                  : 'cursor-pointer'
              )}
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
              return (
                <button
                  key={idx}
                  onClick={() => setTempDate(item.date)}
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
          setSelectedCategory('');
        }}
        onSave={handleCategorySave}
        isSaveDisabled={selectedCategory === ''}
        height={record.type === 'expense' ? 636 : 492}
      >
        {record.type === 'income' ? (
          <div className="flex flex-wrap gap-2">
            {INCOME_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={cn(
                  'flex h-9.5 w-26.25 cursor-pointer items-center justify-center rounded-full border text-[16px] font-medium tracking-[-0.025em] transition-colors',
                  selectedCategory === category
                    ? 'border-[#13278a] bg-[#ecf2fb] text-[#13278a]'
                    : 'border-[#e5e5e5] text-[#474c52]'
                )}
              >
                {category}
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
                      key={item.label}
                      onClick={() => handleCategorySelect(item.label)}
                      className={cn(
                        'flex h-9.5 w-26.25 cursor-pointer items-center justify-center gap-2 rounded-full border text-[16px] font-medium tracking-[-0.025em] transition-colors',
                        selectedCategory === item.label
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
            setSelectedPayment('');
          }}
          onSave={handlePaymentSave}
          isSaveDisabled={selectedPayment === ''}
          height={492}
        >
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method}
                onClick={() => setSelectedPayment(method)}
                className={cn(
                  'flex h-9.5 w-26.25 cursor-pointer items-center justify-center rounded-full border text-[16px] font-medium tracking-[-0.025em] transition-colors',
                  selectedPayment === method
                    ? 'border-[#13278a] bg-[#ecf2fb] text-[#13278a]'
                    : 'border-[#e5e5e5] text-[#474c52]'
                )}
              >
                {method}
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
            setSelectedEmotion('');
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
                      key={item.label}
                      onClick={() => setSelectedEmotion(item.label)}
                      className={cn(
                        'flex h-9.5 w-26.25 cursor-pointer items-center justify-center gap-2 rounded-full border text-[16px] font-medium tracking-[-0.025em] transition-colors',
                        selectedEmotion === item.label
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
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={cn(
                      'flex h-9.5 w-26.25 cursor-pointer items-center justify-center rounded-full border text-[16px] font-medium tracking-[-0.025em] transition-colors',
                      tempTags.includes(tag)
                        ? 'border-[#13278a] bg-[#ecf2fb] text-[#13278a]'
                        : 'border-[#e5e5e5] text-[#27282c]'
                    )}
                  >
                    {tag}
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
            onClick={() => {
              if (isAssetMode) {
                console.log('Asset saved:', record);
              } else {
                console.log('Record saved:', record);
              }
            }}
            disabled={
              isAssetMode
                ? record.category === ''
                : record.category === '' || (record.type === 'expense' && record.paymentMethod === '')
            }
            size="lg"
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
