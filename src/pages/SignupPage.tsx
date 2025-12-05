// src/pages/SignupPage.tsx
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { signup, checkIdDuplicate } from "../api/auth";

function SignupPage() {
  const navigate = useNavigate();

  const [isIdChecked, setIsIdChecked] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    verifyCode: "",
    birthdate: "",
    birthTime: "",
    gender: "",
  });

  const handleCheckId = async () => {
    if (!form.username.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }

    try {
      const res = await checkIdDuplicate(form.username);

      if (res.success && res.data?.available) {
        alert("사용 가능한 아이디입니다!");
        setIsIdChecked(true);
      } else {
        alert(res.message || "이미 사용 중인 아이디입니다.");
        setIsIdChecked(false);
      }
    } catch (err) {
      console.error(err);
      alert("아이디 중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isIdChecked) {
      alert("아이디 중복 확인을 먼저 해주세요.");
      return;
    }
    
    try {
      const res = await signup({
        username: form.username,
        password: form.password,
        email: form.email,
        birthdate: form.birthdate,
        birthTime: form.birthTime,
        sex: form.gender as "male" | "female",
      });

      if (res.success) {
        alert("회원가입이 완료되었습니다. 로그인해주세요!");
        navigate("/login");
      } else {
        // 백엔드에서 실패 메시지 내려줄 때
        alert(res.message ?? "회원가입에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      // 네트워크 오류 같은 진짜 예외
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  // 아직 이메일/인증번호 API는 없으니까 일단 알림만
  const handleEmailCheck = () => {
    alert("이메일 중복 확인 기능은 추후 구현 예정입니다 🙂");
  };

  const handleVerifyCode = () => {
    alert("인증번호 확인 기능은 추후 구현 예정입니다 🙂");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7E6]">
      <div className="w-full max-w-3xl flex flex-col items-center">
        {/* 카드 */}
        <div className="w-full max-w-2xl bg-[#FFF0D1] rounded-3xl shadow-sm px-12 py-10">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            회원가입
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* 아이디 */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                아이디
              </label>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-full border border-[#E6D3B6] bg-white/70 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#F3C886]"
                  name="username"
                  placeholder="아이디를 입력해주세요"
                  value={form.username}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={handleCheckId}
                  className="px-3 whitespace-nowrap rounded-full bg-[#F2E3CC] text-xs font-semibold text-gray-700 border border-[#E6D3B6] hover:bg-[#EAD7BD] transition"
                >
                  중복 확인
                </button>
              </div>
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

            {/* 이메일 + 인증번호 */}
            <div className="flex flex-col gap-3">
              {/* 이메일 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  이메일
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-full border border-[#E6D3B6] bg-white/70 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#F3C886]"
                    name="email"
                    placeholder="이메일을 입력해주세요"
                    value={form.email}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={handleEmailCheck}
                    className="px-3 whitespace-nowrap rounded-full bg-[#F2E3CC] text-xs font-semibold text-gray-700 border border-[#E6D3B6] hover:bg-[#EAD7BD] transition"
                  >
                    인증번호 받기
                  </button>
                </div>
              </div>

              {/* 인증번호 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  인증번호
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-full border border-[#E6D3B6] bg-white/70 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#F3C886]"
                    name="verifyCode"
                    placeholder="인증번호를 입력해주세요"
                    value={form.verifyCode}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    className="px-3 whitespace-nowrap rounded-full bg-[#F2E3CC] text-xs font-semibold text-gray-700 border border-[#E6D3B6] hover:bg-[#EAD7BD] transition"
                  >
                    인증하기
                  </button>
                </div>
              </div>
            </div>

            {/* 생년월일 */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                생년월일
              </label>
              <input
                className="w-full rounded-full border border-[#E6D3B6] bg-white/70 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#F3C886]"
                type="date"
                name="birthdate"
                value={form.birthdate}
                onChange={handleChange}
              />
            </div>

            {/* 태어난 시간 & 성별 */}
            <div className="grid grid-cols-2 gap-4">
              {/* 태어난 시간 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  태어난 시간
                </label>
                <select
                  className="w-full rounded-full border border-[#E6D3B6] bg-white/70 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#F3C886]"
                  name="birthTime"
                  value={form.birthTime}
                  onChange={handleChange}
                >
                  <option value="">선택하세요</option>
                  <option value="자시">자시</option>
                  <option value="축시">축시</option>
                  <option value="인시">인시</option>
                  <option value="묘시">묘시</option>
                  <option value="진시">진시</option>
                  <option value="사시">사시</option>
                  <option value="오시">오시</option>
                  <option value="미시">미시</option>
                  <option value="신시">신시</option>
                  <option value="유시">유시</option>
                  <option value="술시">술시</option>
                  <option value="해시">해시</option>
                </select>
              </div>

              {/* 성별 */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  성별
                </label>
                <select
                  className="w-full rounded-full border border-[#E6D3B6] bg-white/70 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#F3C886]"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="">선택하세요</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>
              </div>
            </div>

            {/* 하단 버튼들 */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 rounded-full bg-white/70 text-sm font-semibold text-gray-700 border border-[#E6D3B6] hover:bg-[#F7F1E4] transition"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-[#F8D9A8] text-sm font-semibold text-gray-800 shadow-sm hover:bg-[#F3C886] transition"
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
