import React from 'react';
import Modal from 'react-modal';
import logo from '../assets/swithLogo.png';
import cancelIcon from '../assets/Cancel.png';

Modal.setAppElement('#root'); // 애플리케이션의 루트 요소 설정

const DeleteAccountModal = ({ isOpen, onClose, onConfirmDelete }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="bg-black bg-opacity-70 fixed inset-0 flex items-center justify-center z-50"
      className="bg-white rounded-lg p-20 md:p-24 w-11/12 max-w-md md:max-w-xl mx-auto relative text-center"
    >
      <img src={cancelIcon} alt="닫기" onClick={onClose} className="absolute top-4 right-4 w-4 h-4 cursor-pointer" />
      <img src={logo} alt="Swith Logo" className="mx-auto h-12 md:h-16 mb-4 md:mb-6" />
      <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 whitespace-normal break-keep text-[#FF0000]">정말 탈퇴 하시겠습니까?</h2>
      <p className="text-sm md:text-lg text-[#5B5B5B] mb-4 md:mb-6 whitespace-normal break-keep">계정이 영구적으로 사라집니다</p>
      <div className="flex justify-center gap-6">
        <button onClick={onConfirmDelete} className="bg-[#91DDAB] text-white w-full sm:w-28 h-12 rounded-xl shadow-lg hover:bg-[#7BAE8D]">
          네
        </button>
        <button onClick={onClose} className="bg-[#EFF9F2] text-[#91DDAB] w-full sm:w-28 h-12 rounded-xl shadow-lg hover:bg-gray-200">
          아니요
        </button>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;
