// src/pages/LoginPage.tsx
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login({
        username: form.username,
        password: form.password,
      });
      // data: { accessToken, refreshToken, tokenType, expiresIn }

      if (!data || !data.accessToken) {
        setError("로그인에 실패했어요. 아이디/비밀번호를 확인해 주세요.");
        return;
      }

      const { accessToken, refreshToken } = res.data;

      // 토큰을 로컬에 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      alert("로그인 성공!");
      navigate("/calendar"); // 메인(달력) 페이지로 이동
    } catch (err) {
      console.error(err);
      setError("로그인에 실패했어요. 아이디/비밀번호를 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7E6]">
      <div className="w-full max-w-3xl flex flex-col items-center">
        {/* 카드 */}
        <div className="w-full max-w-xl bg-[#FFF0D1] rounded-3xl shadow-sm px-12 py-10">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            로그인
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* 아이디 (username) */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                아이디
              </label>
              <input
                className="w-full rounded-full border border-[#E6D3B6] bg-white/70 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#F3C886]"
                name="username"
                placeholder="아이디를 입력해주세요"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                className="w-full rounded-full border border-[#E6D3B6] bg-white/70 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#F3C886]"
                name="password"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 mt-1 text-center">{error}</p>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-full bg-[#F8D9A8] py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-[#F3C886] transition disabled:opacity-60"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>

            {/* 구분선 */}
            <div className="flex items-center gap-2 my-2">
              <div className="h-px flex-1 bg-[#E6D3B6]" />
              <span className="text-xs text-gray-400">또는</span>
              <div className="h-px flex-1 bg-[#E6D3B6]" />
            </div>

            {/* 회원가입 버튼 */}
            <Link
              to="/signup"
              className="w-full text-center rounded-full bg-white/70 py-2 text-sm font-semibold text-gray-700 border border-[#E6D3B6] hover:bg-[#F7F1E4] transition"
            >
              회원가입
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
