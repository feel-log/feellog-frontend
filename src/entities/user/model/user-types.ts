export interface User {
  id: number;
  email: string;
  nickname: string;
  birthDate: string;
  gender: "male" | "female";
  provider: string;
}