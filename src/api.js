import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { refreshAccessToken } from './services/authService';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // 환경 변수에서 기본 URL 읽기
  headers: {
    'Content-Type': 'application/json', // JSON 데이터 전송 설정
  },
});

const isAccessTokenExpired = (accessToken) => {
  try {
    const decodedToken = jwtDecode(accessToken);  // jwt 디코딩
    const currentTime = Date.now() / 1000;  // 초 단위로 현재 시간
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('JWT 디코딩 오류:', error);
    return true; // 토큰이 없거나 잘못된 경우 기본적으로 expired로 처리
  }
};

// 요청 인터셉터로 모든 api 요청에 액세스 토큰을 자동으로 추가
api.interceptors.request.use(
  async (config) => {
    // 로컬 스토리지에서 액세스 토큰 가져오기
    let accessToken = localStorage.getItem('accessToken'); 

    // 액세스 토큰이 없거나 만료된 경우 리프레시 토큰으로 갱신
    if (accessToken && isAccessTokenExpired(accessToken)) {
      try {
        accessToken = await refreshAccessToken(); // authService.js에서 갱신된 액세스 토큰 반환
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      } catch (error) {
        console.error('액세스 토큰 갱신 실패:', error);
        throw error;
      }
    } else if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러(토큰 만료)가 발생하면 액세스 토큰을 리프레시하여 다시 요청
api.interceptors.response.use(
    // 정상 응답 처리
    (response) => { return response; },

    async (error) => {
      // 토큰 만료 에러 처리
      if (error.response && error.response.status === 401 && !error.config._retry) {
        try {
          // 리프레시 토큰을 사용하여 액세스 토큰 갱신
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) throw new Error('리프레시 토큰이 존재하지 않습니다');
  
          const refreshResponse = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/oauth/kakao/refresh`, {
            refreshToken: refreshToken,  // 리프레시 토큰을 POST 요청 본문에 포함
          });
  
          const newAccessToken = refreshResponse.data.Accesstoken;  // 새 액세스 토큰
          const newRefreshToken = refreshResponse.data.Refreshtoken; // 새 리프레시 토큰
  
          // 새 토큰을 로컬 스토리지에 저장
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
  
          // 기존 요청을 새 액세스 토큰을 포함시켜 재요청
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          error.config._retry = true; // 재시도 방지 플래그 설정
          return axios(error.config); // 재시도
        } catch (refreshError) {
          console.error('리프레시 토큰 갱신 실패:', refreshError);
          return Promise.reject(refreshError);
        }
      }
      // 401 외의 다른 에러는 그대로 던짐
      return Promise.reject(error);
    }
);
  
export default api;