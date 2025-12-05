import axios from "axios";

const apiClient = axios.create({
  // 백엔드 스프링 서버 주소
  baseURL: "/api",
  withCredentials: true, // 세션/쿠키 기반 인증이면 유지
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
