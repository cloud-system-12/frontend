// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import CalendarPage from "./pages/CalendarPage.tsx";
import MoodPage from "./pages/MoodPage.tsx";
import FortunePage from "./pages/FortunePage.tsx";
import AccountPage from "./pages/AccountPage.tsx";

function App() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/mood" element={<MoodPage />} />
        <Route path="/fortune" element={<FortunePage />} />
        <Route path="/account" element={<AccountPage />} />
        {/* 존재하지 않는 경로로 들어오면 홈으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
