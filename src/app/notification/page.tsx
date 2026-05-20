'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/shared/lib/utils';
import { AuthGuard } from '@/shared/ui/guard/AuthGuard';
import PageHeader from '@/shared/ui/PageHeader';
import Skeleton from '@/shared/ui/Skeleton';
import RetroDeleteModal from '@/widgets/retro-history/RetroDeleteModal';
import { notificationQueries } from '@/entities/notification/api/notification-queries';
import {
  deleteAllNotificationsApi,
  readNotificationApi,
} from '@/entities/notification/api/notification-api';
import type { Notification } from '@/entities/notification/model/notification-schema';

function formatRelativeTime(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHour = Math.floor(diffMin / 60);

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return `${created.getMonth() + 1}월 ${created.getDate()}일`;
}

export default function NotiPage() {
  const queryClient = useQueryClient();
  const { data: notifications = [], isLoading } = useQuery(notificationQueries.list());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllNotificationsApi,
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: notificationQueries.all() });
    },
    onError: () => {
      setIsDeleteModalOpen(false);
      alert('삭제에 실패했어요. 잠시 후 다시 시도해주세요.');
    },
  });

  const readMutation = useMutation({
    mutationFn: readNotificationApi,
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationQueries.list().queryKey });
      const prev = queryClient.getQueryData<Notification[]>(notificationQueries.list().queryKey);
      queryClient.setQueryData<Notification[]>(
        notificationQueries.list().queryKey,
        (old) =>
          old?.map((n) =>
            n.notificationId === notificationId ? { ...n, isRead: true } : n,
          ) ?? old,
      );
      return { prev };
    },
    onError: (_err, _id, context) => {
      if (context?.prev) {
        queryClient.setQueryData(notificationQueries.list().queryKey, context.prev);
      }
    },
  });

  const handleNotificationClick = (noti: Notification) => {
    if (noti.isRead) return;
    readMutation.mutate(noti.notificationId);
  };

  return (
    <AuthGuard>
      <PageHeader title="알림" />
      <div className="noti__content flex h-[calc(100vh-60px)] flex-col">
        {isLoading ? (
          <>
            <Skeleton className="mt-5 mr-3 mb-3 h-5 w-16 self-end rounded" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="block h-[87px] w-full border-b border-solid border-gray-300 px-4 py-4"
              >
                <Skeleton className="mb-2.5 h-4 w-14 rounded" />
                <Skeleton className="h-5 w-3/4 rounded" />
              </div>
            ))}
          </>
        ) : notifications.length === 0 ? (
          <div className="not__noti flex h-full flex-col items-center justify-center">
            <span className="text-[18px] font-semibold leading-normal tracking-[-0.025em] text-[#474C52]">
              알림이 없어요
            </span>
            <span className="text-[14px] font-medium leading-normal tracking-[-0.025em] text-[#9FA4A8]">
              푸시 알림을 켜고 알림을 받아보세요
            </span>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={deleteAllMutation.isPending || notifications.length === 0}
              className="mt-5 mr-3 mb-3 self-end text-[14px] font-medium leading-normal tracking-[-0.025em] text-[#474C52] disabled:opacity-50"
            >
              전체 삭제
            </button>
            {notifications.map((noti) => (
              <button
                key={noti.notificationId}
                type="button"
                onClick={() => handleNotificationClick(noti)}
                className={cn(
                  'flex h-[87px] w-full flex-col justify-center gap-2.5 border-b border-solid border-[#CACDD2] px-4 text-left',
                  !noti.isRead ? 'bg-[#ECF2FB] cursor-pointer' : 'cursor-default bg-white',
                )}
              >
                <span className="text-[14px] font-medium leading-normal tracking-[-0.025em] text-[#73787E]">
                  {formatRelativeTime(noti.createdAt)}
                </span>
                <span className="text-[16px] font-semibold leading-normal tracking-[-0.025em] text-[#1C1D1F]">
                  {noti.body}
                </span>
              </button>
            ))}
          </>
        )}
      </div>

      <RetroDeleteModal
        isOpen={isDeleteModalOpen}
        title="알림을 모두 삭제하시겠어요?"
        onConfirm={() => deleteAllMutation.mutate()}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </AuthGuard>
  );
}
