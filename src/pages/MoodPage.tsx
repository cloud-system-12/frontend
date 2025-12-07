// src/pages/MoodPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { fromDateKey, toDateKey } from "../utils/dateKey";
import {
  createMoodInfo,
  fetchMoodInfo,
  updateMoodInfo,
  type MoodInfo,
} from "../api/mood";

type EmotionLevel = 1 | 2 | 3 | 4 | 5;

const EMOTION_COLORS: Record<EmotionLevel, string> = {
  1: "#E3ECFF", // 연한 파랑
  2: "#C6DAFF",
  3: "#A9C7FF",
  4: "#8BB3FF",
  5: "#6D9EFF", // 진한 파랑
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
    if (fromQuery) {
      return fromDateKey(fromQuery);
    }
    return new Date();
  }, [fromQuery]);

  const [date] = useState<Date>(initialDate);
  const todayKey = toDateKey(new Date());

  const [emotion, setEmotion] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [moodInfo, setMoodInfo] = useState<MoodInfo | null>(null);

  // 편집 상태
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // 해당 diaryId의 기존 기록 불러오기 (있을 때만)
  useEffect(() => {
    if (!diaryId) {
      // 새 기록 모드
      setMoodInfo(null);
      setEmotion(null);
      setContent("");
      return;
    }

    const load = async () => {
      try {
        const data = await fetchMoodInfo(Number(diaryId));
        console.log(data);
        setMoodInfo(data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [diaryId]);

  // 불러온 기록을 state에 반영
  useEffect(() => {
    if (moodInfo) {
      setEmotion(moodInfo.moodLevel);
      setContent(moodInfo.content);
    }
  }, [moodInfo]);

  const handleEditOrSave = async () => {
    // 아직 편집 모드가 아닐 때 → 편집 모드로 전환
    if (!editing) {
      setEditing(true);
      return;
    }

    // 여기까지 왔으면 "저장하기" 상태
    if (!emotion) {
      alert("오늘의 감정을 먼저 선택해 주세요!");
      return;
    }

    try {
      setSaving(true);

      if (diaryId) {
        // 기존 기록 수정
        await updateMoodInfo({ moodLevel: emotion, content }, Number(diaryId));
      } else {
        // 새 기록 생성
        const dateKey = toDateKey(date);

        await createMoodInfo({
          date: dateKey,
          moodLevel: emotion,
          content,
        });
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
                  disabled={!editing}
                  onClick={() => {
                    if (!editing) return;
                    setEmotion(level as EmotionLevel);
                  }}
                  className={`w-10 h-10 rounded-full transition-all ${
                    emotion === level
                      ? "ring-4 ring-[#4763FF]" // 파란 테두리
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

          {/* 일기 입력 */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              오늘 하루를 기록해 보세요.
            </p>
            <textarea
              className={`w-full h-40 rounded-2xl border border-[#F5D9B0] bg-[#FFF7E6] p-4 text-sm resize-none outline-none ${
                editing ? "focus:ring-2 focus:ring-[#F0AE3A]" : "cursor-default"
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

          {/* 편집/저장 버튼 */}
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

          {/* 기록 탭: 항상 오늘 날짜 mood 페이지로 이동 */}
          <Link
            to={`/mood?date=${todayKey}`}
            className="flex flex-col items-center gap-[2px] text-[#F0AE3A]"
          >
            <span className="text-lg">🙂</span>
            <span className="text-[11px]">기록</span>
          </Link>

          <Link to="/account" className="flex flex-col items-center gap-[2px]">
            <span className="text-lg">👤</span>
            <span className="text-[11px]">계정</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default MoodPage;
