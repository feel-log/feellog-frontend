// API 1:1 맵핑

/*
예시를 하나 들면 다음과 같다.

export const userService = {
  getUsers: (params?: { page: number }) =>
    apiClient<UserListResponse>(`/users?page=${params?.page ?? 1}`),

  getUserById: (id: string) => apiClient<User>(`/users/${id}`),

  updateUser: (id: string, body: Partial<User>) =>
    apiClient<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
};
*/

export const userService = {}