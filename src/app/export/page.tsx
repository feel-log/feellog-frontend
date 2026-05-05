import { Suspense } from 'react';
import ExportContent from '@/widgets/export/ExportContent';
import { AuthGuard } from '@/shared/ui/guard/AuthGuard';

function ExportPageContent() {
  return <ExportContent />;
}

export default function ExportPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="flex items-center justify-center py-20"><p className="text-[14px] text-[#9FA4A8]">불러오는 중...</p></div>}>
        <ExportPageContent />
      </Suspense>
    </AuthGuard>
  );
}
