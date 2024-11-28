import './App.css';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CreateStudy from './pages/CreateStudy';
import StudyCreationComplete from './pages/StudyCreationComplete';
import ManageStudy from './pages/ManageStudy';
import Header from './components/Header';
import Footer from './components/Footer'; 
import LoginModal from './components/LoginModal';
import MyPageModal from './components/MyPageModal';
import LogoutConfirmationModal from './components/LogoutConfirmationModal';
import DeleteAccountModal from './components/DeleteAccountModal';
import AccountDeletedModal from './components/AccountDeletedModal';
import LoginCallback from './pages/LoginCallback';
import { getUserInfo } from './services/authService';

Modal.setAppElement('#root');

const App = () => {

  const [isMyPageModalOpen, setIsMyPageModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [userEmail, setUserEmail] = useState(null); // 사용자 정보 다가져오는 거임
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [isAccountDeletedModalOpen, setIsAccountDeletedModalOpen] = useState(false);

  const openMyPageModalHandler = () => { setIsMyPageModalOpen(true); };
  const closeMyPageModalHandler = () => { setIsMyPageModalOpen(false); };
  const openLoginModalHandler = () => { setIsLoginModalOpen(true); };
  const closeLoginModalHandler = () => { setIsLoginModalOpen(false); };
  const openLogoutConfirmation = () => setIsLogoutConfirmationOpen(true);
  const closeLogoutConfirmation = () => setIsLogoutConfirmationOpen(false);
  const openDeleteAccountModal = () => { setIsDeleteAccountModalOpen(true); };
  const closeDeleteAccountModal = () => { setIsDeleteAccountModalOpen(false); };
  const openAccountDeletedModal = () => setIsAccountDeletedModalOpen(true);
  const closeAccountDeletedModal = () => setIsAccountDeletedModalOpen(false);

  // 컴포넌트가 마운트될 때 액세스 토큰을 확인하여 사용자 정보를 가져옴
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      setIsLoggedIn(true);
      // 사용자 정보를 가져오는 함수 호출
      getUserInfo()
        .then((userData) => {
          setUserEmail(userData.email); // 이메일 상태 업데이트
          localStorage.setItem('email', userData.email); // 로컬 스토리지에 저장
        })
        .catch(async (error) => {
          console.error('사용자 정보 가져오기 실패:', error)
          setIsLoggedIn(false); // 로그인 상태 false로 설정
        });
    } else {
      setIsLoggedIn(false); // 액세스 토큰 없으면 로그인 상태 false
    }
  }, [isLoggedIn]);  // 로그인 상태가 변경될 때마다 실행되도록 설정

  const handleLogout = () => {
    setIsLoggedIn(false);
    closeLogoutConfirmation();
    closeMyPageModalHandler();
    setUserEmail(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('nickname');
    localStorage.removeItem('userImage')
  };
  
  // 회원 탈퇴 핸들러
  const handleConfirmDelete = () => {
    setIsDeleteAccountModalOpen(false);
    setIsLoggedIn(false); // 로그아웃 처리
    closeDeleteAccountModal();
    openAccountDeletedModal();
  };

  // 로그인 필수 컴포넌트: 로그인되지 않으면 로그인 모달 열기
  const RequireLogin = ({ children }) => {
    const location = useLocation();
    useEffect(() => {
      if (!isLoggedIn) { openLoginModalHandler(); }
    }, [location]);
    return isLoggedIn ? children : <Navigate to="/" replace />;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header 
          openLoginModal={openLoginModalHandler} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}
          openMyPageModal={openMyPageModalHandler} isMyPageModalOpen={isMyPageModalOpen} closeMyPageModal={closeMyPageModalHandler}
          openLogoutConfirmation={openLogoutConfirmation}
        />
        <main className="flex-grow overflow-hidden">
          <Routes>
            <Route path="/" element={<MainPage isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} handleLogout={handleLogout} />} />
            <Route path="/local-callback" element={<LoginCallback />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route 
              path="/create-study" 
              element={
                  <RequireLogin>
                    <CreateStudy />
                  </RequireLogin>
                }  
            />
            <Route path="/study-creation-complete" element={<StudyCreationComplete />} />
            <Route 
              path="/manage-study" 
              element={
                  <RequireLogin>
                    <ManageStudy />
                  </RequireLogin>
                } 
            />
          </Routes>
        </main>
        <Footer isLoggedIn={isLoggedIn} openDeleteAccountModal={openDeleteAccountModal} /> 

        <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModalHandler} />
        <MyPageModal isOpen={isMyPageModalOpen} onClose={closeMyPageModalHandler} onLogout={openLogoutConfirmation} />
        <LogoutConfirmationModal isOpen={isLogoutConfirmationOpen} onClose={closeLogoutConfirmation} onConfirmLogout={handleLogout} />
        <DeleteAccountModal isOpen={isDeleteAccountModalOpen} onClose={closeDeleteAccountModal} onConfirmDelete={handleConfirmDelete} />
        <AccountDeletedModal isOpen={isAccountDeletedModalOpen} onClose={closeAccountDeletedModal} />
      </div>
    </Router>
  );
};

export default App;