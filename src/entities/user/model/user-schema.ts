// 타입스크립트 유효성 검사

import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  nickname: z.string(),
  birthDate: z.string().datetime(),
  gender: z.enum(["female","male"]),
  provider: z.string()
})

export type User = z.infer<typeof UserSchema>;