import RetroHistoryContent from '@/widgets/retro-history/RetroHistoryContent';
import { AuthGuard } from '@/shared/ui/guard/AuthGuard';

export default function RetroHistoryPage() {
  return (
    <AuthGuard>
      <RetroHistoryContent />
    </AuthGuard>
  );
}
