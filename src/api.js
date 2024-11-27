import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // 환경 변수에서 기본 URL 읽기
  headers: {
    'Content-Type': 'application/json', // JSON 데이터 전송 설정
  },
});

// 요청 인터셉터를 설정하여 모든 요청에 액세스 토큰을 자동으로 추가
api.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem('accessToken');  // 로컬 스토리지에서 액세스 토큰 가져오기
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`; // 헤더에 액세스 토큰 추가
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
// 응답 인터셉터: 401 에러(토큰 만료)가 발생하면 액세스 토큰을 리프레시하여 다시 요청
api.interceptors.response.use(
    (response) => {
      // 정상 응답 처리
      return response;
    },
    async (error) => {
      // 토큰 만료 에러 처리
      if (error.response && error.response.status === 401) {
        try {
          // 리프레시 토큰을 사용하여 액세스 토큰 갱신
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) throw new Error('리프레시 토큰이 존재하지 않습니다');
  
          const refreshResponse = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/oauth/kakao/refresh`, {
            refresh_token: refreshToken,  // 리프레시 토큰을 POST 요청 본문에 포함
          });
  
          const newAccessToken = refreshResponse.data.access_token;  // 새 액세스 토큰
          const newRefreshToken = refreshResponse.data.refresh_token; // 새 리프레시 토큰
  
          // 새 토큰을 로컬 스토리지에 저장
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
  
          // 기존 요청을 새 액세스 토큰을 포함시켜 재요청
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(error.config); // 재시도
        } catch (refreshError) {
          // 리프레시 토큰으로 갱신 실패 시 에러 처리
          console.error('리프레시 토큰 갱신 실패:', refreshError);
          return Promise.reject(refreshError);
        }
      }
      // 401 외의 다른 에러는 그대로 던짐
      return Promise.reject(error);
    }
);
  
export default api;