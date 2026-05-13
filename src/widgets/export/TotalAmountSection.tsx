'use client';

interface TotalAmountSectionProps {
  totalAmount: number;
}

export default function TotalAmountSection({ totalAmount }: TotalAmountSectionProps) {
  return (
    <div className="border-b-[5px] border-[#f7f8fa] px-4 pt-5 pb-3.75">
      <p className="text-[18px] font-semibold tracking-[-0.025em] text-[#27282c]">지출</p>
      <p className="text-[28px] font-semibold tracking-[-0.025em] text-[#eb1c1c]" data-testid="total-amount">
        {totalAmount.toLocaleString()}원
      </p>
    </div>
  );
}
