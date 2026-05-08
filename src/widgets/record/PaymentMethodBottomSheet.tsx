'use client';

import BottomSheet from '@/shared/ui/BottomSheet';
import { cn } from '@/shared/lib/utils';

interface PaymentMethod {
  id: number;
  name: string;
}

interface PaymentMethodBottomSheetProps {
  isOpen: boolean;
  selectedPaymentId: number | null;
  paymentMethods: PaymentMethod[];
  onPaymentSelect: (id: number) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function PaymentMethodBottomSheet({
  isOpen,
  selectedPaymentId,
  paymentMethods,
  onPaymentSelect,
  onClose,
  onSave,
}: PaymentMethodBottomSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      title="결제 수단을 선택해주세요"
      onClose={() => {
        onClose();
      }}
      onSave={onSave}
      isSaveDisabled={selectedPaymentId === null}
      height={492}
    >
      <div className="flex flex-wrap gap-2">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onPaymentSelect(method.id)}
            className={cn(
              'flex h-[38px] w-[105px] cursor-pointer items-center justify-center rounded-full border text-[16px] font-medium tracking-[-0.025em] transition-colors',
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
  );
}
