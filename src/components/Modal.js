import React from 'react';

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [studyId, setStudyId] = React.useState('');

  const handleSubmit = () => {
    onSubmit(studyId); // 부모 컴포넌트에 아이디 전달
    setStudyId(''); // 입력 필드 초기화
    onClose(); // 모달 닫기
  };

  if (!isOpen) return null; // 모달이 열려있지 않으면 null 반환

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl mb-4">스터디 아이디 입력</h2>
        <input
          type="text"
          value={studyId}
          onChange={(e) => setStudyId(e.target.value)}
          placeholder="스터디 아이디를 입력하세요"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none"
        />
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleSubmit}>
            확인
          </button>
          <button className="px-4 py-2 ml-2 bg-gray-300 text-black rounded hover:bg-gray-400" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;