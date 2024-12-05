import React, { useState } from 'react';
import Modal from 'react-modal';
import cancelIcon from '../assets/Cancel.png'

Modal.setAppElement('#root'); // 애플리케이션의 루트 요소 설정

const AlarmModal = ({ isOpen, onClose, isLoggedIn }) => {

  const [alerts, setAlerts] = useState([
    "알림 내용 1. 텍스트가 길어지면 줄바꿈이 자동으로 됩니다.",
    "알림 내용 2. 텍스트가 길어지면 줄바꿈이 자동으로 됩니다. 여기서 길어지면 줄바꿈이 될 겁니다.",
    "알림 내용 3",
    "알림 내용 4",
    "알림 내용 5",
    "알림 내용 6",
    "알림 내용 7",
    "알림 내용 8",
  ]);

  const handleRemoveAlert = (index) => {
    const newAlerts = alerts.filter((_, i) => i !== index);
    setAlerts(newAlerts);
  };

  // 로그인되지 않았을 때 모달을 열지 않도록 조건 추가
  if (!isLoggedIn) { return null; }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 z-50 flex justify-end items-start"
      className="absolute bg-white rounded-3xl p-4 w-64 mt-16 right-4 max-w-[400px] mx-auto 
      text-left sm:right-10 sm:mt-18 md:right-10 md:mt-18 lg:mt-18 shadow-lg shadow-gray-400/50"
    >
      <h2 className="text-lg font-bold mt-1 mb-4 ml-1">알림</h2>

      {alerts.length === 0 ? (
        <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 mt-4 mb-10">알림이 없습니다</p>
        </div>
      ) : (
        <div className="max-h-80 overflow-y-auto">
            {alerts.map((alert, index) => (
            <div
                key={index}
                className="flex justify-between items-center p-3 mb-3 rounded-lg shadow-lg shadow-gray-400/30 break-words"
                style={{ background: "linear-gradient(to right, #DDFAE6, #A2F6BF)" }}
            >
                <p className="text-sm flex-1">{alert}</p>
                <button onClick={() => handleRemoveAlert(index)} className="ml-2">
                <img src={cancelIcon} alt="삭제" className="w-3 h-3" />
                </button>
            </div>
            ))}
        </div>
      )}

    </Modal>
  );
};

export default AlarmModal;