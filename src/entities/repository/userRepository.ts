/*
예시를 확인하라.
import { userService } from "@/services/user.service";

export const userRepository = {
  // 캐싱 전략을 여기서 결정
  getUsers: (page = 1) =>
    // next: { revalidate } 또는 { tags }를 서비스 말고 여기서 관리
    userService.getUsers({ page }),

  getUserDetail: async (id: string) => {
    const user = await userService.getUserById(id);
    // 필요 시 변환/조합
    return {
      ...user,
      displayName: `${user.firstName} ${user.lastName}`,
    };
  },
};
*/