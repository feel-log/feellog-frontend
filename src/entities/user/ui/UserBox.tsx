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
    <div className={"user-box-wrapper px-5"}>
      <div className={"user-box mt-5 mb-6.25 bg-gray-200 p-4 rounded-[12px] flex gap-3"}>
        <div className={"profile w-15 h-15 rounded-full relative"}>
          <Image src={"/svg/free_log_chc.png"} alt={"profile"} fill />
        </div>
        <div className={"info p-1.25 flex flex-col justify-center"}>
          {(query.isLoading || !user ) && <div className={"text-[14px]"}>정보를 불러오고 있습니다.</div>}
          {!query.isLoading && user &&
            <>
              <span className={"font-bold"}>{user ? user.nickname : "손님"}</span>
              <span className={"text-[14px]"}>{user?.provider === 'GOOGLE' ? '구글로 로그인되었습니다.' : user?.provider === 'KAKAO' ? '카카오로 로그인되었습니다.' : '로그인하세요'}</span>
            </>
          }
        </div>
      </div>
    </div>
  )
}