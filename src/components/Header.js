import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/swithLogo.png';          
import accountIcon from '../assets/account_circle.png'; 
import bellIcon from '../assets/bell.png'; 
import MyPageModal from '../components/MyPageModal';

const Header = ({ 
  openLoginModal, 
  openCreateStudyModal, 
  openStudyManagementModal, // 스터디 관리 모달 열기 함수 추가
  isLoggedIn, 
  openMyPageModal, 
  isMyPageModalOpen, 
  closeMyPageModal, 
  openLogoutConfirmation, 
}) => {
    
  const handleCreateStudyClick = () => {
      if (isLoggedIn) {
        openCreateStudyModal(); // 로그인된 상태에서는 생성하기 모달
      } else {
        openLoginModal(); // 로그인되지 않은 상태에서는 로그인 모달
      }
    };

    const handleManageStudyClick = () => {
      if (isLoggedIn) {
        openStudyManagementModal(); // 로그인된 상태에서는 스터디 관리 모달
      } else {
        openLoginModal(); // 로그인되지 않은 상태에서는 로그인 모달
      }
    };

    return (
        <header className="fixed top-0 left-0 w-full z-10 bg-[#8CC29E] text-white p-4 flex justify-between items-center px-4 sm:px-10">
        {/* 왼쪽: 로고와 네비게이션 링크 */}
        <div className="flex items-center space-x-4">
          {/* 로고 (메인 페이지로 이동) */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Swith Logo" className="h-8 sm:h-10 md:h-12 lg:h-10 xl:h-12 mr-2" />
          </Link>

          {/* 네비게이션 링크 */}
          <nav className="flex space-x-4">
            <button
              onClick={handleCreateStudyClick} // 스터디 생성 버튼 클릭 이벤트
              className="text-sm sm:text-base lg:text-lg hover:text-gray-100 mt-2 max-small-screen-text"
            >
              스터디 생성
            </button>
            <button
              onClick={handleManageStudyClick} // 스터디 관리 버튼 클릭 이벤트
              className="text-sm sm:text-base lg:text-lg hover:text-gray-100 mt-2 max-small-screen-text"
            >
              스터디 관리
            </button>
            {/*<Link to="/create-study" className="text-sm sm:text-base lg:text-lg hover:text-gray-100 mt-2 max-small-screen-text">스터디 생성</Link>*/}
            {/*<Link to="/manage-study" className="text-sm sm:text-base lg:text-lg hover:text-gray-100 mt-2 max-small-screen-text">스터디 관리</Link>*/}
          </nav>
        </div>

        {/* 오른쪽: My Page 및 알람 버튼 */}
        <div className="flex space-x-4">
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

        <button className="flex items-center">
          <img src={bellIcon} alt="알람" className="w-6 h-6" />
        </button>
        
        <MyPageModal isOpen={isMyPageModalOpen} onClose={closeMyPageModal} onLogout={openLogoutConfirmation} />

        </div>
        </header>
    );
  };
  
  export default Header;