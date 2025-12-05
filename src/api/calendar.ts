import apiClient from "./apiClient";

type ApiResponse<T> = {
  success: boolean;
  message: string | null;
  code: string | null;
  data: T;
};
type CalendarList = {
  monthMeta: {
    year: number;
    month: number;
    weekStart: string;
    daysInMonth: number;
    startWeekday: string;
    endWeekday: string;
  };
  calendar: Array<{
    isoDate: string;
    weekday: string;
    inMonth: boolean;
    diaryId: string;
    emotion: string;
  }>;
  stats: {
    totalEntries: number;
    emotionDistribution: {
      ANGER: number;
      HAPPY: number;
      BEST: number;
      FEAR: number;
      SURPRISE: number;
      NEUTRAL: number;
    };
  };
};
export async function fetchCalendarList({
  year = "2025",
  month = "11",
}: {
  year: string;
  month: string;
}) {
  const res = await apiClient.get<ApiResponse<CalendarList>>(
    `/api/calendar?year=${year}&month=${month}`
  );
  return res.data.data;
}
