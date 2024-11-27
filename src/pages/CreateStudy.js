import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Banner from '../components/Banner'; // 배너 컴포넌트 임포트
import { getStudyId, updateStudyDetails } from '../services/studyService';

const CreateStudy = () => {
  const location = useLocation();
  const { password } = location.state || {};  // 모달에서 전달된 id와 groupPw

  // 비밀번호가 로컬에 저장된 경우 사용 가능하도록 설정
  const storedId = localStorage.getItem('id');
  const storedPassword = localStorage.getItem('groupPw');
  
  const [studyName, setStudyName] = useState('');
  const [isEditingStudyName, setIsEditingStudyName] = useState(false); // 입력 모드 상태
  const [studyId, setStudyId] = useState(''); // 스터디 아이디
  const [studyTopic, setStudyTopic] = useState(''); // 스터디 주제
  const [isEditingStudyTopic, setIsEditingStudyTopic] = useState(false); // 입력 모드 상태
  const [participants, setParticipants] = useState(1); // 스터디 인원
  const [studyPeriod, setStudyPeriod] = useState(''); // 스터디 기간
  const [communicationLink, setCommunicationLink] = useState(''); // 소통 수단
  const [isEditingStudyLink, setIsEditingStudyLink] = useState(false); // 입력 모드 상태

  const navigate = useNavigate();

  // 페이지가 로드되면 id를 통해 studyId를 받아옵니다.
  useEffect(() => {
    if (storedId) {
      getStudyId(storedId)  // id를 통해 studyId를 가져오는 API 호출
        .then((response) => {
          console.log('받아온 studyId:', response.data); // 받아온 데이터를 콘솔로 확인
          setStudyId(response.data);  // 응답 받은 studyId를 상태에 저장
        })
        .catch((error) => {
          console.error('스터디 ID 가져오기 실패:', error);
          alert('스터디 ID를 가져오는 데 실패했습니다.');
        });
    }
  }, [storedId]);  // id가 변경될 때마다 호출

  const handleParticipantChange = (action) => {
    setParticipants((prev) => (action === 'increment' ? prev + 1 : Math.max(prev - 1, 1))); // 최소 1명 유지
  };

  const handleUpdateStudyDetails = async () => {
    const studyData = {
      groupName: studyName || "",  // 입력되지 않으면 빈 문자열
      maxNum: participants || 0,  // 0으로 기본값 설정
      subject: studyTopic || "",  // 입력되지 않으면 빈 문자열
      period: studyPeriod || 0,  // 입력되지 않으면 0
      communication: communicationLink || "",  // 빈 문자열로 기본값 설정
    };

    try {
      // 스터디 정보를 업데이트하는 API 요청
      const response = await updateStudyDetails(storedId, studyData);

      // 응답 데이터로 로컬 스토리지 업데이트
      localStorage.setItem('groupName', response.data.groupName);
      localStorage.setItem('maxNum', response.data.maxNum);
      localStorage.setItem('subject', response.data.subject);
      localStorage.setItem('period', response.data.period);
      localStorage.setItem('communication', response.data.communication);

      // 생성 완료 페이지로 이동
      navigate('/study-creation-complete');
    } catch (error) {
      console.error('스터디 업데이트 실패:', error);
      alert('스터디 정보를 업데이트하는 데 실패했습니다.');
    }
  };

  // "취소" 버튼 클릭 시 로컬 스토리지에서 값 삭제
  const handleCancel = () => {
    localStorage.removeItem('groupInsertId');
    localStorage.removeItem('groupPw');
    navigate('/');  // 메인 페이지로 이동
  };

  return (
    <div className="max-w-5.5xl mx-auto px-0 pt-24 space-y-2 mb-8">
      
      <Banner className="mb-2 sm:mb-4" />
      
      <div className="p-4 sm:p-6 rounded-lg">
        <div className="flex justify-between items-center mt-2 sm:mt-1 mb-5 sm:mb-4">
          <h1 className="text-lg sm:text-xl font-bold">스터디 설정 및 정보 입력</h1>
        </div>

        <form className="space-y-2 sm:space-y-5">
          <div>
            {isEditingStudyName ? (
              <input
                type="text"
                value={studyName}
                onChange={(e) => setStudyName(e.target.value)}
                onBlur={() => setIsEditingStudyName(false)} // 입력 필드에서 벗어날 때 편집 모드 해제
                className="w-full p-2 rounded focus:outline-none text-lg sm:text-2xl" // 테두리 제거 및 포커스 스타일 제거
                placeholder="스터디 명을 입력하세요" // 수정된 플레이스홀더 텍스트
              />
            ) : (
              <p 
                className="w-full p-2 text-lg sm:text-2xl" 
                onClick={() => setIsEditingStudyName(true)} // 클릭 시 입력 모드로 변경
              >
                {studyName || "스터디 명을 입력하세요"} {/* 기본 텍스트 표시 */}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: '47px', overflow: 'hidden', borderRadius: '12px' }}> {/*Tailwind 적용안돼서 직접 여백 추가해줌*/}
            <table className="w-full border-4 border-[#8CC29E] bg-[#F7F9F2] border-separate rounded-lg text-sm sm:text-base" style={{ borderCollapse: 'separate', borderSpacing: '0', borderRadius: '12px' }} >
              <tbody>
                <tr>
                  <td className="p-3 sm:p-4 w-1/3 sm:w-1/6 h-12 sm:h-16 border-2 border-[#8CC29E] text-center font-bold whitespace-nowrap rounded-tl-lg">스터디 아이디</td>
                  <td className="p-3 sm:p-4 border-2 border-[#8CC29E] rounded-tr-lg">{studyId || ''}</td> {/* 자동으로 불러오는 아이디 표시 */}
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 w-1/3 sm:w-1/6 h-12 sm:h-16 border-2 border-[#8CC29E] text-center font-bold">주제</td>
                  <td className="p-3 sm:p-4 border-2 border-[#8CC29E]">
                    {isEditingStudyTopic ? (
                      <input
                        type="text"
                        value={studyTopic}
                        onChange={(e) => setStudyTopic(e.target.value)}
                        onBlur={() => setIsEditingStudyTopic(false)} // 입력 필드에서 벗어날 때 편집 모드 해제
                        className="w-full rounded focus:outline-none bg-[#F7F9F2]"
                        placeholder="스터디 주제를 입력해주세요"
                      />
                    ) : (
                      <p 
                        className="cursor-pointer"
                        onClick={() => setIsEditingStudyTopic(true)} // 클릭 시 입력 모드로 변경
                      >
                        {studyTopic || "스터디 주제를 입력해주세요"} {/* 기본 텍스트 표시 */}
                      </p>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 w-1/3 sm:w-1/6 h-12 sm:h-16 border-2 border-[#8CC29E] text-center font-bold">스터디 인원</td>
                  <td className="p-3 sm:p-4 h-12 sm:h-16 border-2 border-[#8CC29E] flex items-center">
                    <button type="button" onClick={() => handleParticipantChange('decrement')} className="p-1 w-6 sm:w-8 h-6 sm:h-8 border border-[#8CC29E] rounded-full text-center">-</button>
                    <span className="w-6 sm:w-8 text-center">{participants}</span>
                    <button type="button" onClick={() => handleParticipantChange('increment')} className="p-1 w-6 sm:w-8 h-6 sm:h-8 border border-[#8CC29E] rounded-full text-center">+</button>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 w-1/3 sm:w-1/6 border-2 border-[#8CC29E] text-center font-bold">스터디 기간</td>
                  <td className="p-3 sm:p-4 border-2 border-[#8CC29E]">
                    <div className="flex flex-wrap gap-2 sm:gap-5">
                      {['1개월', '3개월', '6개월', '1년', '미정'].map((period) => (
                        <button
                          key={period}
                          type="button"
                          onClick={() => setStudyPeriod(period)}
                          className={`w-16 sm:w-20 h-6 sm:h-8 rounded-full justify-center items-center sm:text-sm ${studyPeriod === period ? 'bg-[#7BAE8D]' : 'bg-[#8CC29E] text-white'}`} // 선택 시 색상 변경
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 w-1/3 sm:w-1/6 h-12 sm:h-16 border-2 border-[#8CC29E] text-center font-bold rounded-bl-lg">소통 수단</td>
                  <td className="p-3 sm:p-4 border-2 border-[#8CC29E] rounded-br-lg">
                    {isEditingStudyLink ? (
                      <input
                        type="text"
                        value={communicationLink}
                        onChange={(e) => setCommunicationLink(e.target.value)}
                        onBlur={() => setIsEditingStudyLink(false)} // 입력 필드에서 벗어날 때 편집 모드 해제
                        className="w-full rounded focus:outline-none bg-[#F7F9F2]"
                        placeholder="소통에 사용될 오픈 채팅 링크, 디스코드 링크 등을 입력해주세요"
                      />
                    ) : (
                      <p 
                        className="cursor-pointer"
                        onClick={() => setIsEditingStudyLink(true)} // 클릭 시 입력 모드로 변경
                      >
                        {communicationLink || "소통에 사용될 오픈 채팅 링크, 디스코드 링크 등을 입력해주세요"} {/* 기본 텍스트 표시 */}
                      </p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-10 mt-2 sm:mt-4"> {/* 버튼 간격 조정 */}
            <button
              type="button"
              onClick={handleUpdateStudyDetails}
              className="w-full sm:w-40 h-12 rounded-xl bg-[#91DDAB] text-white rounded-lg shadow-lg hover:bg-[#7BAE8D] focus:outline-none transition duration-300 text-sm sm:text-base"
            >
              생성 하기
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-40 h-12 rounded-xl bg-[#EFF9F2] text-[#91DDAB] rounded-lg shadow-lg hover:bg-gray-200 focus:outline-none transition duration-300 text-sm sm:text-base"
            >
              취소
            </button>
          </div>
        </form>
      </div>
  </div>
  );
};

export default CreateStudy;