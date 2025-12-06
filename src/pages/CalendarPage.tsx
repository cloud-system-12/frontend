import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toDateKey } from "../utils/dateKey";
import { fetchCalendarList, type CalendarList } from "../api/calendar";
import BottomNavBar from "../components/BottomNavBar";

type CalendarCell = {
  date: Date;
  isCurrentMonth: boolean;
};
type EmotionLevel = 1 | 2 | 3 | 4 | 5;

const EMOTION_COLORS: Record<EmotionLevel, string> = {
  1: "#E3ECFF", // 아주 연한 파랑
  2: "#C6DAFF",
  3: "#A9C7FF",
  4: "#8BB3FF",
  5: "#6D9EFF", // 진한 파랑
};

function buildCalendar(year: number, month: number): CalendarCell[] {
  // month: 0(Jan) ~ 11(Dec)
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay(); // 0(일) ~ 6(토)

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: CalendarCell[] = [];

  // 앞쪽 빈칸(이전 달)
  for (let i = firstWeekday - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, daysInPrevMonth - i);
    cells.push({ date, isCurrentMonth: false });
  }

  // 이번 달
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    cells.push({ date, isCurrentMonth: true });
  }

  // 뒤쪽 빈칸(다음 달) — 총 35칸(5주) 맞춰서
  while (cells.length < 35) {
    const last = cells[cells.length - 1].date;
    const date = new Date(last);
    date.setDate(last.getDate() + 1);
    cells.push({ date, isCurrentMonth: false });
  }

  return cells;
}

const monthLabel = (month: number) => `${month + 1}월`;

function CalendarPage() {
  const navigate = useNavigate();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [calendarList, setCalendarList] = useState<CalendarList | null>(null);

  // 날짜별 감정 레벨 저장용 (예: { "2025-11-30": 3, ... })
  const [emotionMap, setEmotionMap] = useState<Record<string, EmotionLevel>>(
    {}
  );

  const cells = useMemo(
    () => buildCalendar(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  // 컴포넌트가 렌더링될 때 로컬스토리지에서 diary:* 전부 읽어오기
  useEffect(() => {
    const map: Record<string, EmotionLevel> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (!key.startsWith("diary:")) continue;

      const raw = localStorage.getItem(key);
      if (!raw) continue;

      try {
        const parsed = JSON.parse(raw) as { emotion: EmotionLevel };
        const dateKey = key.replace("diary:", ""); // ex) "diary:2025-11-30" -> "2025-11-30"
        if (parsed.emotion) {
          map[dateKey] = parsed.emotion;
        }
      } catch {
        // 파싱 실패하면 무시
      }
    }

    setEmotionMap(map);
  }, []); // 달력 페이지로 돌아올 때마다 새로 마운트되면 이게 다시 실행됨

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCalendarList({
          year: String(currentYear),
          month: String(currentMonth),
        });
        console.log(data);
        setCalendarList(data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const isSameDay = (a: Date | null, b: Date) => {
    if (!a) return false;
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  return (
    <div className="h-screen flex flex-col bg-[#FFF7E6] overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-3xl flex flex-col items-center pb-20">
          {/* 상단 달력 카드 */}
          <div className="w-full bg-[#FFF0D1] rounded-3xl shadow-sm px-10 py-8">
            {/* 월 이동 영역 */}
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="text-lg text-gray-500 px-2"
              >
                &lt;
              </button>
              <div className="text-xl font-semibold text-gray-800">
                {monthLabel(currentMonth)}
              </div>
              <button
                type="button"
                onClick={handleNextMonth}
                className="text-lg text-gray-500 px-2"
              >
                &gt;
              </button>
            </div>

            {/* 달력 그리드 */}
            <div className="grid grid-cols-7 gap-[1px] bg-[#E6D3B6] p-[1px] rounded-lg">
              {cells.map((cell) => {
                const day = cell.date.getDate();
                const selected = isSameDay(selectedDate, cell.date);

                const key = toDateKey(cell.date); // ex) "2025-11-30"
                const emotion = emotionMap[key]; // 1~5 중 하나 또는 undefined
                const circleColor = emotion
                  ? EMOTION_COLORS[emotion]
                  : "#D9D9D9";

                return (
                  <button
                    key={cell.date.toISOString()}
                    type="button"
                    onClick={() => {
                      const diaryId = calendarList?.calendar?.find(
                        (item) => item.isoDate === String(cell.date)
                      )?.diaryId;
                      setSelectedDate(cell.date);
                      navigate(`/mood?diaryId=${diaryId}`);
                    }}
                    className={`relative aspect-square bg-[#FFF7E6] flex flex-col items-center justify-center ${
                      !cell.isCurrentMonth ? "opacity-40" : ""
                    }`}
                  >
                    {/* 날짜 숫자 (좌상단 작은 글씨) */}
                    <span className="absolute top-1 left-1 text-[10px] text-gray-500">
                      {day}
                    </span>

                    {/* 동그란 칸 */}
                    <div
                      className={`w-8 h-8 rounded-full ${
                        selected ? "ring-2 ring-[#7B4DF3]" : ""
                      }`}
                      style={{ backgroundColor: circleColor }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
}

export default CalendarPage;
