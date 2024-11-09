import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/swithLogo.png';          
import accountIcon from '../assets/account_circle.png'; 
// import bellIcon from '../assets/bell.png'; 

const Header = () => {
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
            <Link to="/create-study" className="text-sm sm:text-base lg:text-lg hover:text-gray-100 mt-2">스터디 생성</Link>
            <Link to="/manage-study" className="text-sm sm:text-base lg:text-lg hover:text-gray-100 mt-2">스터디 관리</Link>
          </nav>
        </div>

        {/* 오른쪽: My Page 및 알람 버튼 */}
        <div className="flex space-x-4">
        <button className="login-button bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 flex items-center space-x-2">
        <img src={accountIcon} alt="" className="w-5 h-5" />
        <span className="text-sm sm:text-base lg:text-lg hidden-on-small">Login</span>
        </button>
        {/* <button className="flex items-center">
          <img src={bellIcon} alt="알람" className="w-6 h-6" />
        </button> */}
        </div>
        </header>
    );
  };
  
  export default Header;