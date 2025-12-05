// src/api/auth.ts
import apiClient from "./apiClient";
import type {
  ApiResponse,
  SignupRequest,
  LoginRequest,
  AuthTokens,
  AccountInfo,
} from "./types";

export const signup = async (data: SignupRequest) => {
  const res = await apiClient.post<ApiResponse<null>>("/api/signup", data);
  // res.data = { success, data: null, message, code }
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await apiClient.post<ApiResponse<AuthTokens>>("/api/login", data);

  const body = res.data;

  // 성공하면 토큰 로컬에 저장
  if (body.success && body.data) {
    const { accessToken, refreshToken } = body.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  // 나중에 페이지에서 res.success 보고 분기할 수 있게 body 자체를 리턴
  return body;
};

export const fetchMe = async () => {
  const res = await apiClient.get<ApiResponse<AccountInfo>>("/api/me");

  return res.data; // { success, data: { ...AccountInfo }, message, code }
};

export const checkIdDuplicate = async (loginId: string) => {
  const res = await apiClient.get(`/api/signup/check-id?loginId=${loginId}`);
  return res.data;
};