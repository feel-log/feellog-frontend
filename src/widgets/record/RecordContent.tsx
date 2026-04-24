'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/shared/ui/PageHeader';
import BottomSheet from '@/shared/ui/BottomSheet';
import Button from '@/shared/ui/Button';
import SelectField from '@/shared/ui/SelectField';
import { cn } from '@/lib/utils';

interface RecordState {
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
  memo: string;
}

const CATEGORIES = ['급여','용돈','부수입','상여금','금융 수입','기타'];

const DAY_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

function formatDateDisplay(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = DAY_OF_WEEK[date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
}

export default function RecordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const today = '2026-04-22';
  const selectedDate = searchParams?.get('date') || today;

  const [record, setRecord] = useState<RecordState>({
    amount: 0,
    type: 'income',
    date: selectedDate,
    category: '',
    memo: '',
  });

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [memoInput, setMemoInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [isAmountEditing, setIsAmountEditing] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmountInput(value);
  };

  const handleAmountSave = () => {
    setRecord((prev) => ({
      ...prev,
      amount: parseInt(amountInput) || 0,
    }));
    setIsAmountEditing(false);
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

  const handleMemoSave = () => {
    setRecord((prev) => ({
      ...prev,
      memo: memoInput,
    }));
    setIsMemoOpen(false);
  };

  const handleRecordSave = () => {
    console.log('Record saved:', record);
  };

  useEffect(() => {
    setAmountInput(record.amount.toString());
  }, [record]);

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="가계부" />

      <div className="px-6 py-6 pb-40">
        {/* Amount Section */}
        <div className="mb-1">
          <div className="flex items-center gap-2">
            {isAmountEditing ? (
              <div className="flex items-center gap-2 pb-4">
                <input
                  type="text"
                  inputMode="numeric"
                  value={amountInput}
                  onChange={handleAmountChange}
                  autoFocus
                  className="w-32 border-b-2 border-blue-600 text-2xl font-bold outline-none"
                />
                <span className="text-2xl font-bold text-gray-800">원</span>
                <button
                  onClick={handleAmountSave}
                  className="ml-2 cursor-pointer font-semibold text-blue-600"
                >
                  완료
                </button>
              </div>
            ) : (
              <>
                <h2 className="pb-4 text-2xl font-bold text-gray-800">
                  {record.amount.toLocaleString()}원
                </h2>
                <button onClick={() => setIsAmountEditing(true)} className="cursor-pointer pb-4">
                  <Image src="/svg/icon_pencil.svg" alt="edit" width={20} height={20} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Type Selection */}
        <div className="mb-8 flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            isActive={record.type === 'income'}
            onClick={() => setRecord((prev) => ({ ...prev, type: 'income' }))}
            className="rounded-full cursor-pointer"
          >
            수입
          </Button>
          <Button
            variant="secondary"
            size="sm"
            isActive={record.type === 'expense'}
            onClick={() => setRecord((prev) => ({ ...prev, type: 'expense' }))}
            className="rounded-full cursor-pointer"
          >
            지출
          </Button>
        </div>

        {/* Date Section */}
        <SelectField
          label="날짜"
          value={formatDateDisplay(record.date)}
          placeholder="날짜를 선택하세요"
          onClick={() => {
            // TODO: Open date picker if needed
          }}
        />

        {/* Category Section */}
        <SelectField
          label="카테고리"
          value={record.category}
          placeholder="카테고리를 선택하세요"
          onClick={() => setIsCategoryOpen(true)}
        />

        {/* Memo Section */}
        <SelectField
          label="메모"
          value={record.memo}
          placeholder="내용을 입력하세요"
          onClick={() => {
            setMemoInput(record.memo);
            setIsMemoOpen(true);
          }}
        />
      </div>

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
        <div className={"category__wrapper"}>
          <div className="mb-50 grid grid-cols-3 gap-2 space-y-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={cn(
                  'mb-0 w-full cursor-pointer rounded-[30px] px-1 py-2 text-center text-[14px] transition-colors',
                  selectedCategory === category
                    ? 'bg-[#ecf2fb] border border-[#13278a] text-[#13278a] font-medium'
                    : 'border border-gray-200 text-gray-900 hover:border-gray-300'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* Memo Bottom Sheet */}
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
        <div className="mt-2 text-right text-sm text-gray-500">
          {memoInput.length}/100
        </div>
      </BottomSheet>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 py-4 bg-white">
        <Button
          onClick={handleRecordSave}
          disabled={record.category === '' || record.memo.trim() === ''}
          size="lg"
        >
          저장
        </Button>
      </div>
    </div>
  );
}
