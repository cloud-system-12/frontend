import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-4xl font-bold">오늘의 운세 🌟</h1>
      <p className="text-gray-700">
        로그인하고 나만의 운세 달력을 만들어 보세요.
      </p>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold"
        >
          로그인 버튼
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-semibold border"
        >
          회원가입 버튼
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
