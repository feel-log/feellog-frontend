import { useLogout } from '@/features/logout/model/useLogout';
import { useToken } from '@/shared/store';

export function LogoutModal({ changeLogoutModalOpen } : { changeLogoutModalOpen: (bool: boolean) => void }) {
  const { mutate: logoutUser } = useLogout();
  const { getAccessToken } = useToken();
  const accessToken = getAccessToken();

  return (
    <>
      <div className={"logout__backdrop fixed left-0 right-0 max-w-md mx-auto inset-0 z-30 bg-black opacity-50 animate-fade-in"} />
      <div className={"box__container w-70 h-45 rounded-[10px] bg-white pt-12 fixed z-40 left-0 right-0 top-1/2 -translate-y-1/2 mx-auto"}>
        <span className={"block text-center font-bold text-[16px]"}>로그아웃하시겠어요?</span>
        <div className={"flex absolute bottom-5 gap-2 w-[90%] mx-auto left-0 right-0"}>
          <button className={"flex-1 text-[14px] bg-[#13278a] py-2 rounded-[8px] text-white"} onClick={() => { logoutUser(accessToken!)}}>확인</button>
          <button className={"flex-1 text-[14px] bg-[#13278a] py-2 rounded-[8px] text-white"} onClick={() => changeLogoutModalOpen(false)}>취소</button>
        </div>
      </div>
    </>
  )
}