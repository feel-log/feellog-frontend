import ConfirmModal from '@/shared/ui/ConfirmModal';
import { useLogout } from '@/features/logout/model/useLogout';
import { useToken } from '@/shared/store';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: (bool: boolean) => void;
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const { mutate: logoutUser } = useLogout();
  const { getAccessToken } = useToken();
  const accessToken = getAccessToken();

  return (
    <ConfirmModal
      isOpen={isOpen}
      title="로그아웃하시겠어요?"
      confirmText="확인"
      cancelText="취소"
      onConfirm={() => logoutUser(accessToken!)}
      onCancel={() => onClose(false)}
    />
  );
}