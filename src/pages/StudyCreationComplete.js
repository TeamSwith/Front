import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from '../components/Banner';
import { getStudyDetails } from '../services/studyService';

const StudyCreationComplete = () => {
  const navigate = useNavigate();
  const [studyDetails, setStudyDetails] = useState(null);

  // 로컬 스토리지에서 스터디 고유 id를가져옴
  const storedId = localStorage.getItem('id');

  // 페이지가 로드될 때, groupInsertId를 통해 API 호출로 스터디 세부 정보 가져오기
  useEffect(() => {
    if (storedId) {
      getStudyDetails(storedId) // API 호출
        .then((response) => {
          console.log('스터디 정보:', response.data);
          setStudyDetails(response.data);  // 응답을 studyDetails에 저장
        })
        .catch((error) => { console.error('스터디 정보 가져오기 실패:', error); });
    }
  }, [storedId]); // 스터디 고유 id가 변경될 때마다 호출

  // 확인 버튼 누르면 메인 페이지로 이동
  const handleConfirm = () => { navigate('/'); };
  // 관리 페이지로 이동 누르면 스터디 관리 페이지로 이동
  const handleGoToManagement = () => { navigate('/manage-study'); };

  return (
    <div className="max-w-5.5xl mx-auto px-0 pt-20 sm:pt-24 space-y-2 mb-8">
      <Banner className="mb-2 sm:mb-4" />

      <div className="p-4 sm:p-6 rounded-lg">
        <h1 className="text-lg sm:text-xl font-bold mt-1 mb-3 sm:mb-4">🎉 스터디가 등록되었습니다!</h1>
        <p className="text-sm sm:text-lg text-gray-600 ml-3 mb-6 sm:mb-6">스터디 아이디와 비밀번호를 팀원들에게 공유해보세요</p>

        <div style={{ marginBottom: '35px', overflow: 'hidden', borderRadius: '12px' }}>
          <table className="w-full border-4 border-[#8CC29E] bg-[#F7F9F2] border-separate rounded-lg text-sm sm:text-base" style={{ borderCollapse: 'separate', borderSpacing: '0', borderRadius: '12px' }} >
          <tbody>
            <tr>
              <td className="p-3 sm:p-4 w-1/3 sm:w-1/6 h-12 sm:h-16 border-2 border-[#8CC29E] text-center font-bold rounded-tl-lg whitespace-nowrap">스터디 아이디</td>
              <td className="p-3 sm:p-4 border-2 border-[#8CC29E] rounded-tr-lg">{studyDetails.groupInsertId}</td>
            </tr>
            <tr>
              <td className="p-3 sm:p-4 w-1/3 sm:w-1/6 h-12 sm:h-16 border-2 border-[#8CC29E] text-center font-bold whitespace-nowrap">스터디 명</td>
              <td className="p-3 sm:p-4 border-2 border-[#8CC29E]">{studyDetails.groupName}</td>
            </tr>
            <tr>
              <td className="p-3 sm:p-4 w-1/3 sm:w-1/6 h-12 sm:h-16 border-2 border-[#8CC29E] text-center font-bold whitespace-nowrap">주제</td>
              <td className="p-3 sm:p-4 border-2 border-[#8CC29E]">{studyDetails.subject}</td>
            </tr>
            <tr>
              <td className="p-3 sm:p-4 w-1/3 sm:w-1/6 h-12 sm:h-16 border-2 border-[#8CC29E] text-center font-bold whitespace-nowrap">스터디 인원</td>
              <td className="p-3 sm:p-4 border-2 border-[#8CC29E]">최대 {studyDetails.maxNum}명</td>
            </tr>
            <tr>
              <td className="p-3 sm:p-4 w-1/3 sm:w-1/6 h-12 sm:h-16 border-2 border-[#8CC29E] text-center font-bold whitespace-nowrap">스터디 기간</td>
              <td className="p-3 sm:p-4 border-2 border-[#8CC29E]">{studyDetails.period}</td>
            </tr>
            <tr>
              <td className="p-3 sm:p-4 w-1/3 sm:w-1/6 h-12 sm:h-16 border-2 border-[#8CC29E] text-center font-bold rounded-bl-lgw hitespace-nowrap">소통 수단</td>
              <td className="p-3 sm:p-4 border-2 border-[#8CC29E] rounded-br-lg">{studyDetails.communication}</td>
            </tr>
          </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-10 mt-2 sm:mt-4">
          <button onClick={handleConfirm} className="w-full sm:w-40 h-12 rounded-xl bg-[#91DDAB] text-white rounded-lg shadow-lg hover:bg-[#7BAE8D] focus:outline-none transition duration-300 text-sm sm:text-base">
            확인
          </button>
          <button onClick={handleGoToManagement} className="w-full sm:w-40 h-12 rounded-xl bg-[#EFF9F2] text-[#91DDAB] rounded-lg shadow-lg hover:bg-gray-200 focus:outline-none transition duration-300 text-sm sm:text-base">
            관리 페이지로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyCreationComplete;