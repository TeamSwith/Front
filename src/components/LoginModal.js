import React from 'react';
import Modal from 'react-modal';
import logo from '../assets/swithLogo.png';
import cancelIcon from '../assets/Cancel.png';
import chatIcon from '../assets/Chat.png';
import '../styles/LoginModal.css';

Modal.setAppElement('#root'); // 애플리케이션의 루트 요소 설정

const LoginModal = ({ isOpen, onClose }) => {

  // .env에서 카카오 REST API 키와 리디렉션 URL 가져오기
  const kakaoClientId = process.env.REACT_APP_KAKAO_CLIENT_ID;
  const kakaoRedirectUri = process.env.REACT_APP_KAKAO_REDIRECT_URI;

  // 카카오 로그인 페이지 URL 생성
  const handleKakaoLogin = () => {
    const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectUri}`;
    window.location.href = kakaoLoginUrl; // 카카오 로그인 페이지로 리디렉션
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} overlayClassName="login-modal-overlay" className="login-modal-content">
      <img src={cancelIcon} alt="닫기" onClick={onClose} className="close-icon" />
      <img src={logo} alt="Swith Logo" className="logo" />
      <h2 className="title">Swith에 오신 것을 환영합니다!</h2>
      <p className="description">이제 스터디의 여정을 함께 시작해 보세요</p>
      <button onClick={handleKakaoLogin} className="login-modal-button">
        <img src={chatIcon} alt="카카오 로그인 아이콘" className="login-icon" />
        카카오 로그인
      </button>
    </Modal>
  );
};

export default LoginModal;