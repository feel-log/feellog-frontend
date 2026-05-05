import RetroContent from '@/widgets/retro/RetroContent';
import { AuthGuard } from '@/shared/ui/guard/AuthGuard';

export default function RetroPage() {
  return (
    <AuthGuard>
      <RetroContent />
    </AuthGuard>
  );
}
