// src/pages/FortunePage.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

/** ====== 타입 정의 ====== */

// 포춘쿠키 API의 전체 응답 타입 (네가 보여준 형식 그대로)
type FortuneCookieApiResponse = {
  success: boolean;
  message: string | null;
  code: string;
  data: {
    id: number;
    message: string;
    date: string; // "2025-11-20"
  };
};

// 실제로 화면에서 쓸 포춘쿠키 데이터 타입
type FortuneCookie = FortuneCookieApiResponse["data"];

type FortuneCategory = "total" | "love" | "study" | "health" | "money";

type TodayFortune = {
  userName: string;
  dateLabel: string;
  scores: Record<FortuneCategory, number>; // 0~100 점수
  texts: Record<FortuneCategory, string>;
};

/** ====== 오늘의 운세 더미 데이터 (백엔드 붙기 전까지) ====== */

const mockTodayFortune: TodayFortune = {
  userName: "000", // 나중에 로그인 정보로 교체
  dateLabel: new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  scores: {
    total: 75,
    love: 60,
    study: 80,
    health: 70,
    money: 65,
  },
  texts: {
    total:
      "새로운 시도를 하기에 좋은 날이에요.\n지나친 걱정보다는 가벼운 도전을 해 보세요.",
    love: "상대의 말을 끝까지 들어주는 것이 포인트!\n작은 배려가 분위기를 부드럽게 만들어요.",
    study:
      "집중력이 좋은 편이라 복습·정리하기에 좋아요.\n짧게라도 책상 앞에 앉아보면 만족스러운 하루가 될 거예요.",
    health:
      "컨디션은 나쁘지 않지만, 수분 보충을 자주 해 주세요.\n가벼운 스트레칭도 도움이 돼요.",
    money:
      "과한 소비는 피하고, 꼭 필요한 것 위주로 지출하면\n마음도 가벼워질 거예요.",
  },
};

/** ====== 포춘쿠키 mock 함수 (나중에 axios로 교체할 부분) ====== */

// 실제로는 axios.get("/fortune-cookie/random") 이런 구조가 될 거고,
// 지금은 응답 형식만 맞춰서 Promise로 흉내 내는 버전이야.
function mockFetchRandomFortuneCookie(): Promise<FortuneCookie> {
  const mockResponse: FortuneCookieApiResponse = {
    success: true,
    message: null,
    code: "SUCCESS",
    data: {
      id: 1234656,
      message: "오늘은 사소한 친절이 뜻밖의 행운으로 돌아올 수 있어요.",
      date: "2025-11-20",
    },
  };

  // API 호출처럼 보이도록 살짝 딜레이를 줘도 되고, 안 줘도 됨
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockResponse.data), 400);
  });
}

