import apiClient from "./apiClient";
import type { ApiResponse, TodayFortune, FortuneCookie } from "./types";

export const getTodayFortune = async (): Promise<TodayFortune> => {
  const res = await apiClient.post<ApiResponse<TodayFortune>>("/api/luck");

  console.log(res.data.data);

  return res.data.data!;
};

export const fetchTodayFortuneCookie = async (): Promise<FortuneCookie> => {
  const res = await apiClient.post<ApiResponse<FortuneCookie>>(
    "/api/fortune-cookie"
  );
  console.log(res.data.data);
  return res.data.data!;
};
