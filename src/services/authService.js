import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // 백엔드 API URL

// 로그인 후 토큰을 받아서 로컬 스토리지에 저장하는 함수
export const handleLogin = (code) => {
  // 카카오 로그인 후 액세스 토큰 및 리프레시 토큰을 백엔드에서 받는 함수
  return axios.get(`${API_BASE_URL}/api/oauth/kakao`, {
    params: { code } // 코드가 URL 파라미터로 전달됩니다.
  })
    .then((response) => {
      const result = response.data; // axios에서 응답은 response.data에 저장됨
      console.log('Received response:', result); // 응답이 잘 도착했는지 확인

      if (result.success) {
        const { accessToken, refreshToken, email } = result.data.tokens;

        // 토큰을 로컬 스토리지에 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('email', email);

        console.log('Tokens saved to localStorage:', accessToken, refreshToken, email);
        return { accessToken, refreshToken, email };
      } else {
        throw new Error('로그인 실패');
      }
    })
    .catch((error) => {
      console.error('Error during login:', error);
      throw error; // 오류를 다시 던져서 호출한 곳에서 처리할 수 있게 함
    });
};
