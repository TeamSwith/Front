import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import cancelIcon from '../assets/Cancel.png';

Modal.setAppElement('#root'); // 애플리케이션의 루트 요소 설정

const AlarmModal = ({ isOpen, onClose, isLoggedIn, alerts }) => {
  const [localAlerts, setLocalAlerts] = useState([]);

  useEffect(() => {
    // alerts prop이 변경될 때마다 로컬 상태를 업데이트
    setLocalAlerts(alerts);
  }, [alerts]);

  const handleRemoveAlert = (index) => {
    const newAlerts = localAlerts.filter((_, i) => i !== index);
    setLocalAlerts(newAlerts);
  };
  // 로그인되지 않았을 때 모달을 열지 않도록 조건 추가
  if (!isLoggedIn) { return null; }

  const formatAlertContent = (alert) => {
    // alert.content에서 날짜, 시간, 장소 추출
    const parts = alert.content.split(': ')[1].split(','); // 콜론(:) 뒤의 내용을 콤마(,)로 분리
    const studyDate = parts[0]; // 첫 번째 요소: 날짜
    const studyTime = parts[1]; // 두 번째 요소: 시간
    const location = parts.slice(2).join(',').trim(); // 세 번째 이후: 장소 (여러 부분이 있을 수 있음)

    return (
        <div className="text-sm flex-1">
          <p className="font-bold">새로운 스터디 일정</p>
          <p>날짜 | <span>{studyDate}</span></p>
          <p>시간 | <span>{studyTime}</span></p>
          <p>장소 | <span>{location}</span></p>
        </div>
      );
    };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 z-50 flex justify-end items-start"
      className="absolute bg-white rounded-3xl p-4 w-64 mt-16 right-4 max-w-[400px] mx-auto 
      text-left sm:right-10 sm:mt-18 md:right-10 md:mt-18 lg:mt-18 shadow-lg shadow-gray-400/50"
    >
      <h2 className="text-lg font-bold mt-1 mb-4 ml-1">알림</h2>

      {localAlerts.length === 0 ? (
        <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 mt-4 mb-10">알림이 없습니다</p>
        </div>
      ) : (
        <div className="max-h-80 overflow-y-auto">
            {localAlerts.map((alert, index) => (
            <div
                key={index}
                className="flex justify-between items-center p-3 mb-3 rounded-lg shadow-lg shadow-gray-400/30 break-words"
                style={{ background: "linear-gradient(to right, #DDFAE6, #A2F6BF)" }}
            >
                {formatAlertContent(alert)}
                {/*<p className="text-sm flex-1">{alert.content}</p>*/}
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