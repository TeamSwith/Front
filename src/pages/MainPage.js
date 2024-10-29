import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">스터디 관리 서비스</h1>
      <p className="mb-8">스터디를 효율적으로 관리하고 참여할 수 있는 플랫폼입니다.</p>
      <div className="space-x-4">
        <Link to="/create-study" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          스터디 생성
        </Link>
        <Link to="/manage-study" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          스터디 관리
        </Link>
      </div>
    </div>
  );
};

export default MainPage;