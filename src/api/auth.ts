// src/api/auth.ts
import apiClient from "./apiClient";
import type {
  ApiResponse,
  SignupRequest,
  LoginRequest,
  AuthTokens,
  AccountInfo,
} from "./types";

// 🔹 회원가입
export const signup = async (data: SignupRequest) => {
  // ⚠️ 여기 경로는 API 명세서에 있는 "회원가입 주소"로 바꿔줘야 해
  // 예: POST /api/auth/signup 이라고 되어 있으면 "/api/auth/signup"
  const res = await apiClient.post<ApiResponse<null>>(
    "/api/auth/signup", // TODO: 명세서 보고 정확히 수정
    data
  );
  // res.data = { success, data: null, message, code }
  return res.data;
};

// 🔹 로그인
export const login = async (data: LoginRequest) => {
  // ⚠️ 로그인 엔드포인트도 명세서 기준으로 수정
  const res = await apiClient.post<ApiResponse<AuthTokens>>(
    "/api/auth/login", // TODO: 명세서 주소로 수정
    data
  );

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

// 🔹 내 정보 가져오기 (마이페이지 등에서 사용)
export const fetchMe = async () => {
  // ⚠️ 이것도 API 명세서에서 "내 정보 조회" 엔드포인트로 바꿔줘
  // 예: GET /api/account/me → "/api/account/me"
  const res = await apiClient.get<ApiResponse<AccountInfo>>(
    "/api/account/me" // TODO: 명세서 주소로 수정
  );

  return res.data; // { success, data: { ...AccountInfo }, message, code }
};
