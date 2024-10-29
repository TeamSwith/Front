import React, { useState } from 'react';

const CreateStudy = () => {
  const [studyName, setStudyName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateStudy = () => {
    // 스터디 생성 로직 추가 (예: API 요청)
    alert(`스터디 "${studyName}"가 생성되었습니다!`);
    setStudyName('');
    setDescription('');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">스터디 생성</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-lg mb-2">스터디 이름</label>
          <input
            type="text"
            value={studyName}
            onChange={(e) => setStudyName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="스터디 이름을 입력하세요"
          />
        </div>
        <div>
          <label className="block text-lg mb-2">스터디 설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="스터디 설명을 입력하세요"
          />
        </div>
        <button
          type="button"
          onClick={handleCreateStudy}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          스터디 생성
        </button>
      </form>
    </div>
  );
};

export default CreateStudy;