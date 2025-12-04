// src/api/emailApi.ts
import apiClient from "./apiClient";
import type { ApiResponse } from "./types";

export interface SendEmailCodeRequest {
  email: string;
}

export interface SendEmailCodeData {
  email: string;
  sent: boolean;
}

export const sendEmailCode = async (email: string) => {
  const res = await apiClient.post<ApiResponse<SendEmailCodeData>>(
    "/api/signup/email/send",
    { email }
  );
  return res.data;
};

export interface VerifyEmailCodeRequest {
  email: string;
  code: string;
}

export interface VerifyEmailCodeData {
  email: string;
  verified: boolean;
}

export const verifyEmailCode = async (email: string, code: string) => {
  const res = await apiClient.post<ApiResponse<VerifyEmailCodeData>>(
    "/api/signup/email/verify",
    { email, code }
  );
  return res.data;
};
