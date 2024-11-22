import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // 환경 변수에서 기본 URL 읽기
  headers: {
    'Content-Type': 'application/json', // JSON 데이터 전송 설정
  },
});

export default api;