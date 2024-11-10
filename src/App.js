import Modal from 'react-modal';
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CreateStudy from './pages/CreateStudy';
import ManageStudy from './pages/ManageStudy';
import Header from './components/Header';
import Footer from './components/Footer'; 
import LoginModal from './components/LoginModal';
import MyPageModal from './components/MyPageModal';
import LogoutConfirmationModal from './components/LogoutConfirmationModal';
import DeleteAccountModal from './components/DeleteAccountModal';
import AccountDeletedModal from './components/AccountDeletedModal';

Modal.setAppElement('#root');

const App = () => {

  const [isMyPageModalOpen, setIsMyPageModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const handleLogin = () => { setIsLoggedIn(true); closeLoginModalHandler(); };
  const handleLogout = () => { setIsLoggedIn(false); closeLogoutConfirmation(); closeMyPageModalHandler(); };
  const handleConfirmDelete = () => {
    // 탈퇴 처리를 위한 함수 호출 (API 호출 등)
    setIsDeleteAccountModalOpen(false);
    setIsLoggedIn(false); // 로그아웃 처리
    closeDeleteAccountModal(); // 탈퇴 모달 닫기
    openAccountDeletedModal(); // 탈퇴 완료 모달 열기
  };

  // Custom hook to check login status and redirect to login modal if not logged in
  const RequireLogin = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
      if (!isLoggedIn) {
        openLoginModalHandler();
      }
    }, [location]);

    return isLoggedIn ? children : <Navigate to="/" replace />;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header 
          openLoginModal={openLoginModalHandler} 
          isLoggedIn={isLoggedIn} 
          openMyPageModal={openMyPageModalHandler} 
          isMyPageModalOpen={isMyPageModalOpen}
          closeMyPageModal={closeMyPageModalHandler}
          openLogoutConfirmation={openLogoutConfirmation}
        />
        <main className="flex-grow overflow-hidden">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route 
              path="/create-study" 
              element={
                  <RequireLogin>
                    <CreateStudy />
                  </RequireLogin>
                }  
            />
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

        <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModalHandler} onLogin={handleLogin} />
        <MyPageModal isOpen={isMyPageModalOpen} onClose={closeMyPageModalHandler} onLogout={openLogoutConfirmation} />
        <LogoutConfirmationModal isOpen={isLogoutConfirmationOpen} onClose={closeLogoutConfirmation} onConfirmLogout={handleLogout} />
        <DeleteAccountModal isOpen={isDeleteAccountModalOpen} onClose={closeDeleteAccountModal} onConfirmDelete={handleConfirmDelete} />
        <AccountDeletedModal isOpen={isAccountDeletedModalOpen} onClose={closeAccountDeletedModal} />
        
      </div>
    </Router>
  );
};

export default App;