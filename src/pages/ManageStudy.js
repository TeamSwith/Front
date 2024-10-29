import React, { useState } from 'react';

const ManageStudy = () => {
  const [studies, setStudies] = useState([
    { id: 1, name: '스터디 1', description: '스터디 1에 대한 설명' },
    { id: 2, name: '스터디 2', description: '스터디 2에 대한 설명' },
  ]);

  const handleDelete = (id) => {
    setStudies(studies.filter((study) => study.id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">스터디 관리</h1>
      <ul className="space-y-4">
        {studies.map((study) => (
          <li key={study.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{study.name}</h2>
              <p>{study.description}</p>
            </div>
            <button
              onClick={() => handleDelete(study.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageStudy;