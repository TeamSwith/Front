import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // URL에서 access-token과 refresh-token을 추출
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access-token');
    const refreshToken = urlParams.get('refresh-token');

    if (accessToken && refreshToken) {
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      console.log('Tokens saved:', accessToken, refreshToken);

      navigate('/'); // 메인 페이지로 리디렉션
    }
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
};

export default LoginCallback;