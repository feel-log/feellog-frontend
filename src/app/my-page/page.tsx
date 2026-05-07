"use client";

import { useState } from 'react';
import PageHeader from '@/shared/ui/PageHeader';
import { UserBox } from '@/entities/user';
import CommonFeature from '@/shared/ui/my-page/CommonFeature';
import { useUser } from '@/shared/store';
import { AuthGuard } from '@/shared/ui/guard/AuthGuard';
import { LogoutModal } from '@/features/logout/ui/LogoutModal';
import Footer from '@/shared/ui/Footer';


export default function MyPage() {
  const { getUser } = useUser();
  const user = getUser();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <AuthGuard>
      <PageHeader title={'마이페이지'} />
      <UserBox />
      <CommonFeature title={'푸시 알림'} secondary={'푸시 알림'} />
      <CommonFeature
        title={'로그아웃'}
        secondary={user?.nickname.startsWith('guest') ? '로그인하기' : '로그아웃'}
        changeLogoutModal={(bool: boolean) =>  setIsLogoutModalOpen(bool)}
      />
      <LogoutModal isOpen={isLogoutModalOpen} onClose={setIsLogoutModalOpen} />
      <Footer />
    </AuthGuard>
  );
}