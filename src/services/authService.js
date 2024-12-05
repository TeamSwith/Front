// /oauth/kakao/refresh -> 리프레시 토큰을 사용하여 토큰 재발급
// /getLoginUser -> 액세스 토큰을 사용하여 사용자 정보를 가져옴
import api from '../api';  // 수정된 axios 인스턴스 import

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // 백엔드 API URL

// 리프레시 토큰을 사용하여 액세스 토큰 갱신
export const refreshAccessToken = async () => {
    // 로컬 스토리지에서 리프레시 토큰 가져오기
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) { throw new Error('리프레시 토큰이 존재하지 않습니다'); }
  
    try {
        const response = await api.post(`${API_BASE_URL}/oauth/kakao/refresh`, {
          refreshToken: refreshToken,  // 리프레시 토큰을 POST 요청 본문에 포함
        });
        const newAccessToken = response.data.accessToken;  // 새로운 액세스 토큰 받기
        const newRefreshToken = response.data.refreshToken; // 새로운 리프레시 토큰 받기 (백엔드에서 제공하는 경우)
    
        // 새 토큰을 로컬 스토리지에 저장
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        console.log('새로운 액세스 토큰:', newAccessToken);
        console.log('새로운 리프레시 토큰:', newRefreshToken);
    
        return newAccessToken;  // 새로운 액세스 토큰 반환
      } catch (error) {
        console.error('액세스 토큰 갱신 실패:', error);
        throw new Error('액세스 토큰 갱신 실패');
      }
};

// 액세스 토큰을 사용하여 사용자 정보 가져오기
export const getUserInfo = async (newAccessToken = null) => {
    // 로컬 스토리지에서 액세스 토큰 가져오기
  let accessToken = newAccessToken || localStorage.getItem('accessToken');
  if (!accessToken) {  throw new Error('로그인되어 있지 않습니다'); }

  try {
    const response = await api.get(`${API_BASE_URL}/getLoginUser`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,  // 액세스 토큰을 GET 요청 본문에 포함
      },
    });

    const userData = response.data.data;
    if (userData) {
        const { email, nickname, id, image } = userData;

      // 데이터 유효성 검증
      if (email && nickname && id) {
        // 로컬 스토리지에 저장
        // localStorage.setItem('email', email);
        localStorage.setItem('nickname', nickname);
        // localStorage.setItem('userId', id);
        localStorage.setItem('userImage', image);
        console.log('User data fetched and saved:', { email, nickname, id });
        return userData;  // 사용자 정보 반환
      } else {
        console.warn('Invalid user data structure:', userData);
        throw new Error('사용자 데이터가 유효하지 않습니다');
      }
    } else {
      console.warn('Unexpected API response format:', response.data);
      throw new Error('API 응답 형식이 예상과 다릅니다');
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('액세스 토큰 만료, 리프레시 토큰을 사용하여 갱신 시도');
      
      try {
        // 리프레시 토큰을 사용하여 액세스 토큰 갱신
        accessToken = await refreshAccessToken();

        // 갱신된 액세스 토큰으로 다시 사용자 정보 요청
        const retryResponse = await api.get(`${API_BASE_URL}/getLoginUser`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 새로운 액세스 토큰 포함
          },
        });

        const userData = retryResponse.data.data;
        const { email, nickname, id, image } = userData;

        if (email && nickname && id) {
          // localStorage.setItem('email', email);
          localStorage.setItem('nickname', nickname);
          // localStorage.setItem('userId', id);
          localStorage.setItem('userImage', image);
          console.log('User data fetched and saved after refresh:', { email, nickname, id });
        } else {
          console.warn('Invalid user data structure after refresh:', userData);
          throw new Error('사용자 데이터가 유효하지 않습니다');
        }

        return userData;
      } catch (refreshError) {
        console.error('리프레시 토큰 갱신 실패:', refreshError);
        throw new Error('액세스 토큰 갱신 실패');
      }
    }
    // 401 외의 다른 에러는 그대로 던짐
    console.error('사용자 정보 가져오기 실패:', error);
    throw error;
  }
};