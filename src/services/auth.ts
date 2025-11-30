import apiClient from "./apiClient";

export interface SignupRequest {
  username: string;
  password: string;
  email: string;
  birthdate: string; // YYYY-MM-DD
  birthTime: string; // 자시/축시 ...
  sex: "male" | "female";
}

export interface LoginRequest {
  username: string;
  password: string;
}

// 백엔드에서 어떤 형식으로 주는지 확정 안 됐으니까 일단 최소 필드만
export interface User {
  id: number;
  username: string;
  email: string;
}

export const signup = async (data: SignupRequest) => {
  const res = await apiClient.post<User>("/api/signup", data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await apiClient.post<User>("/api/login", data);
  return res.data;
};

export const fetchMe = async () => {
  const res = await apiClient.get<User>("/api/me");
  return res.data;
};
