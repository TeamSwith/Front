// src/pages/LoginCallback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../services/authService'; // 로그인 후 토큰을 처리하는 함수

const LoginCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code'); // URL에서 카카오 로그인 후 반환된 code를 추출

    console.log('Received code:', code); // `code`가 정상적으로 추출되었는지 확인

    if (code) {
      // `code`가 존재하면 로그인 후 토큰을 처리하고 페이지를 이동
      handleLogin(code)
        .then(() => {
          alert('로그인 성공!');
          navigate('/main'); // 로그인 후 메인 페이지로 리디렉션
        })
        .catch((error) => {
          alert('로그인 실패: ' + error.message);
        });
    }
  }, [navigate]);

  return (
    <div>
      <p>로그인 처리 중...</p>
    </div>
  );
};

export default LoginCallback;