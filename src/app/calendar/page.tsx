import CalendarContent from '@/widgets/calendar/CalendarContent';
import { AuthGuard } from '@/shared/ui/guard/AuthGuard';

export default function CalendarPage() {
  return <AuthGuard><CalendarContent /></AuthGuard>;
}
