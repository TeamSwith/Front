// /api/getLoginUser에서 액세스 토큰을 사용하여 사용자 정보를 가져옴
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // 백엔드 API URL

// 사용자 정보 가져오기 (토큰을 통해)
export const getUserInfo = () => {
  const accessToken = localStorage.getItem('accessToken'); // 로컬 스토리지에서 액세스 토큰 가져오기
  
  if (!accessToken) {  throw new Error('로그인되어 있지 않습니다'); }

  // 사용자 정보를 가져오는 API 요청
  return axios.get(`${API_BASE_URL}/getLoginUser`, {
    headers: {
      Authorization: `Bearer ${accessToken}`, // 헤더에 액세스 토큰 포함
    },
  })
  .then((response) => {
    if (response.data && response.data.data) {
      // 응답 데이터에서 필요한 정보를 추출
      const userData = response.data.data;
      const { email, nickname, id } = userData;

      // 데이터 유효성 검증
      if (email && nickname && id) {
        // 로컬 스토리지에 필요한 데이터 저장
        localStorage.setItem('email', email);
        localStorage.setItem('nickname', nickname);
        localStorage.setItem('userId', id);
        console.log('User data fetched and saved:', { email, nickname, id }); // 콘솔 확인
      } else {
        console.warn('Invalid user data structure:', userData);
        throw new Error('사용자 데이터가 유효하지 않습니다');
      }

      return userData;  // 사용자 정보 반환
    } else {
      console.warn('Unexpected API response format:', response.data);
      throw new Error('API 응답 형식이 예상과 다릅니다');
    }
  })
  .catch((error) => {
    console.error('사용자 정보 가져오기 실패:', error);
    throw error;
  });
};