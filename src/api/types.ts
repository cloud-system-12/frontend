// src/api/types.ts
export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  message: string | null;
  code: string | null;
};

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number; // 초 단위
}

export interface FortuneScores {
  overall: number;
  love: number;
  work: number;
  money: number;
  health: number;
  friendship: number;
}

export interface FortuneTexts {
  overall: string;
  love: string;
  work: string;
  money: string;
  health: string;
  friendship: string;
}

export interface TodayFortune {
  meta: {
    date: string; // "2025-11-10"
    generatedAt: string; // ISO
    model: string;
  };
  scores: FortuneScores;
  fortunes: FortuneTexts;
}

export interface FortuneCookie {
  id: number;
  message: string;
  date: string; // "2025-11-20"
}

export type Emotion =
  | "ANGER"
  | "HAPPY"
  | "BEST"
  | "FEAR"
  | "SURPRISE"
  | "NEUTRAL";

export interface CalendarDay {
  isoDate: string;
  weekday: string; // "MON" ...
  inMonth: boolean;
  diaryId: number | null;
  emotion: Emotion | null;
}

export interface MonthStats {
  totalEntries: number;
  emotionDistribution: Record<Emotion, number>;
}

export interface CalendarData {
  monthMeta: {
    year: number;
    month: number;
    weekStart: string;
    daysInMonth: number;
    startWeekday: string;
    endWeekday: string;
  };
  calendar: CalendarDay[];
  stats: MonthStats;
}

export interface Diary {
  diaryId: number;
  date: string;
  moodLevel: string | number; // 명세가 GOOD / 4 둘 다 써 있어서 넓게 잡음
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountInfo {
  userId: string;
  email: string;
  birthDate: string;
  birthTime: string;
  gender: "MALE" | "FEMALE" | string;
}

export interface SignupRequest {
  email: string;
  password: string;
  loginId: string;
  birthday: string; // "YYYY-MM-DD"
  birthTime: string;
  gender: "MALE" | "FEMALE";
}

export interface LoginRequest {
  loginId: string;
  password: string;
}
