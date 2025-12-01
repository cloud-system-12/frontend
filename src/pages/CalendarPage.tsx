// src/pages/CalendarPage.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

type CalendarCell = {
  date: Date;
  isCurrentMonth: boolean;
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

  const cells = useMemo(
    () => buildCalendar(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

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
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7E6]">
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

              return (
                <button
                  key={cell.date.toISOString()}
                  type="button"
                  onClick={() => {
                    setSelectedDate(cell.date);
                    navigate(`/mood?date=${dateKey}`); // ✅ 감정 기록 페이지로 이동
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
                    className={`w-8 h-8 rounded-full bg-[#D9D9D9] ${
                      selected ? "ring-2 ring-[#7B4DF3]" : ""
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* 하단 탭 바 */}
        <nav className="mt-4 w-full max-w-3xl bg-[#FFF0D1] rounded-3xl shadow-sm py-3 px-8 flex justify-between text-sm text-gray-500">
          <Link
            to="/calendar"
            className="flex flex-col items-center gap-[2px] text-[#F0AE3A]"
          >
            <span className="text-lg">📅</span>
            <span className="text-[11px]">달력</span>
          </Link>

          <Link to="/fortune" className="flex flex-col items-center gap-[2px]">
            <span className="text-lg">☀️</span>
            <span className="text-[11px]">운세</span>
          </Link>

          <Link to="/mood" className="flex flex-col items-center gap-[2px]">
            <span className="text-lg">🙂</span>
            <span className="text-[11px]">기록</span>
          </Link>

          <Link to="/me" className="flex flex-col items-center gap-[2px]">
            <span className="text-lg">👤</span>
            <span className="text-[11px]">계정</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default CalendarPage;
