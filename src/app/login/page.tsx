import LoginContent from '@/widgets/login/LoginContent';
import { AuthGuard } from '@/shared/ui/guard/AuthGuard';

export default function LoginPage() {
  return (
    <AuthGuard>
      <LoginContent />
    </AuthGuard>
  )
}