// src/pages/SignupPage.tsx
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { signup, checkIdDuplicate } from "../api/auth";
import apiClient from "../api/apiClient";

function SignupPage() {
  const navigate = useNavigate();

  const [isIdChecked, setIsIdChecked] = useState(false);

  const [form, setForm] = useState({
    loginId: "",
    password: "",
    email: "",
    verifyCode: "",
    birthday: "",
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
        email: form.email,
        password: form.password,
        loginId: form.loginId,
        birthday: form.birthday,
        birthTime: form.birthTime,
        gender: form.gender as "MALE" | "FEMALE",
      });

      if (res.success) {
        alert("회원가입이 완료되었습니다. 로그인해주세요!");
        navigate("/login");
      } else {
        // 백엔드에서 실패 메시지
        alert(res.message ?? "회원가입에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  // 이메일 인증번호 발송
  const handleEmailCheck = async () => {
    try {
      const res = await apiClient.post("/api/signup/email/send", {
        email: form.email,
      });

      const data = await res.data;

      if (data.success) {
        alert(data.message || "인증번호가 이메일로 전송되었습니다.");
      } else {
        alert(data.message || "인증번호 전송에 실패했습니다.");
      }
    } catch (error) {
      alert("인증번호 전송에 실패했습니다.");
      console.error(error);
    }
  };

  // 이메일 인증번호 확인
  const handleVerifyCode = async () => {
    try {
      const res = await apiClient.post("/api/signup/email/verify", {
        email: form.email,
        code: form.verifyCode,
      });

      const data = await res.data;

      if (data.success) {
        alert(data.message || "이메일 인증이 완료되었습니다.");
      } else {
        alert(data.message || "인증번호가 일치하지 않습니다.");
      }
    } catch (error) {
      alert("인증번호 확인에 실패했습니다.");
      console.error(error);
    }
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
                  name="loginId"
                  placeholder="아이디를 입력해주세요"
                  value={form.loginId}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  //onClick={handleEmailCheck}
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
                name="birthday"
                value={form.birthday}
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
                  <option value="모름">모름</option>
                  <option value="자시">자시(子時) - 23:30 ~ 01:29</option>
                  <option value="축시">축시(丑時) - 01:30 ~ 03:29</option>
                  <option value="인시">인시(寅時) - 03:30 ~ 05:29</option>
                  <option value="묘시">묘시(卯時) - 05:30 ~ 07:29</option>
                  <option value="진시">진시(辰時) - 07:30 ~ 09:29</option>
                  <option value="사시">사시(巳時) - 09:30 ~ 11:29</option>
                  <option value="오시">오시(午時) - 11:30 ~ 13:29</option>
                  <option value="미시">미시(未時) - 13:30 ~ 15:29</option>
                  <option value="신시">신시(申時) - 15:30 ~ 17:29</option>
                  <option value="유시">유시(酉時) - 17:30 ~ 19:29</option>
                  <option value="술시">술시(戌時) - 19:30 ~ 21:29</option>
                  <option value="해시">해시(亥時) - 21:30 ~ 23:29</option>
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
                  <option value="MALE">남성</option>
                  <option value="FEMALE">여성</option>
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
