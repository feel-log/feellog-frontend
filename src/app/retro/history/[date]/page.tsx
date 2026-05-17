import RetroHistoryDetailContent from '@/widgets/retro-history/RetroHistoryDetailContent';
import { AuthGuard } from '@/shared/ui/guard/AuthGuard';

interface PageProps {
  params: Promise<{ date: string }>;
}

export default async function RetroHistoryDetailPage({ params }: PageProps) {
  const { date } = await params;
  return (
    <AuthGuard>
      <RetroHistoryDetailContent date={date} />
    </AuthGuard>
  );
}
