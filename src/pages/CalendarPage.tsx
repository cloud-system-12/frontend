// src/pages/CalendarPage.tsx
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

  // 날짜별 감정 레벨 (백엔드 데이터 기준으로 세팅)
  const [emotionMap, setEmotionMap] = useState<Record<string, EmotionLevel>>(
    {}
  );

  const cells = useMemo(
    () => buildCalendar(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  // 캘린더 데이터 불러오기 (연/월 바뀔 때마다)
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCalendarList({
          year: String(currentYear),
          // 백엔드에서 month를 1~12로 받으면 +1 해주고, 0~11이면 그대로 사용
          month: String(currentMonth + 1),
        });

        console.log("calendarList", data);
        setCalendarList(data);

        const map: Record<string, EmotionLevel> = {};

        data.calendar?.forEach((item) => {
          // 여기서 item.moodLevel 이름은 서버 스펙에 맞게 변경
          const lvNum = Number(item.moodLevel);

          if (!Number.isNaN(lvNum) && lvNum >= 1 && lvNum <= 5) {
            map[item.isoDate] = lvNum as EmotionLevel;
          }
        });

        setEmotionMap(map);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [currentYear, currentMonth]);

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
      {/* 상단 내용 영역 (스크롤) */}
      <div className="flex-1 flex flex-col items-center pt-16 pb-20 px-6 overflow-y-auto">
        <div className="w-full max-w-3xl flex flex-col items-center">
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

                const dateKey = toDateKey(cell.date); // ex) "2025-11-30"
                const emotion = emotionMap[dateKey];
                const circleColor = emotion
                  ? EMOTION_COLORS[emotion]
                  : "#D9D9D9";

                return (
                  <button
                    key={cell.date.toISOString()}
                    type="button"
                    onClick={() => {
                      setSelectedDate(cell.date);

                      // 백엔드에서 가져온 캘린더 데이터 중 해당 날짜 찾기
                      const diaryItem = calendarList?.calendar?.find(
                        (item) => item.isoDate === dateKey
                      );

                      if (diaryItem?.diaryId) {
                        // 해당 날짜 일기 있음 → 그 일기로 이동
                        navigate(
                          `/mood?diaryId=${diaryItem.diaryId}&date=${dateKey}`
                        );
                      } else {
                        // 해당 날짜 일기 없음 → 새 기록 모드
                        navigate(`/mood?date=${dateKey}`);
                      }
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

      {/* 하단 네비게이션 바 */}
      <BottomNavBar />
    </div>
  );
}

export default CalendarPage;
