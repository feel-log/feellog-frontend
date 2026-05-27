'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { subscribeForegroundMessage } from '@/shared/lib/firebase';

type FcmPayload = {
  notification?: { title?: string; body?: string };
  data?: { url?: string };
};

const FALLBACK_URL = '/notification';

function toSafeInternalPath(rawUrl?: string) {
  try {
    const parsed = new URL(rawUrl ?? FALLBACK_URL, window.location.origin);
    if (parsed.origin !== window.location.origin) return FALLBACK_URL;
    return `${parsed.pathname}${parsed.search}${parsed.hash}` || FALLBACK_URL;
  } catch {
    return FALLBACK_URL;
  }
}

export function ForegroundMessageHandler() {
  const router = useRouter();
  const routerRef = useRef(router);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (typeof Notification === 'undefined') return;

    try {
      const unsubscribe = subscribeForegroundMessage((payload) => {
      const { notification, data } = payload as FcmPayload;
      const title = notification?.title;
      const body = notification?.body;
      if (!title && !body) return;

      const targetUrl = toSafeInternalPath(data?.url);
      toast.custom(
        (id) => (
          <div
            onClick={() => {
              routerRef.current.push(targetUrl);
              toast.dismiss(id);
            }}
            className="group flex w-89 cursor-pointer items-start gap-3 overflow-hidden rounded-[14px] bg-white p-3.5 shadow-[0_10px_30px_-8px_rgba(19,39,138,0.25)] ring-1 ring-[#ECF2FB] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-8px_rgba(19,39,138,0.32)]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#13278A] to-[#3F52B5]">
              <Image src="/svg/icon_bell.svg" alt="" width={18} height={18} className="invert brightness-0" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              {title && (
                <span className="truncate text-[14px] font-semibold leading-normal tracking-[-0.025em] text-[#1C1D1F]">
                  {title}
                </span>
              )}
              {body && (
                <span className="line-clamp-2 text-[13px] font-medium leading-snug tracking-[-0.025em] text-[#474C52]">
                  {body}
                </span>
              )}
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="mt-1 shrink-0 text-[#9FA4A8] transition-transform group-hover:translate-x-0.5"
            >
              <path
                d="M8.7998 18.4L15.1998 12L8.7998 5.59998"
                stroke="currentColor"
                strokeWidth="1.86667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ),
        { duration: 5000 },
      );
      });

      if (Notification.permission === 'granted') {
        return unsubscribe;
      }
    } catch (error) {
      console.error('ForegroundMessageHandler error:', error);
    }
  }, []);

  return null;
}
