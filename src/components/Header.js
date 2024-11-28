import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/swithLogo.png';          
import accountIcon from '../assets/account_circle.png'; 
import bellIcon from '../assets/bell.png'; 
import MyPageModal from '../components/MyPageModal';

const Header = ({ 
  isLoggedIn,
  setIsLoggedIn,
  openLoginModal, 
  openMyPageModal, 
  isMyPageModalOpen, 
  closeMyPageModal, 
  openCreateStudyModal, 
  openStudyManagementModal,
}) => {
  const navigate = useNavigate();

  // 메인으로 이동해서 스터디 생성 모달, 로그인 안됐으면 로그인 모달
  const handleCreateStudyClick = () => {
      if (isLoggedIn) { navigate('/?action=study-create'); } 
      else { openLoginModal(); }
  };

  // 메인으로 이동해서 스터디 관리 모달, 로그인 안됐으면 로그인 모달
  const handleManageStudyClick = () => {
    if (isLoggedIn) { navigate('/?action=study-manage'); } 
    else { openLoginModal(); }
  };

  return (
      <header className="fixed top-0 left-0 w-full z-10 bg-[#8CC29E] text-white p-4 flex justify-between items-center px-4 sm:px-10">
      
      <div className="flex items-center space-x-4"> {/* 왼쪽: 로고 및 네비게이션 링크 */}
        <Link to="/" className="flex items-center"> {/* 로고 (메인 페이지로 이동) */}
          <img src={logo} alt="Swith Logo" className="h-8 sm:h-10 md:h-12 lg:h-10 xl:h-12 mr-2" />
        </Link>
        <nav className="flex space-x-4"> {/* 생성, 관리 네비게이션 */}
          <button onClick={handleCreateStudyClick} className="text-sm sm:text-base lg:text-lg hover:text-gray-100 mt-2 max-small-screen-text">
            스터디 생성
          </button>
          <button onClick={handleManageStudyClick} className="text-sm sm:text-base lg:text-lg hover:text-gray-100 mt-2 max-small-screen-text">
            스터디 관리
          </button>
        </nav>
      </div>

      <div className="flex space-x-4"> {/* 오른쪽: My Page 및 로그인 */}
      {isLoggedIn ? (
        <button onClick={openMyPageModal} className="login-button bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 flex items-center space-x-2">
          <img src={accountIcon} alt="" className="w-5 h-5" />
          <span className="text-sm sm:text-base lg:text-lg hidden-on-small">My Page</span>
        </button>
      ) : (
        <button onClick={openLoginModal} className="login-button bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 flex items-center space-x-2">
          <img src={accountIcon} alt="" className="w-5 h-5" />
          <span className="text-sm sm:text-base lg:text-lg hidden-on-small">Login</span>
        </button>
      )}

      <button className="flex items-center"> {/* 오른쪽: 알람 */}
        <img src={bellIcon} alt="알람" className="w-6 h-6" />
      </button>
        
      <MyPageModal isOpen={isMyPageModalOpen} onClose={closeMyPageModal} onLogout={() => setIsLoggedIn(false)} />
      </div>
      </header>
  );
};
  
export default Header;