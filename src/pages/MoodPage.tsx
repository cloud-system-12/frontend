// src/pages/MoodPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fromDateKey, toDateKey } from "../utils/dateKey";
import {
  createMoodInfo,
  fetchMoodInfo,
  updateMoodInfo,
  type MoodInfo,
} from "../api/mood";
import { fetchCalendarList } from "../api/calendar";
import BottomNavBar from "../components/BottomNavBar";

type EmotionLevel = 1 | 2 | 3 | 4 | 5;

const EMOTION_COLORS: Record<EmotionLevel, string> = {
  1: "#E3ECFF",
  2: "#C6DAFF",
  3: "#A9C7FF",
  4: "#8BB3FF",
  5: "#6D9EFF",
};

function formatDateLabel(date: Date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}년 ${m}월 ${d}일`;
}

function MoodPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const diaryId = searchParams.get("diaryId");
  const fromQuery = searchParams.get("date");

  const initialDate = useMemo(() => {
    if (fromQuery) return fromDateKey(fromQuery);
    return new Date();
  }, [fromQuery]);

  const [date] = useState<Date>(initialDate);

  const [emotion, setEmotion] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [moodInfo, setMoodInfo] = useState<MoodInfo | null>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  /**
   * 📌 핵심: diaryId가 없고 date만 있는 경우
   * 캘린더 API에서 해당 날짜의 diaryId를 찾아서 URL을 교체한다.
   * 백엔드 수정 없이 프론트에서만 해결하는 핵심 로직.
   */
  useEffect(() => {
    const load = async () => {
      try {
        // 1️⃣ diaryId 있는 경우: 기존 로직 그대로
        if (diaryId) {
          const data = await fetchMoodInfo(Number(diaryId));
          setMoodInfo(data);
          return;
        }

        // 2️⃣ diaryId 없고 date만 있는 경우
        if (fromQuery) {
          const target = fromDateKey(fromQuery);
          const year = target.getFullYear();
          const month = target.getMonth() + 1;

          // 해당 달의 캘린더 데이터 조회
          const calendar = await fetchCalendarList({
            year: String(year),
            month: String(month),
          });

          // 해당 날짜 존재 여부 확인
          const found = calendar.calendar.find(
            (item) => item.isoDate === fromQuery
          );

          // 날짜에 해당하는 일기가 이미 존재하면 diaryId 포함된 URL로 교체
          if (found && found.diaryId) {
            navigate(`/mood?diaryId=${found.diaryId}&date=${fromQuery}`, {
              replace: true,
            });
            return;
          }

          // 일기 없음 → 새 기록 모드
          setMoodInfo(null);
          setEmotion(null);
          setContent("");
          return;
        }

        // 3️⃣ 아무 쿼리도 없는 경우 기본값(오늘)
        setMoodInfo(null);
        setEmotion(null);
        setContent("");
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [diaryId, fromQuery, navigate]);

  /**
   * 불러온 moodInfo를 화면에 반영
   */
  useEffect(() => {
    if (moodInfo) {
      setEmotion(moodInfo.moodLevel);
      setContent(moodInfo.content);
    }
  }, [moodInfo]);

  /**
   * 저장 / 수정
   */
  const handleEditOrSave = async () => {
    if (!editing) {
      setEditing(true);
      return;
    }

    if (!emotion) {
      alert("오늘의 감정을 먼저 선택해 주세요!");
      return;
    }

    try {
      setSaving(true);

      if (diaryId) {
        await updateMoodInfo({ moodLevel: emotion, content }, Number(diaryId));
      } else {
        const dateKey = toDateKey(date);
        await createMoodInfo({ date: dateKey, moodLevel: emotion, content });
      }

      alert("오늘 감정과 일기가 저장됐어요!");
      setEditing(false);
      navigate("/calendar");
    } catch (e) {
      console.error(e);
      alert("저장에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#FFF7E6] overflow-hidden">
      {/* 상단 내용 영역 (스크롤) */}
      <div className="flex-1 flex flex-col items-center pt-16 pb-20 px-6 overflow-y-auto">
        <div className="w-full max-w-3xl flex flex-col items-center">
          {/* 메인 카드 */}
          <div className="w-full bg-[#FFF0D1] rounded-3xl shadow-sm px-8 py-8">
            <div className="flex flex-col items-center mb-6">
              <div className="text-3xl mb-2">😊</div>
              <h1 className="text-xl font-semibold text-gray-800 mb-1">
                감정 기록
              </h1>
              <p className="text-xs text-gray-500">{formatDateLabel(date)}</p>
            </div>

            {/* 감정 선택 */}
            <div className="flex flex-col items-center gap-3 mb-8">
              <p className="text-sm text-gray-600 mb-1">오늘 기분은 어때요?</p>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    disabled={!editing}
                    onClick={() => editing && setEmotion(level)}
                    className={`w-10 h-10 rounded-full transition-all ${
                      emotion === level
                        ? "ring-4 ring-[#4763FF]"
                        : "ring-2 ring-transparent"
                    } ${!editing ? "opacity-60 cursor-default" : ""}`}
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

            {/* 일기 내용 */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                오늘 하루를 기록해 보세요.
              </p>
              <textarea
                className={`w-full h-40 rounded-2xl border border-[#F5D9B0] bg-[#FFF7E6] p-4 text-sm resize-none outline-none ${
                  editing
                    ? "focus:ring-2 focus:ring-[#F0AE3A]"
                    : "cursor-default"
                }`}
                placeholder={
                  editing
                    ? "오늘 있었던 일, 느꼈던 감정을 자유롭게 적어 주세요."
                    : moodInfo
                    ? ""
                    : "편집하기 버튼을 눌러 오늘의 기록을 남겨 보세요."
                }
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={!editing}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleEditOrSave}
                disabled={saving}
                className="px-10 py-2 rounded-full bg-[#F5C676] text-sm font-semibold text-gray-800 shadow-sm hover:bg-[#F3B957] transition disabled:opacity-60"
              >
                {saving ? "저장 중..." : editing ? "저장하기" : "편집하기"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <BottomNavBar />
    </div>
  );
}

export default MoodPage;
