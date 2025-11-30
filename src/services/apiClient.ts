import axios from "axios";

const apiClient = axios.create({
  // 백엔드 스프링 서버 주소
  baseURL: "http://localhost:8080",
  withCredentials: true, // 세션/쿠키 기반 인증이면 유지
});

export default apiClient;
