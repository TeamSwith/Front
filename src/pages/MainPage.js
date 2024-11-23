import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/BackGround.png';
import Header from '../components/Header';
import LoginModal from '../components/LoginModal';
import MyPageModal from '../components/MyPageModal';
import LogoutConfirmationModal from '../components/LogoutConfirmationModal';
import CreateStudyModal from '../components/CreateStudyModal';
import StudyManagementModal from '../components/StudyManagementModal';
import JoinConfirmationModal from '../components/JoinConfirmationModal';


const MainPage = () => {
  const [isCreateStudyModalOpen, setIsCreateStudyModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMyPageModalOpen, setIsMyPageModalOpen] = useState(false); // MyPage 모달 상태
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isStudyManagementModalOpen, setIsStudyManagementModalOpen] = useState(false); // Study Management 모달 상태
  const [isJoinConfirmationModalOpen, setIsJoinConfirmationModalOpen] = useState(false); // Join Confirmation 모달 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태

  const navigate = useNavigate();

  const handleCreateStudyClick = () => {
    if (isLoggedIn) {
      setIsCreateStudyModalOpen(true); // 로그인 상태일 때만 생성하기 모달 열기
    } else {
      setIsLoginModalOpen(true); // 비로그인 상태에서는 로그인 모달 열기
    }
  };

  const handleManageStudyClick = () => {
    if (isLoggedIn) {
      setIsStudyManagementModalOpen(true); // 로그인 상태일 때만 스터디 관리 모달 열기
    } else {
      setIsLoginModalOpen(true); // 비로그인 상태에서는 로그인 모달 열기
    }
  };

  const closeCreateStudyModal = () => setIsCreateStudyModalOpen(false);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openMyPageModal = () => setIsMyPageModalOpen(true); // MyPage 모달 열기 함수
  const closeMyPageModal = () => setIsMyPageModalOpen(false); // MyPage 모달 닫기 함수
  const closeLogoutConfirmation = () => setIsLogoutModalOpen(false);
  const closeStudyManagementModal = () => setIsStudyManagementModalOpen(false);
  const closeJoinConfirmationModal = () => setIsJoinConfirmationModalOpen(false);

  const openLogoutConfirmation = () => {
    setIsMyPageModalOpen(false); // 로그아웃 모달을 열 때 MyPage 모달을 닫음
    setIsLogoutModalOpen(true); // 로그아웃 모달 열기
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // 로그인 상태 업데이트
    closeLoginModal(); // 로그인 모달 닫기
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // 로그아웃 후 로그인 상태 해제
    closeLogoutConfirmation();
  };

  const handleStudyCreation = (id) => {
    closeCreateStudyModal();
    navigate('/create-study', { state: { studyId: id } });
  };

  const handleJoinStudy = () => {
    setIsStudyManagementModalOpen(false);
    setIsJoinConfirmationModalOpen(true);
  };

  const confirmJoinStudy = () => {
    // 실제로 스터디에 가입하는 로직 추가
    setIsJoinConfirmationModalOpen(false);
    navigate('/manage-study'); // 가입 확인 후 관리 페이지로 이동
  };
  
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
      className="w-full h-full min-h-screen bg-cover bg-center text-white flex flex-col justify-between overflow-hidden "
    >  
    
    <Header 
      isLoggedIn={isLoggedIn} 
      openLoginModal={openLoginModal} // 로그인 모달 열기 함수 전달
      openCreateStudyModal={handleCreateStudyClick} // 스터디 생성 모달 핸들러 함수 전달
      openStudyManagementModal={handleManageStudyClick} // 스터디 관리 모달 핸들러 전달
      openMyPageModal={openMyPageModal} // Header에 MyPage 모달 열기 함수 전달
      openLogoutConfirmation={openLogoutConfirmation}
    />

    <div className="pt-[250px] sm:pt-[250px] md:pt-[300px] lg:pt-[330px] pt-mobile text-left 
                    pl-10 sm:pl-16 md:pl-20 lg:pl-[10vw] xl:pl-[150px] pl-5-mobile" 
    >
        <h1 className="mb-4 small-screen-text" style={{ fontSize: 'clamp(1.6rem, 4vw, 3.3rem)' }}>여러분의 스터디를 직접 만들고,<br />함께 성장하세요.</h1>
        <p className="mb-2" style={{ fontSize: 'clamp(18px, 2vw, 28px)' }}>스터디 생성하기</p>
        <p className="mb-8 text-[#D6D6D6]" style={{ fontSize: 'clamp(10px, 1.5vw, 16px)' }}>스터디를 생성하면, 자동으로 관리 페이지가 제공됩니다. <br />
        주제, 시간, 장소 등을 설정하고, 공지사항, 출석 체크, 과제 관리 등 <br />
        다양한 기능을 통해 체계적으로 스터디를 운영할 수 있습니다. </p>
        <p className="text-xl mb-2">스터디 관리하기</p>
        <p className="mb-8 text-[#D6D6D6]" style={{ fontSize: 'clamp(10px, 1.5vw, 16px)' }}>참여 중인 스터디의 일정, 출석, 공지사항 등을 실시간으로 관리하세요. <br />
        한눈에 확인하고, 자동으로 업데이트되는 정보를 통해  <br />
        스터디를 효율적으로 운영할 수 있습니다. </p>
      </div>

      <div className="absolute bottom-0 right-0 flex flex-col items-end space-y-7 pb-20 z-20 button-container px-margin"
        style={{
          paddingRight: 'clamp(50px, 10vw, 150px)',
        }}>
        <button
          onClick={handleCreateStudyClick}
          className="custom-button bg-white bg-opacity-90 text-black rounded-3xl hover:bg-opacity-100 hover:bg-gray-100 flex items-center justify-center max-w-full max-h-full"
          style={{
            fontSize: 'clamp(23px, 2vw, 33px)',
            width: 'clamp(200px, 25vw, 400px)', 
            height: 'clamp(90px, 10vw, 110px)',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
          }}
        >
          스터디 생성하기
        </button>
        <button
          onClick={handleManageStudyClick}  // 여기에 함수 연결
          className="custom-button bg-white bg-opacity-90 text-black rounded-3xl hover:bg-opacity-100 hover:bg-gray-100 flex items-center justify-center max-w-full max-h-full"
          style={{
            fontSize: 'clamp(23px, 2vw, 33px)',
            width: 'clamp(200px, 25vw, 400px)', 
            height: 'clamp(90px, 10vw, 110px)',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
          }}
        >
          스터디 관리하기
      </button>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onLogin={handleLoginSuccess} />
      <LogoutConfirmationModal isOpen={isLogoutModalOpen} onClose={closeLogoutConfirmation} onLogout={handleLogout} />
      <CreateStudyModal isOpen={isCreateStudyModalOpen} onClose={closeCreateStudyModal} onCreate={handleStudyCreation} />
      <MyPageModal isOpen={isMyPageModalOpen} onClose={closeMyPageModal} onLogout={openLogoutConfirmation} />
      <StudyManagementModal isOpen={isStudyManagementModalOpen} onClose={closeStudyManagementModal} onJoin={handleJoinStudy} />
      <JoinConfirmationModal isOpen={isJoinConfirmationModalOpen} onClose={closeJoinConfirmationModal} onConfirm={confirmJoinStudy} />
    </div>
  );
};

export default MainPage;