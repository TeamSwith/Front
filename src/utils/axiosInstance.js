// src/utils/axiosInstance.js
import axios from 'axios';

// 기본 API URL 설정
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,  // 요청 타임아웃 설정 (옵션)
});

// 인터셉터 설정: 모든 요청에 액세스 토큰 자동 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');  // 로컬 스토리지에서 액세스 토큰 가져오기

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;  // 헤더에 액세스 토큰 추가
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;