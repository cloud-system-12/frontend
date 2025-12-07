import { Link, useLocation } from "react-router-dom";
import { toDateKey } from "../utils/dateKey";
import homeIcon from "../assets/home-icon.png.webp";

const NavLink = ({
  to,
  icon,
  label,
  currentPath,
}: {
  to: string;
  icon?: string;
  label?: string;
  currentPath: string;
}) => {
  const isActive = currentPath.startsWith(to);
  const className = `flex flex-col items-center text-xs ${
    isActive ? "text-gray-900 font-semibold" : "text-gray-600"
  }`;

  if (isActive) {
    return (
      <button className={className} disabled>
        {icon && <span className="text-xl">{icon}</span>}
        {label && <span>{label}</span>}
      </button>
    );
  }

  return (
    <Link to={to} className={className}>
      {icon && <span className="text-xl">{icon}</span>}
      {label && <span>{label}</span>}
    </Link>
  );
};

function BottomNavBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const todayKey = toDateKey(new Date()); // 오늘 날짜 생성

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#FFE7BF] border-t border-[#F3C886] flex items-center justify-around z-50">
      {/* 중앙 홈 버튼 */}
      <Link
        to="/"
        className="
          absolute left-1/2 -translate-x-1/2 -top-6
          w-16 h-16 rounded-full
          bg-[#FFF7E6] shadow-md border-2 border-[#F3C886]
          flex items-center justify-center
        "
      >
        <img src={homeIcon} alt="home" className="w-10 h-10 object-contain" />
      </Link>

      {/* 왼쪽 메뉴 */}
      <NavLink
        to="/calendar"
        icon="📅"
        label="달력"
        currentPath={currentPath}
      />
      <NavLink to="/fortune" icon="✨" label="운세" currentPath={currentPath} />

      {/* 홈 아이콘 자리 */}
      <div className="w-16" />

      {/* 감정 기록 버튼 */}
      <NavLink
        to={`/mood?date=${todayKey}`}
        icon="😊"
        label="감정"
        currentPath={currentPath}
      />

      {/* 계정 */}
      <NavLink to="/account" icon="👤" label="계정" currentPath={currentPath} />
    </nav>
  );
}

export default BottomNavBar;
