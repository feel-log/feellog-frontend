import type { Viewport } from 'next';
import LoginContent from '@/widgets/login/LoginContent';
import { AuthGuard } from '@/shared/ui/guard/AuthGuard';

export const viewport: Viewport = {
  themeColor: '#13278A',
};

export default function LoginPage() {
  return (
    <AuthGuard>
      <LoginContent />
    </AuthGuard>
  )
}