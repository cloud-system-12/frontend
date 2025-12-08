// src/pages/AccountPage.tsx
import { useEffect, useState } from "react";
import {
  fetchAccountInfo,
  updateBirthday,
  updateBirthTime,
  updateGender,
} from "../api/account";
import BottomNavBar from "../components/BottomNavBar";

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

  const [editingField, setEditingField] = useState<
    "birthDate" | "birthTime" | "gender" | null
  >(null);

  const [savingField, setSavingField] = useState<
    "birthDate" | "birthTime" | "gender" | null
  >(null);

  const [toast, setToast] = useState<string | null>(null);
  const [genderOpen, setGenderOpen] = useState(false);
  const [birthTimeOpen, setBirthTimeOpen] = useState(false);

  // ----------------------------------------------
  // 태어난 시간 옵션
  // ----------------------------------------------
  const BIRTH_TIME_OPTIONS = [
    { value: "", label: "선택하세요" },
    { value: "모름", label: "모름" },
    { value: "자시", label: "자시(子時) - 23:30 ~ 01:29" },
    { value: "축시", label: "축시(丑時) - 01:30 ~ 03:29" },
    { value: "인시", label: "인시(寅時) - 03:30 ~ 05:29" },
    { value: "묘시", label: "묘시(卯時) - 05:30 ~ 07:29" },
    { value: "진시", label: "진시(辰時) - 07:30 ~ 09:29" },
    { value: "사시", label: "사시(巳時) - 09:30 ~ 11:29" },
    { value: "오시", label: "오시(午時) - 11:30 ~ 13:29" },
    { value: "미시", label: "미시(未時) - 13:30 ~ 15:29" },
    { value: "신시", label: "신시(申時) - 15:30 ~ 17:29" },
    { value: "유시", label: "유시(酉時) - 17:30 ~ 19:29" },
    { value: "술시", label: "술시(戌時) - 19:30 ~ 21:29" },
    { value: "해시", label: "해시(亥時) - 21:30 ~ 23:29" },
  ];

  const birthTimeLabel = (value: string) => {
    const item = BIRTH_TIME_OPTIONS.find((t) => t.value === value);
    return item ? item.label : "태어난 시간을 선택해 주세요";
  };

  // ----------------------------------------------
  // 유틸
  // ----------------------------------------------
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const pillClass =
    "flex-1 px-4 py-2 rounded-full bg-white text-sm text-gray-800 border border-[#F8D9A8] focus:outline-none focus:ring-2 focus:ring-[#F3C886] disabled:bg-white disabled:text-gray-800 disabled:cursor-default";

  // ----------------------------------------------
  // 계정정보 불러오기
  // ----------------------------------------------
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

  // ----------------------------------------------
  // 생일 수정
  // ----------------------------------------------
  const handleBirthDateButton = async () => {
    if (editingField !== "birthDate") {
      setEditingField("birthDate");

      // 자동 date picker 열기
      setTimeout(() => {
        const input = document.getElementById(
          "birthDateInput"
        ) as HTMLInputElement | null;
        input?.showPicker?.();
        input?.click?.();
      }, 0);

      return;
    }

    if (!profile.birthDate) return;

    setSavingField("birthDate");
    try {
      await updateBirthday(profile.birthDate);
      showToast("생년월일이 수정되었어요 ✨");
      setEditingField(null);
    } catch {
      showToast("생년월일 수정에 실패했어요.");
    } finally {
      setSavingField(null);
    }
  };

  // ----------------------------------------------
  // 태어난 시간 수정
  // ----------------------------------------------
  const handleBirthTimeButton = async () => {
    if (editingField !== "birthTime") {
      setEditingField("birthTime");
      setBirthTimeOpen(true); // 자동 드롭다운 오픈
      return;
    }

    if (!profile.birthTime) return;

    setSavingField("birthTime");
    try {
      await updateBirthTime(profile.birthTime);
      showToast("태어난 시간이 수정되었어요 ✨");
      setEditingField(null);
      setBirthTimeOpen(false);
    } catch {
      showToast("태어난 시간 수정에 실패했어요.");
    } finally {
      setSavingField(null);
    }
  };

  // ----------------------------------------------
  // 성별 수정
  // ----------------------------------------------
  const handleGenderButton = async () => {
    if (editingField !== "gender") {
      setEditingField("gender");
      setGenderOpen(true); // 자동 드롭다운 오픈
      return;
    }

    if (!profile.gender) return;

    setSavingField("gender");
    try {
      await updateGender(profile.gender as "MALE" | "FEMALE");
      showToast("성별이 수정되었어요 ✨");
      setEditingField(null);
      setGenderOpen(false);
    } catch {
      showToast("성별 수정에 실패했어요.");
    } finally {
      setSavingField(null);
    }
  };

  // ----------------------------------------------
  // 로딩 화면
  // ----------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7E6]">
        <div className="text-gray-600 text-sm">계정 정보를 불러오는 중...</div>
      </div>
    );
  }

  // ----------------------------------------------
  // 본문 화면
  // ----------------------------------------------
  return (
    <div className="h-screen flex flex-col bg-[#FFF7E6] overflow-hidden">
      {/* 상단 내용 */}
      <div className="flex-1 flex flex-col items-center pt-10 pb-20 px-6 overflow-y-auto">
        {/* 프로필 아이콘 + 제목 */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <div className="w-16 h-16 rounded-full border border-[#F3C886] flex items-center justify-center">
            <span className="text-3xl">👤</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">계정</h1>
        </div>

        {/* 카드 */}
        <div className="w-full max-w-xl bg-[#FFF0D1] rounded-3xl shadow-sm px-6 py-6 space-y-4">
          {/* 아이디 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">아이디</span>
            <input
              value={profile.userId}
              readOnly
              className={pillClass + " cursor-default"}
            />
          </div>

          {/* 이메일 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">이메일</span>
            <input
              value={profile.email}
              readOnly
              className={pillClass + " cursor-default"}
            />
          </div>

          {/* 생년월일 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">생년월일</span>
            <div className="flex items-center gap-3">
              <input
                id="birthDateInput"
                type="date"
                value={profile.birthDate}
                disabled={editingField !== "birthDate"}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, birthDate: e.target.value }))
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
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => {
                    if (editingField !== "birthTime") return;
                    setBirthTimeOpen((prev) => !prev);
                  }}
                  className={
                    pillClass +
                    " flex items-center justify-between gap-2 " +
                    (editingField !== "birthTime" ? " cursor-default" : "")
                  }
                >
                  <span>{birthTimeLabel(profile.birthTime)}</span>
                  <span className="text-xs">▾</span>
                </button>

                {birthTimeOpen && editingField === "birthTime" && (
                  <div className="absolute left-0 right-0 mt-1 bg-white rounded-2xl shadow-md border border-[#F8D9A8] z-40 max-h-60 overflow-y-auto">
                    {BIRTH_TIME_OPTIONS.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => {
                          setProfile((prev) => ({
                            ...prev,
                            birthTime: t.value,
                          }));
                          setBirthTimeOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-sm text-left hover:bg-[#FFF7E6] ${
                          profile.birthTime === t.value ? "font-semibold" : ""
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

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
                    " flex items-center justify-between gap-2 " +
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
                  <div className="absolute left-0 right-0 mt-1 bg-white rounded-2xl shadow-md border border-[#F8D9A8] z-40 max-h-40 overflow-y-auto">
                    <button
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
      <BottomNavBar />

      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-4 py-2 rounded-full">
          {toast}
        </div>
      )}
    </div>
  );
}

export default AccountPage;
