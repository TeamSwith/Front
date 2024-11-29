import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import backgroundImage from '../assets/BackGround.png';
import Header from '../components/Header';
import LoginModal from '../components/LoginModal';
import MyPageModal from '../components/MyPageModal';
import LogoutConfirmationModal from '../components/LogoutConfirmationModal';
import CreateStudyModal from '../components/CreateStudyModal';
import StudyManagementModal from '../components/StudyManagementModal';
import JoinConfirmationModal from '../components/JoinConfirmationModal';
import { checkStudyJoin, joinStudy } from '../services/studyJoinService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const MainPage = ({ isLoggedIn, setIsLoggedIn, userEmail, handleLogout }) => {
  const [isCreateStudyModalOpen, setIsCreateStudyModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMyPageModalOpen, setIsMyPageModalOpen] = useState(false); // MyPage 모달 상태
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isStudyManagementModalOpen, setIsStudyManagementModalOpen] = useState(false); // Study Management 모달 상태

  const [isJoinConfirmationModalOpen, setIsJoinConfirmationModalOpen] = useState(false); // Join Confirmation 모달 상태
  const [groupId, setGroupId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation(); 

  // 페이지 이동 시, URL에서 'action' 파라미터를 확인하고, 해당하는 모달을 여는 코드
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search); 
    const action = queryParams.get('action'); // 'action' 파라미터 값 가져오기

    if (action === 'study-create') {
      setIsCreateStudyModalOpen(true); // 스터디 생성 모달 열기
    } else if (action === 'study-manage') {
      setIsStudyManagementModalOpen(true); // 스터디 관리 모달 열기
    }
  }, [location]); // location이 변경될 때마다 실행

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
//  const openLoginModal = () => setIsLoginModalOpen(true);
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

  // const handleLoginSuccess = () => {
  //   setIsLoggedIn(true); // 로그인 상태 업데이트
  //   closeLoginModal(); // 로그인 모달 닫기
  // };

  // const handleLogout = () => {
  //   setIsLoggedIn(false); 
  //   setUserEmail(null); 
  //   localStorage.removeItem('accessToken');
  //   localStorage.removeItem('refreshToken');
  //   localStorage.removeItem('email');
  //   closeLogoutConfirmation();
  // };

  const handleStudyCreation = (id) => {
    closeCreateStudyModal();
    navigate('/create-study', { state: { studyId: id } });
  };

  const handleJoinStudy = async (studyId, password) => {
    try {
      const response = await checkStudyJoin(studyId, password);
      console.log('응답:', response);

    if (response.data.code === 200 && response.data.data.message === "이미 가입되어 있음") {
      console.log('이미 가입되어 있음, 관리 페이지로 이동');

      // redirect URL 추출 (redirect: 뒤에 오는 부분을 URL로 변환)
      const redirectUrl = response.data.data.redirect.replace("redirect:", "").trim(); // "redirect:" 부분 제거
      const fullRedirectUrl = `${API_BASE_URL}/group/${redirectUrl}`;
      console.log('리디렉션 URL:', fullRedirectUrl);
      navigate(fullRedirectUrl);  // 해당 URL로 이동

    } else if (response.data.code === 200 && response.data.data.message === "가입 전") {
      console.log('가입 가능한 상태, 가입 확인 모달 띄우기');
      const groupId = response.data.data.groupId;
      setGroupId(groupId); // groupId 저장
      setIsJoinConfirmationModalOpen(true);
      console.log('groupId:', groupId);

    } else if (response.data.code === 404 && response.data.data.message === "정원을 초과했습니다." ) {
      console.log('정원 초과:', response.data.data.message);
      alert(response.data.data.message);

    } else {
      console.log('오류 발생');
    }
    } catch (error) {
      console.error('스터디 가입 오류:', error);
      alert('스터디 가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 모달에서 확인 버튼 클릭 시 호출될 함수 (스터디 가입 요청)
  const handleConfirmJoin = async () => {
    try {
      const joinResponse = await joinStudy(groupId);
      console.log(joinResponse);

      if (joinResponse.data.success) {
        console.log('스터디 가입 성공:', joinResponse.data.data.message);
        const redirectUrl = joinResponse.data.data.message.split(':')[1].trim();  // 'redirect:URL' 형식에서 URL을 추출
        navigate(redirectUrl);  // 관리 페이지로 리디렉션
      } else {
        console.log('스터디 가입 실패:', joinResponse.data.data.message);
        alert(joinResponse.data.data.message || '존재하지 않는 스터디입니다');
      }
    } catch (error) {
      console.error('스터디 가입 오류:', error);
      alert('스터디 가입에 실패했습니다. 다시 시도해주세요.');
    }
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
      userEmail={userEmail}  // 이메일 전달
      setIsLoggedIn={setIsLoggedIn} // 로그아웃 시 로그인 상태 업데이트 함수 전달
      handleLogout={handleLogout}
      openLoginModal={() => setIsLoginModalOpen(true)} // 로그인 모달 열기 함수 전달
      openCreateStudyModal={handleCreateStudyClick} // 스터디 생성 모달 핸들러 함수 전달
      openStudyManagementModal={handleManageStudyClick} // 스터디 관리 모달 핸들러 전달
      openMyPageModal={openMyPageModal} // Header에 MyPage 모달 열기 함수 전달
      isMyPageModalOpen={isMyPageModalOpen}
      closeMyPageModal={closeMyPageModal}
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

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <LogoutConfirmationModal isOpen={isLogoutModalOpen} onClose={closeLogoutConfirmation} onConfirmLogout={handleLogout} />
      <CreateStudyModal isOpen={isCreateStudyModalOpen} onClose={closeCreateStudyModal} onCreate={handleStudyCreation} />
      <MyPageModal isOpen={isMyPageModalOpen} onClose={closeMyPageModal} onLogout={openLogoutConfirmation} />
      <StudyManagementModal
        isOpen={isStudyManagementModalOpen}
        onClose={closeStudyManagementModal}
        onJoin={handleJoinStudy}
      />
      <JoinConfirmationModal
        isOpen={isJoinConfirmationModalOpen}
        onClose={closeJoinConfirmationModal}
        onConfirm={handleConfirmJoin}
      />
    </div>
  );
};

export default MainPage;