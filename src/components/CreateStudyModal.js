import React, { useState } from 'react';
import logo from '../assets/swithLogo.png';
import cancelIcon from '../assets/Cancel.png'
import EyeIcon from '../assets/Eye.png';
import EyeOffIcon from '../assets/Eyeoff.png';
import { createStudy } from '../services/studyService'; 

const CreateStudyModal = ({ isOpen, onClose, onCreate }) => {
  const [studyId, setStudyId] = useState(''); // 로컬 상태
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleCreateStudy = async () => {
    if (password === confirmPassword) {
      // 로컬 스토리지에 스터디 아이디와 비밀번호 저장
      localStorage.setItem('groupInsertId', studyId);
      localStorage.setItem('groupPw', password);

      // API 요청을 보내는 부분
      const studyData = {
        groupInsertId: studyId,
        groupPw: password,
        groupName: "", // 나중에 추가할 정보
        maxNum: 0, // 나중에 수정
        memberNum: 0, // 기본값 1
        subject: "", // 나중에 추가할 정보
        period: "", // 나중에 추가할 정보
        communication: "" // 나중에 추가할 정보
      };

      try {
        const response = await createStudy(studyData); // API 요청 보내기
        console.log('스터디 생성 응답:', response);
  
        // API 응답 데이터 로컬 스토리지에 저장
        localStorage.setItem('createdAt', response.data.createdAt);
        localStorage.setItem('updatedAt', response.data.updatedAt);
        localStorage.setItem('id', response.data.id);
        localStorage.setItem('groupInsertId', response.data.groupInsertId);
        localStorage.setItem('groupPw', response.data.groupPw);
        localStorage.setItem('groupName', response.data.groupName);
        localStorage.setItem('maxNum', response.data.maxNum);
        localStorage.setItem('memberNum', response.data.memberNum);  // 추가된 필드 저장
        localStorage.setItem('subject', response.data.subject);
        localStorage.setItem('period', response.data.period);
        localStorage.setItem('communication', response.data.communication);
        localStorage.setItem('notice', response.data.notice);
        localStorage.setItem('studies', JSON.stringify(response.data.studies)); // 여기에 스터디 일정이 저장됨
  
        // 성공 후 페이지 이동
        onCreate(studyId, password); // 필요한 값 넘기기
        onClose();  // 모달 닫기
  
      } catch (error) {
        console.error('스터디 생성 실패:', error);
        alert('스터디 생성에 실패했습니다.');
      }
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
        <div className="bg-white text-black rounded-lg p-8 md:p-12 w-11/12 max-w-md md:max-w-xl mx-auto relative text-center">
          <img src={cancelIcon} alt="닫기" onClick={onClose} className="absolute top-4 right-4 w-4 h-4 cursor-pointer" />
          <img src={logo} alt="Swith Logo" className="mx-auto h-12 md:h-16 mb-2 md:mb-4" />
          <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 whitespace-normal break-keep">새로운 스터디 생성하기</h2>
          <p className="text-sm md:text-base text-[#5B5B5B] mb-2 md:mb-4 whitespace-normal break-keep">스터디 관리를 시작하려면 아이디와 비밀번호를 설정하세요</p>
          <input
            type="text"
            placeholder="스터디 아이디"
            className="text-sm sm:text-base border border-green-400 w-11/12 p-2 sm:p-3 rounded-lg mb-4"
            value={studyId}
            onChange={(e) => setStudyId(e.target.value)}
          />
          <div className="relative mb-4">
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
          <div className="relative mb-6">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="비밀번호 확인"
              className="text-sm sm:text-base border border-green-400 w-11/12 p-2 sm:p-3 rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <img
              src={showConfirmPassword ? EyeOffIcon : EyeIcon}
              alt="toggle visibility"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-6 sm:right-8 top-2 sm:top-4 cursor-pointer"
              style={{ width: "20px", height: "20px" }}
            />
          </div>
          <button
            onClick={handleCreateStudy}
            className="bg-[#91DDAB] text-white w-28 h-12 rounded-xl shadow-lg hover:bg-[#7BAE8D]"
          >
            생성하기
          </button>
        </div>
      </div>
    )
  );
};

export default CreateStudyModal;
