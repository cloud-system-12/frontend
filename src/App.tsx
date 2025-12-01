import { Routes, Route, Navigate } from "react-router-dom";
import MoodPage from "./pages/MoodPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import CalendarPage from "./pages/CalendarPage.tsx";

function App() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/mood" element={<MoodPage />} />
        {/* 이상한 주소로 들어오면 홈으로 보내기 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