/** ====== 컴포넌트 ====== */
function FortunePage() {
  const [fortune] = useState<TodayFortune>(mockTodayFortune);

  // 포춘쿠키 상태들
  const [showCookie, setShowCookie] = useState(false);
  const [cookie, setCookie] = useState<FortuneCookie | null>(null);
  const [cookieLoading, setCookieLoading] = useState(false);
  const [cookieError, setCookieError] = useState<string | null>(null);

  // 레이더 차트용 데이터 가공
  const radarData = useMemo(
    () => [
      { label: "총운", key: "total", value: fortune.scores.total },
      { label: "애정운", key: "love", value: fortune.scores.love },
      { label: "학업/성적운", key: "study", value: fortune.scores.study },
      { label: "건강운", key: "health", value: fortune.scores.health },
      { label: "재물운", key: "money", value: fortune.scores.money },
    ],
    [fortune]
  );

  // 포춘쿠키 뽑기 버튼 클릭 시: 상태만 변경하는 함수
  const handleOpenCookie = async () => {
    setShowCookie(true); // 팝업 먼저 열고
    setCookieLoading(true);
    setCookieError(null);

    try {
      const data = await mockFetchRandomFortuneCookie();
      setCookie(data);
    } catch {
      setCookieError("포춘쿠키를 가져오는 데 실패했어요 🥲");
    } finally {
      setCookieLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7E6]">
      <div className="w-full max-w-3xl flex flex-col items-center">
        {/* 메인 컨텐츠 */}
        <div className="w-full px-6 pt-8 pb-4">
          {/* 상단 헤더 */}
          <div className="flex flex-col items-center mb-6">
            <div className="text-4xl mb-2">☀️</div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">
              오늘의 운세
            </h1>
            <p className="text-xs text-gray-500">{fortune.dateLabel}</p>
          </div>

          {/* 총운 + 레이더 차트 카드 */}
          <div className="w-full bg-white rounded-3xl shadow-sm px-6 py-5 mb-4 flex flex-col md:flex-row md:items-stretch gap-4">
            {/* 총운 텍스트 */}
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {fortune.userName}님의 총운
              </p>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                {fortune.texts.total}
              </p>
            </div>

            {/* 레이더 차트 */}
            <div className="w-full md:w-1/2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#F5D9B0" />
                  <PolarAngleAxis
                    dataKey="label"
                    tick={{ fontSize: 10 }}
                    stroke="#B08A57"
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="오늘의 운세"
                    dataKey="value"
                    fill="#F5C676"
                    fillOpacity={0.6}
                    stroke="#F0AE3A"
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 개별 운세 카드들 */}
          <div className="space-y-3 mb-6">
            {/* 애정운 */}
            <section className="bg-white rounded-3xl shadow-sm px-6 py-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                💕 {fortune.userName}님의 애정운
              </p>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                {fortune.texts.love}
              </p>
            </section>

            {/* 학업/성적운 */}
            <section className="bg-white rounded-3xl shadow-sm px-6 py-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                📚 {fortune.userName}님의 학업/성적운
              </p>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                {fortune.texts.study}
              </p>
            </section>

            {/* 건강운 */}
            <section className="bg-white rounded-3xl shadow-sm px-6 py-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                💪 {fortune.userName}님의 건강운
              </p>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                {fortune.texts.health}
              </p>
            </section>

            {/* 재물운 */}
            <section className="bg-white rounded-3xl shadow-sm px-6 py-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                💰 {fortune.userName}님의 재물운
              </p>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                {fortune.texts.money}
              </p>
            </section>
          </div>

          {/* 포춘쿠키 버튼 */}
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={handleOpenCookie}
              className="px-10 py-2 rounded-full bg-[#F5C676] text-sm font-semibold text-gray-800 shadow-sm hover:bg-[#F3B957] transition"
            >
              포춘쿠키 뽑기
            </button>
          </div>
        </div>

        {/* 하단 탭바 */}
        <nav className="mt-auto w-full max-w-3xl bg-[#FFF0D1] rounded-t-3xl shadow-sm py-3 px-8 flex justify-between text-sm text-gray-500">
          <Link to="/calendar" className="flex flex-col items-center gap-[2px]">
            <span className="text-lg">📅</span>
            <span className="text-[11px]">달력</span>
          </Link>

          <div className="flex flex-col items-center gap-[2px] text-[#F0AE3A]">
            <span className="text-lg">☀️</span>
            <span className="text-[11px]">운세</span>
          </div>

          <Link to="/mood" className="flex flex-col items-center gap-[2px]">
            <span className="text-lg">🙂</span>
            <span className="text-[11px]">기록</span>
          </Link>

          <Link to="/account" className="flex flex-col items-center gap-[2px]">
            <span className="text-lg">👤</span>
            <span className="text-[11px]">계정</span>
          </Link>
        </nav>

        {/* 포춘쿠키 팝업 */}
        {showCookie && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-lg px-6 py-5 w-80 text-center">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                오늘의 한마디
              </p>

              {cookieLoading ? (
                <p className="text-xs text-gray-500 mb-4">
                  포춘쿠키를 준비 중이에요...
                </p>
              ) : cookieError ? (
                <p className="text-xs text-red-500 mb-4">{cookieError}</p>
              ) : cookie ? (
                <>
                  <p className="text-xs text-gray-600 mb-2 whitespace-pre-line">
                    {cookie.message}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    ({cookie.date} 기준 메시지)
                  </p>
                </>
              ) : (
                <p className="text-xs text-gray-500 mb-4">
                  포춘쿠키를 불러오지 못했어요.
                </p>
              )}

              <button
                type="button"
                onClick={() => setShowCookie(false)}
                className="mt-2 px-6 py-1.5 rounded-full bg-[#F5C676] text-xs font-semibold text-gray-800 hover:bg-[#F3B957] transition"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FortunePage;
