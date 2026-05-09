'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/shared/store';
import { useToken } from '@/shared/store';

interface EmptyExpenseStateProps {
  dateString: string;
}

export default function EmptyExpenseState({ dateString }: EmptyExpenseStateProps) {
  const router = useRouter();
  const { getUser } = useUser();
  const { setErrorBox, getAccessToken } = useToken();
  const user = getUser();
  const accessToken = getAccessToken();

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="mb-4 self-start text-[16px] font-medium text-gray-500">
        아직 지출이 없어요
      </p>
      <button
        onClick={() => {
          if (!accessToken || user?.nickname?.startsWith('guest')) {
            setErrorBox(true);
            return;
          }
          router?.push(`/record?date=${dateString}`);
        }}
        className="w-full rounded-[10px] border border-[#e5e5e5] py-3 text-center text-[16px] font-medium text-[#27282c] transition-colors hover:bg-gray-50"
      >
        오늘의 지출 기록하러가기
      </button>
    </div>
  );
}
