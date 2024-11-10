import React, { useState } from 'react';
import Modal from 'react-modal';
import logo from '../assets/swithLogo.png';
import cancelIcon from '../assets/Cancel.png';
import EyeIcon from '../assets/Eye.png';
import EyeOffIcon from '../assets/Eyeoff.png';

const StudyManagementModal = ({ isOpen, onClose, onJoin }) => {
  const [studyId, setStudyId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleJoinClick = () => {
    onJoin(studyId, password); // 모달에서 스터디에 입장하는 기능
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="bg-black bg-opacity-70 fixed inset-0 flex items-center justify-center z-50"
      className="bg-white text-black rounded-lg p-8 md:p-12 w-11/12 max-w-md md:max-w-xl mx-auto relative text-center"
    >
      <img src={cancelIcon} alt="닫기" onClick={onClose} className="absolute top-4 right-4 w-4 h-4 cursor-pointer" />
      <img src={logo} alt="Swith Logo" className="mx-auto h-12 md:h-16 mb-2 md:mb-4" />
      <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-5 whitespace-normal break-keep">스터디에 입장하려면 아래 정보를 입력하세요!</h2>
      <input
        type="text"
        placeholder="스터디 아이디"
        className="text-sm sm:text-base border border-green-400 w-11/12 p-2 sm:p-3 rounded-lg mb-4"
        value={studyId}
        onChange={(e) => setStudyId(e.target.value)}
      />
      <div className="relative mb-6">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="스터디 비밀번호"
          className="text-sm sm:text-base border border-green-400 w-11/12 p-2 sm:p-3 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <img
          src={showPassword ? EyeOffIcon : EyeIcon}
          alt="toggle visibility"
          onClick={togglePasswordVisibility}
          className="absolute right-6 sm:right-8 top-2 sm:top-4 cursor-pointer"
          style={{ width: "20px", height: "20px" }}
        />
      </div>
      <button
        onClick={handleJoinClick}
        className="bg-[#91DDAB] text-white w-28 h-12 rounded-xl shadow-lg hover:bg-[#7BAE8D]"
      >
        입장하기
      </button>
    </Modal>
  );
};

export default StudyManagementModal;