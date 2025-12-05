import apiClient from "./apiClient";

type ApiResponse<T> = {
  success: boolean;
  message: string | null;
  code: string | null;
  data: T;
};

export type ReqMoodInfo = {
  feeling: string;
  content: string;
};

export type MoodInfo = {
  diaryId: number;
  date: string;
  moodLevel: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};
export async function fetchMoodInfo(diaryId: number) {
  const res = await apiClient.get<ApiResponse<MoodInfo>>(
    `/api/diary/${diaryId}`
  );
  return res.data.data;
}

export const updateMoodInfo = async (data: ReqMoodInfo, diaryId: number) => {
  const res = await apiClient.post<ApiResponse<null>>(
    `/api/diary/${diaryId}/edit`,
    data
  );
  // res.data = { success, data: null, message, code }
  return res.data;
};
