import Image from 'next/image';
import { useUserGetter } from '@/entities/user';
import { useToken, useUser } from '@/shared/store';

export function UserBox() {
  const { getAccessToken } = useToken();
  const { getUser } = useUser();
  const accessToken = getAccessToken();
  const user = getUser();

  const query = useUserGetter(accessToken);

  return (
    <div className={'user-box-wrapper px-5'}>
      <div
        className={
          'user-box bg-gray-1푸시 알림 토글 버튼색과 크기 맞추기00 mt-5 mb-6.25 flex gap-3 rounded-[12px] p-4'
        }
      >
        <div className={'profile relative h-15 w-15 rounded-full'}>
          <Image src={'/svg/free_log_chc.png'} alt={'profile'} fill />
        </div>
        <div className={'info flex flex-col justify-center p-1.25'}>
          {(query.isLoading || !user) && (
            <div className={'text-[14px]'}>정보를 불러오고 있습니다.</div>
          )}
          {!query.isLoading && user && (
            <>
              <span className={'font-bold'}>{user ? user.nickname : '손님'}</span>
              <span className={'text-[14px]'}>
                {user?.provider === 'GOOGLE'
                  ? '구글로 로그인되었습니다.'
                  : user?.provider === 'KAKAO'
                    ? '카카오로 로그인되었습니다.'
                    : '로그인하세요'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}