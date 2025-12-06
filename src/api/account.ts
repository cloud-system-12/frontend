// src/api/account.ts
import api from "./apiClient";

type ApiResponse<T> = {
  success: boolean;
  message: string | null;
  code: string | null;
  data: T;
};

export type AccountInfo = {
  userId: string;
  email: string;
  birthDate: string | null; // "2002-07-21"
  birthTime: string | null; // "14:30"
  gender: "MALE" | "FEMALE" | "OTHER" | null;
};

// 1. 계정정보 가져오기
export async function fetchAccountInfo() {
  const res = await api.get<ApiResponse<AccountInfo>>("/api/me");
  return res.data.data;
}

// 2. 생년월일 수정
export async function updateBirthday(birthday: string) {
  // Request { "birthday": "1995-07-21" }
  return api.patch("/api/me/birthday", { birthday });
}

// 3. 태어난 시각 수정
export async function updateBirthTime(birthTime: string) {
  // Request { "birthTime": "13:45" }
  return api.patch("/api/me/birth-time", { birthTime });
}

// 4. 성별 수정
export async function updateGender(gender: "MALE" | "FEMALE" | "OTHER") {
  // Request { "gender": "MALE" }
  return api.patch("/api/me/gender", { gender });
}
