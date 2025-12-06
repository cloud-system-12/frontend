// src/pages/AccountPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAccountInfo,
  updateBirthday,
  updateBirthTime,
  updateGender,
} from "../api/account";

type LocalGender = "" | "MALE" | "FEMALE";

const genderLabel = (g: LocalGender) => {
  if (g === "MALE") return "남자";
  if (g === "FEMALE") return "여자";
  return "";
};

function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{
    userId: string;
    email: string;
    birthDate: string;
    birthTime: string;
    gender: LocalGender;
  }>({
    userId: "",
    email: "",
    birthDate: "",
    birthTime: "",
    gender: "",
  });

  // 어떤 필드를 "편집 모드"로 할지
  const [editingField, setEditingField] = useState<
    "birthDate" | "birthTime" | "gender" | null
  >(null);

  // 어떤 필드를 저장 중인지
  const [savingField, setSavingField] = useState<
    "birthDate" | "birthTime" | "gender" | null
  >(null);

  const [toast, setToast] = useState<string | null>(null);
  const [genderOpen, setGenderOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // 공통 박스 스타일
  const pillClass =
    "flex-1 px-4 py-2 rounded-full bg-white text-sm text-gray-800 border border-[#F8D9A8] focus:outline-none focus:ring-2 focus:ring-[#F3C886] disabled:bg-white disabled:text-gray-800 disabled:cursor-default";

  // 처음 로딩 시 계정 정보 불러오기
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAccountInfo();
        setProfile({
          userId: data.userId ?? "",
          email: data.email ?? "",
          birthDate: data.birthDate ?? "",
          birthTime: data.birthTime ?? "",
          gender: (data.gender as LocalGender) ?? "",
        });
      } catch (e) {
        console.error(e);
        showToast("계정 정보를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ---- 버튼 핸들러들 (수정하기 / 수정완료) ----
  const handleBirthDateButton = async () => {
    // 편집 모드가 아니면 편집 모드로 전환만
    if (editingField !== "birthDate") {
      setEditingField("birthDate");
      return;
    }

    // 편집 모드에서 다시 누르면 저장
    if (!profile.birthDate) return;
    setSavingField("birthDate");
    try {
      await updateBirthday(profile.birthDate);
      showToast("생년월일이 수정되었어요 ✨");
      setEditingField(null);
    } catch (e) {
      console.error(e);
      showToast("생년월일 수정에 실패했어요.");
    } finally {
      setSavingField(null);
    }
  };

  const handleBirthTimeButton = async () => {
    if (editingField !== "birthTime") {
      setEditingField("birthTime");
      return;
    }

    if (!profile.birthTime) return;
    setSavingField("birthTime");
    try {
      await updateBirthTime(profile.birthTime);
      showToast("태어난 시간이 수정되었어요 ✨");
      setEditingField(null);
    } catch (e) {
      console.error(e);
      showToast("태어난 시간 수정에 실패했어요.");
    } finally {
      setSavingField(null);
    }
  };

  const handleGenderButton = async () => {
    if (editingField !== "gender") {
      setEditingField("gender");
      return;
    }

    if (!profile.gender) return;
    setSavingField("gender");
    try {
      await updateGender(profile.gender as "MALE" | "FEMALE");
      showToast("성별이 수정되었어요 ✨");
      setEditingField(null);
      setGenderOpen(false);
    } catch (e) {
      console.error(e);
      showToast("성별 수정에 실패했어요.");
    } finally {
      setSavingField(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7E6]">
        <div className="text-gray-600 text-sm">계정 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF7E6]">
      {/* 상단 내용 */}
      <div className="flex-1 flex flex-col items-center pt-16 pb-28 px-6">
        {/* 프로필 아이콘 + 제목 */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <div className="w-16 h-16 rounded-full border border-[#F3C886] flex items-center justify-center">
            <span className="text-3xl">👤</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">계정</h1>
        </div>

        {/* 메인 카드 */}
        <div className="w-full max-w-xl bg-[#FFF0D1] rounded-3xl shadow-sm px-6 py-8 space-y-6">
          {/* 아이디 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">아이디</span>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={profile.userId}
                readOnly
                className={pillClass + " cursor-default"}
              />
            </div>
          </div>

          {/* 이메일 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">이메일</span>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={profile.email}
                readOnly
                className={pillClass + " cursor-default"}
              />
            </div>
          </div>

          {/* 생년월일 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">생년월일</span>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={profile.birthDate}
                disabled={editingField !== "birthDate"}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    birthDate: e.target.value,
                  }))
                }
                className={pillClass}
              />
              <button
                onClick={handleBirthDateButton}
                disabled={savingField === "birthDate"}
                className="px-4 py-2 rounded-full bg-[#F8D9A8] hover:bg-[#F3C886] text-sm font-medium text-gray-700 disabled:opacity-60"
              >
                {savingField === "birthDate"
                  ? "저장 중..."
                  : editingField === "birthDate"
                  ? "수정완료"
                  : "수정하기"}
              </button>
            </div>
          </div>

          {/* 태어난 시간 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">태어난 시간</span>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={profile.birthTime}
                disabled={editingField !== "birthTime"}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    birthTime: e.target.value,
                  }))
                }
                className={pillClass}
              />
              <button
                onClick={handleBirthTimeButton}
                disabled={savingField === "birthTime"}
                className="px-4 py-2 rounded-full bg-[#F8D9A8] hover:bg-[#F3C886] text-sm font-medium text-gray-700 disabled:opacity-60"
              >
                {savingField === "birthTime"
                  ? "저장 중..."
                  : editingField === "birthTime"
                  ? "수정완료"
                  : "수정하기"}
              </button>
            </div>
          </div>

          {/* 성별 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">성별</span>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => {
                    if (editingField !== "gender") return;
                    setGenderOpen((prev) => !prev);
                  }}
                  className={
                    pillClass +
                    " flex items-center justify-between " +
                    (editingField !== "gender" ? " cursor-default" : "")
                  }
                >
                  <span>
                    {profile.gender
                      ? genderLabel(profile.gender)
                      : "성별을 선택해 주세요"}
                  </span>
                  <span className="text-xs">▾</span>
                </button>

                {genderOpen && editingField === "gender" && (
                  <div className="absolute left-0 right-0 mt-1 bg-white rounded-2xl shadow-md border border-[#F8D9A8] z-10 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setProfile((prev) => ({ ...prev, gender: "FEMALE" }));
                        setGenderOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-[#FFF7E6] ${
                        profile.gender === "FEMALE" ? "font-semibold" : ""
                      }`}
                    >
                      여자
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfile((prev) => ({ ...prev, gender: "MALE" }));
                        setGenderOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-[#FFF7E6] ${
                        profile.gender === "MALE" ? "font-semibold" : ""
                      }`}
                    >
                      남자
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleGenderButton}
                disabled={savingField === "gender"}
                className="px-4 py-2 rounded-full bg-[#F8D9A8] hover:bg-[#F3C886] text-sm font-medium text-gray-700 disabled:opacity-60"
              >
                {savingField === "gender"
                  ? "저장 중..."
                  : editingField === "gender"
                  ? "수정완료"
                  : "수정하기"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#FFE7BF] border-t border-[#F3C886] flex items-center justify-around">
        <Link
          to="/calendar"
          className="flex flex-col items-center text-xs text-gray-600"
        >
          <span className="text-xl">📅</span>
          <span>달력</span>
        </Link>
        <Link
          to="/fortune"
          className="flex flex-col items-center text-xs text-gray-600"
        >
          <span className="text-xl">✨</span>
          <span>운세</span>
        </Link>
        <Link
          to="/mood"
          className="flex flex-col items-center text-xs text-gray-600"
        >
          <span className="text-xl">😊</span>
          <span>감정</span>
        </Link>
        <button
          className="flex flex-col items-center text-xs text-gray-900 font-semibold"
          disabled
        >
          <span className="text-xl">👤</span>
          <span>계정</span>
        </button>
      </nav>

      {/* 토스트 */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-4 py-2 rounded-full">
          {toast}
        </div>
      )}
    </div>
  );
}

export default AccountPage;
