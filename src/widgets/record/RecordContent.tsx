'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/shared/ui/PageHeader';
import BottomSheet from '@/shared/ui/BottomSheet';
import Button from '@/shared/ui/Button';
import SelectField from '@/shared/ui/SelectField';
import { cn } from '@/lib/utils';
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
      { label: '생필품', emoji: '🌿' },
    ],
  },
  {
    group: '소비',
    items: [
      { label: '의류', emoji: '👕' },
      { label: '교통비', emoji: '🚌' },
      { label: '의료', emoji: '🏥' },
      { label: '교육', emoji: '✏️' },
      { label: '경조사', emoji: '🎉' },
    ],
  },
  {
    group: '고정',
    items: [
      { label: '공과금', emoji: '⚡' },
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

function getCategoryDisplay(category: string, type: 'income' | 'expense'): string {
  if (type === 'income') {
    return category;
  }
  for (const group of EXPENSE_CATEGORIES) {
    for (const item of group.items) {
      if (item.label === category) {
        return `${item.emoji} ${item.label}`;
      }
    }
  }
  return category;
}

function getSituationTagsDisplay(tags: string[]): string {
  if (!tags || tags.length === 0) return '';
  return tags[0];
}

export default function RecordContent() {
  const searchParams = useSearchParams();

  const today = '2026-04-22';
  const selectedDate = searchParams?.get('date') || today;
  const typeParam = searchParams?.get('type');
  const isAssetMode = typeParam === 'asset';
  const initialType: 'income' | 'expense' = typeParam === 'expense' ? 'expense' : 'income';

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

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
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
          <div className="flex items-center gap-2">
            <>
              <h2 className="pb-4 text-2xl font-bold text-gray-800">
                {isAmountEditing ? getDisplayAmount().toLocaleString() : record.amount.toLocaleString()}원
              </h2>
              <button
                onClick={() => {
                  setAmountInput(record.amount.toString());
                  setIsAmountEditing(true);
                }}
                className="cursor-pointer pb-4"
              >
                <Image src="/svg/icon_pencil.svg" alt="edit" width={20} height={20} />
              </button>
            </>
          </div>
        </div>

        {/* Type Selection (Hidden in Asset Mode) */}
        {!isAssetMode && (
          <div className="mb-8 flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              isActive={record.type === 'income'}
              onClick={() =>
                setRecord((prev) => ({
                  ...prev,
                  type: 'income',
                  category: '',
                  paymentMethod: '',
                  emotion: '',
                  situationTags: [],
                  memo: '',
                }))
              }
              className="cursor-pointer rounded-full"
            >
              수입
            </Button>
            <Button
              variant="secondary"
              size="sm"
              isActive={record.type === 'expense'}
              onClick={() =>
                setRecord((prev) => ({
                  ...prev,
                  type: 'expense',
                  category: '',
                  paymentMethod: '',
                  emotion: '',
                  situationTags: [],
                  memo: '',
                }))
              }
              className="cursor-pointer rounded-full"
            >
              지출
            </Button>
          </div>
        )}

        {/* Date Section (Hidden in Asset Mode) */}
        {!isAssetMode && (
          <SelectField
            label="날짜"
            value={formatDateDisplay(record.date)}
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

        {/* Category Section */}
        <SelectField
          label="카테고리"
          value={getCategoryDisplay(record.category, record.type)}
          placeholder="카테고리를 선택하세요"
          onClick={() => setIsCategoryOpen(true)}
        />

        {/* Payment Method Section (Expense Only) */}
        {record.type === 'expense' && (
          <SelectField
            label="결제 수단"
            value={record.paymentMethod || ''}
            placeholder="결제 수단을 선택하세요"
            onClick={() => setIsPaymentOpen(true)}
          />
        )}

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
            value={getSituationTagsDisplay(record.situationTags || []) || record.memo}
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
      >
        <div className="mb-6">
          <div className="mb-4 flex items-center">
            <button
              onClick={() => {
                if (calendarMonth.month === 1) {
                  setCalendarMonth({ year: calendarMonth.year - 1, month: 12 });
                } else {
                  setCalendarMonth({ ...calendarMonth, month: calendarMonth.month - 1 });
                }
              }}
              className="cursor-pointer text-gray-500 hover:text-gray-700"
            >
              <Image src={'/svg/icon_arrow_left_fill.svg'} alt={'left'} width={20} height={20} />
            </button>
            <h3 className="px-3 text-lg font-semibold">
              {calendarMonth.year}년 {calendarMonth.month}월
            </h3>
            <button
              onClick={() => {
                if (calendarMonth.month === 12) {
                  setCalendarMonth({ year: calendarMonth.year + 1, month: 1 });
                } else {
                  setCalendarMonth({ ...calendarMonth, month: calendarMonth.month + 1 });
                }
              }}
              className="cursor-pointer text-gray-500 hover:text-gray-700"
            >
              <Image
                src={'/svg/icon_arrow_left_fill.svg'}
                alt={'left'}
                width={20}
                height={20}
                className={'rotate-180'}
              />
            </button>
          </div>

          <div className="mb-3 grid grid-cols-7 gap-2 text-center">
            {DAY_OF_WEEK.map((day) => (
              <div key={day} className="text-xs font-semibold text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {getCalendarDays().map((item, idx) => {
              const isSelected = item.date === tempDate;
              const isToday = item.date === today;
              return (
                <button
                  key={idx}
                  onClick={() => setTempDate(item.date)}
                  className={cn(
                    'relative aspect-square cursor-pointer text-sm transition-colors',
                    !item.isCurrentMonth && 'text-gray-300',
                    isSelected && 'relative flex items-center justify-center text-white',
                    isToday && !isSelected && 'text-black'
                  )}
                >
                  {isSelected && <div className="absolute h-8 w-8 rounded-full bg-[#13278a]" />}
                  {isToday && !isSelected && (
                    <div className="absolute top-1/2 left-1/2 h-8 w-8 -translate-1/2 rounded-full bg-gray-300" />
                  )}
                  <span className="relative z-10">{item.day}</span>
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
        onClose={() => {
          setIsCategoryOpen(false);
          setSelectedCategory('');
        }}
        onSave={handleCategorySave}
        isSaveDisabled={selectedCategory === ''}
      >
        {record.type === 'income' ? (
          <div className="category__wrapper">
            <div className="mb-50 grid grid-cols-3 gap-2 space-y-2">
              {INCOME_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={cn(
                    'mb-0 w-full cursor-pointer rounded-[30px] px-1 py-2 text-center text-[14px] transition-colors',
                    selectedCategory === category
                      ? 'border border-[#13278a] bg-[#ecf2fb] font-medium text-[#13278a]'
                      : 'border border-gray-200 text-gray-900 hover:border-gray-300'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {EXPENSE_CATEGORIES.map((group) => (
              <div key={group.group}>
                <h3 className="mb-3 text-sm font-semibold text-gray-700">{group.group}</h3>
                <div className="grid grid-cols-3 gap-2">
                  {group.items.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleCategorySelect(item.label)}
                      className={cn(
                        'flex items-center justify-center gap-1 rounded-full border px-3 py-2 text-sm transition-colors',
                        selectedCategory === item.label
                          ? 'border-[#13278a] bg-[#ecf2fb] font-medium text-[#13278a]'
                          : 'border-gray-200 text-gray-900 hover:border-gray-300'
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
        >
          <div className="grid grid-cols-3 gap-2 space-y-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method}
                onClick={() => setSelectedPayment(method)}
                className={cn(
                  'mb-0 w-full cursor-pointer rounded-[30px] px-1 py-2 text-center text-[14px] transition-colors',
                  selectedPayment === method
                    ? 'border border-[#13278a] bg-[#ecf2fb] font-medium text-[#13278a]'
                    : 'border border-gray-200 text-gray-900 hover:border-gray-300'
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
          title="감정을 선택해주세요"
          onClose={() => {
            setIsEmotionOpen(false);
            setSelectedEmotion('');
          }}
          onSave={handleEmotionSave}
          isSaveDisabled={selectedEmotion === ''}
        >
          <div className="space-y-6">
            {EMOTIONS.map((group) => (
              <div key={group.group}>
                <h3 className="mb-3 text-sm font-semibold text-gray-700">{group.group}</h3>
                <div className="grid grid-cols-3 gap-2">
                  {group.items.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setSelectedEmotion(item.label)}
                      className={cn(
                        'rounded-full border px-3 py-2 text-sm transition-colors flex justify-center items-center gap-3',
                        selectedEmotion === item.label
                          ? 'border-[#13278a] bg-[#ecf2fb] font-medium text-[#13278a]'
                          : 'border-gray-200 text-gray-900 hover:border-gray-300'
                      )}
                    >
                      <Image src={item.emoji} alt={item.label} width={14} height={14} />
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
          title="메모를 입력해주세요."
          onClose={() => setIsMemoOpen(false)}
          onSave={handleMemoSave}
          isSaveDisabled={memoInput.trim() === ''}
        >
          <textarea
            value={memoInput}
            onChange={(e) => setMemoInput(e.target.value.slice(0, 100))}
            placeholder="100자 이내로 입력해주세요."
            autoFocus
            className="h-32 w-full resize-none rounded-lg border border-gray-200 p-3 focus:border-blue-600 focus:outline-none"
          />
          <div className="mt-2 text-right text-sm text-gray-500">{memoInput.length}/100</div>
        </BottomSheet>
      )}

      {/* Situation Tags & Memo Bottom Sheet (Expense) */}
      {record.type === 'expense' && (
        <BottomSheet
          isOpen={isSituationOpen}
          title="상황 태그 · 메모를 입력해주세요"
          onClose={() => setIsSituationOpen(false)}
          onSave={handleSituationSave}
          isSaveDisabled={tempTags.length === 0 && tempMemo.trim() === ''}
        >
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm text-gray-600">상황 태그는 두 가지만 선택할 수 있어요</p>
              <div className="grid grid-cols-3 gap-2">
                {SITUATION_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={cn(
                      'rounded-full border px-3 py-2 text-sm transition-colors',
                      tempTags.includes(tag)
                        ? 'border-[#13278a] bg-[#ecf2fb] font-medium text-[#13278a]'
                        : 'border-gray-200 text-gray-900 hover:border-gray-300'
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <textarea
                value={tempMemo}
                onChange={(e) => setTempMemo(e.target.value.slice(0, 100))}
                placeholder="100자 이내로 입력해주세요."
                className="h-32 w-full resize-none rounded-lg border border-gray-200 p-3 focus:border-blue-600 focus:outline-none"
              />
              <div className="mt-2 text-right text-sm text-gray-500">{tempMemo.length}/100</div>
            </div>
          </div>
        </BottomSheet>
      )}

      {/* Save Button */}
      <div className="fixed right-0 bottom-0 left-0 mx-auto max-w-md border-t border-gray-200 bg-white px-6 py-4">
        {!isAmountEditing &&
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
        </Button>}
        {isAmountEditing && <KeyBoardUserExperience changeAmount={handleAmountChange} />}
      </div>
    </div>
  );
}
