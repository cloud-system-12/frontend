// src/api/auth.ts
import api from "./client.ts";
import type { ApiResponse } from "./types";

/* ---------- 회원가입 ---------- */

export type SignUpPayload = {
  email: string;
  password: string;
  loginId: string;
  birthday: string;
  birthTime: string;
  gender: "FEMALE" | "MALE";
};

type SignUpResponse = ApiResponse<null>;

export async function signUp(payload: SignUpPayload): Promise<SignUpResponse> {
  const res = await api.post<SignUpResponse>("/signup", payload);
  return res.data;
}

/* ---------- 로그인 ---------- */

export type LoginPayload = {
  loginId: string;
  password: string;
};

export type LoginResponseData = {
  accessToken: string;
  refreshToken: string;
  tokenType: string; // "Bearer"
  expiresIn: number; // 1800
};

export async function login(
  payload: LoginPayload
): Promise<ApiResponse<LoginResponseData>> {
  const res = await api.post<ApiResponse<LoginResponseData>>("/login", payload);
  return res.data;
}
