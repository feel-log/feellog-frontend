"use client";

import PageHeader from '@/shared/ui/PageHeader';
import { UserBox } from '@/entities/user';

export default function MyPage() {
    return (
      <div>
        <PageHeader title={"마이페이지"} />
        <UserBox />
      </div>
    )
}