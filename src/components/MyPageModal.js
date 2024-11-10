import React from 'react';
import Modal from 'react-modal';
import profileImage from '../assets/sampleProfileImage.png'; // 샘플 이미지 경로 설정
import grayChatIcon from '../assets/grayChat.png';

Modal.setAppElement('#root'); // 애플리케이션의 루트 요소 설정

const MyPageModal = ({ isOpen, onClose, onLogout }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 z-50 flex justify-end items-start"
      className="
      absolute bg-white rounded-3xl p-6 
      w-56 mt-16 right-4 mr-10 max-w-[220px] 
      mx-auto text-center
      sm:right-10 sm:mt-18 md:right-10 md:mt-18 lg:mr-10 lg:mt-18
    "
    >
      <img
        src={profileImage} // 프로필 이미지
        alt="프로필 이미지"
        className="mx-auto rounded-full w-32 h-32 mb-4"
      />
      <h2 className="text-lg font-bold mb-3">
        오므라이스 
        <span className="text-sm text-[#BBBBBB] ml-2">님</span>
      </h2>
      <div className="flex items-center justify-center text-xs text-[#BBBBBB] mb-5">
        <img src={grayChatIcon} alt="Chat Icon" className="w-4 h-4 mr-2" />
        <span>카카오 계정으로 로그인됨</span>
      </div>
      <button
        onClick={onLogout}
        className="text-xs hover:underline focus:outline-none"
      >
        로그아웃
      </button>
    </Modal>
  );
};

export default MyPageModal;