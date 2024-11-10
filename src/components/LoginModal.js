import React from 'react';
import Modal from 'react-modal';
import logo from '../assets/swithLogo.png';
import cancelIcon from '../assets/Cancel.png';
import chatIcon from '../assets/Chat.png';

Modal.setAppElement('#root'); // 애플리케이션의 루트 요소를 설정

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="bg-black bg-opacity-70 fixed inset-0 flex items-center justify-center z-50"
      className="bg-white rounded-lg p-20 md:p-24 w-11/12 max-w-md md:max-w-xl mx-auto relative text-center"
    >
      <img src={cancelIcon} alt="닫기" onClick={onClose} className="absolute top-4 right-4 w-4 h-4 cursor-pointer" />
      <img src={logo} alt="Swith Logo" className="mx-auto h-12 md:h-16 mb-4 md:mb-6" />
      <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 whitespace-normal break-keep">Swith에 오신 것을 환영합니다!</h2>
      <p className="text-sm md:text-lg text-[#5B5B5B] mb-4 md:mb-6 whitespace-normal ">이제 스터디의 여정을 함께 시작해 보세요</p>
      <button
        onClick={onLogin}
        className="bg-[#FEE500] flex items-center justify-center gap-4 w-full max-w-xs md:max-w-sm mx-auto py-2 md:py-3 rounded-md text-sm md:text-base font-bold text-black"
      >
        <img src={chatIcon} alt="카카오 로그인 아이콘" className="w-4 h-4" />
        카카오 로그인
      </button>
    </Modal>
  );
};

export default LoginModal;
