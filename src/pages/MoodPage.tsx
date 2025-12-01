// src/pages/MoodPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
// 나중에 실제 API 붙일 때 쓸 예정
// import { fetchDiaryByDate, upsertDiary } from "../services/diary";

type EmotionLevel = 1 | 2 | 3 | 4 | 5;

const EMOTION_COLORS: Record<EmotionLevel, string> = {
  1: "#B3C6FF", // 매우 안 좋음
  2: "#A8D8FF",
  3: "#FFE58F",
  4: "#FFC069",
  5: "#FF9C6E", // 매우 좋음
};

function formatDateLabel(date: Date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}년 ${m}월 ${d}일`;
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10); // 2025-11-30
}

function MoodPage() {
  const [searchParams] = useSearchParams();

  // 쿼리스트링 ?date=2025-11-30 없으면 오늘
  const initialDate = useMemo(() => {
    const fromQuery = searchParams.get("date");
    if (fromQuery) return new Date(fromQuery);
    return new Date();
  }, [searchParams]);

  const [date] = useState<Date>(initialDate);
  const [emotion, setEmotion] = useState<EmotionLevel | null>(null);
  const [content, setContent] = useState("");

  // TODO: 나중에 백엔드 붙일 때, 해당 날짜의 기존 기록 불러오기
  useEffect(() => {
    const key = toDateKey(date);

    // 예시: 로컬스토리지에서 불러오기 (백엔드 붙기 전까지 임시)
    const stored = localStorage.getItem(`diary:${key}`);
    if (stored) {
      const parsed = JSON.parse(stored) as {
        emotion: EmotionLevel;
        content: string;
      };
      setEmotion(parsed.emotion);
      setContent(parsed.content);
    }

    /*
    // 실제 API 사용 버전 (백엔드 준비되면 이걸로 교체)
    fetchDiaryByDate(key).then((diary) => {
      if (!diary) return;
      setEmotion(diary.emotion);
      setContent(diary.content);
    });
    */
  }, [date]);

  const handleSave = async () => {
    if (!emotion) {
      alert("오늘의 감정을 먼저 선택해 주세요!");
      return;
    }

    const key = toDateKey(date);

    // 임시: 로컬스토리지에 저장
    localStorage.setItem(`diary:${key}`, JSON.stringify({ emotion, content }));

    /*
    // 실제 API 사용 버전
    await upsertDiary({
      date: key,
      emotion,
      content,
    });
    */

    alert("오늘 감정과 일기가 저장됐어요!");

    // 달력에서 색깔 업데이트 하려면, 나중에 전역 상태나
    // 다시 /calendar 호출해서 새로고침하면 됨
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7E6]">
      <div className="w-full max-w-3xl flex flex-col items-center">
        {/* 메인 카드 */}
        <div className="w-full bg-[#FFF0D1] rounded-3xl shadow-sm px-8 py-8">
          {/* 제목 + 날짜 */}
          <div className="flex flex-col items-center mb-6">
            <div className="text-3xl mb-2">😊</div>
            <h1 className="text-xl font-semibold text-gray-800 mb-1">
              감정 기록
            </h1>
            <p className="text-xs text-gray-500">{formatDateLabel(date)}</p>
          </div>

          {/* 5단계 감정 버튼 */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <p className="text-sm text-gray-600 mb-1">오늘 기분은 어때요?</p>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setEmotion(level as EmotionLevel)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    emotion === level
                      ? "ring-4 ring-[#F0AE3A]"
                      : "ring-2 ring-transparent"
                  }`}
                  style={{
                    backgroundColor: EMOTION_COLORS[level as EmotionLevel],
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between w-full text-[11px] text-gray-500 px-4">
              <span>매우 안 좋음</span>
              <span>매우 좋음</span>
            </div>
          </div>

          {/* 일기 입력 */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              오늘 하루를 기록해 보세요.
            </p>
            <textarea
              className="w-full h-40 rounded-2xl border border-[#F5D9B0] bg-[#FFF7E6] p-4 text-sm resize-none outline-none focus:ring-2 focus:ring-[#F0AE3A]"
              placeholder="오늘 있었던 일, 느꼈던 감정을 자유롭게 적어 주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSave}
              className="px-10 py-2 rounded-full bg-[#F5C676] text-sm font-semibold text-gray-800 shadow-sm hover:bg-[#F3B957] transition"
            >
              저장하기
            </button>
          </div>
        </div>

        {/* 하단 탭바 */}
        <nav className="mt-4 w-full max-w-3xl bg-[#FFF0D1] rounded-3xl shadow-sm py-3 px-8 flex justify-between text-sm text-gray-500">
          <Link to="/calendar" className="flex flex-col items-center gap-[2px]">
            <span className="text-lg">📅</span>
            <span className="text-[11px]">달력</span>
          </Link>

          <Link to="/fortune" className="flex flex-col items-center gap-[2px]">
            <span className="text-lg">☀️</span>
            <span className="text-[11px]">운세</span>
          </Link>

          <div className="flex flex-col items-center gap-[2px] text-[#F0AE3A]">
            <span className="text-lg">🙂</span>
            <span className="text-[11px]">기록</span>
          </div>

          <Link to="/me" className="flex flex-col items-center gap-[2px]">
            <span className="text-lg">👤</span>
            <span className="text-[11px]">계정</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default MoodPage;
