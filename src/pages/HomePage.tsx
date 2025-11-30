// src/pages/HomePage.tsx
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7E6]">
      <div className="w-full max-w-3xl flex flex-col items-start">
        {/* 메인 카드 영역 */}
        <div className="w-full bg-[#FFF0D1] rounded-3xl shadow-sm flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-6">
            {/* 동그란 로고 영역 */}
            <div className="w-44 h-44 rounded-full bg-gradient-to-b from-white to-[#FFE8C0] flex items-center justify-center shadow-md">
              <span className="text-4xl font-semibold text-gray-700">
                Oondi
              </span>
            </div>

            {/* 버튼들 */}
            <div className="flex flex-col gap-3 w-48">
              <Link
                to="/login"
                className="w-full py-2 rounded-full bg-[#F8D9A8] hover:bg-[#F3C886] transition text-gray-800 font-semibold text-sm text-center shadow-sm"
              >
                로그인하기
              </Link>
              <Link
                to="/signup"
                className="w-full py-2 rounded-full bg-[#F2E3CC] hover:bg-[#EAD7BD] transition text-gray-800 font-semibold text-sm text-center shadow-sm"
              >
                회원가입하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
