import type { Viewport } from 'next';
import LoginContent from '@/widgets/login/LoginContent';

export const viewport: Viewport = {
  themeColor: '#13278A',
};

export default function LoginPage() {
  return <LoginContent />
}