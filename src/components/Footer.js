import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/swithLogo.png';

const Footer = ({ isLoggedIn, openDeleteAccountModal }) => {
  return (
    <footer className="bg-[#818E8B] text-white" style={{ height: '180px' }}> {/* footer 높이 */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center h-full p-12">
        <div className="flex items-center mb-3 sm:mb-16"> {/* 왼쪽, 아래쪽 마진 */}
          <img src={logo} alt="Switch Logo" className="h-12" />
        </div>
        <div className="text-center sm:text-left flex flex-col"> {/* 가운데, 세로 방향 정렬 */}
          <div className="flex items-center justify-cente sm:justify-between"> 
            <p className="mr-4 sm:mr-20 text-sm sm:text-base font-sans">CONTACT US</p> 
            <p className="text-sm sm:text-base font-sans">SoongsilUni@gmail.com</p> 
          </div>
          <Link to="/privacy-policy" className="mt-3 sm:mt-4 text-sm sm:text-base font-bold font-sans cursor-pointer">
            개인정보 처리 방침
          </Link>
          {isLoggedIn && (
            <button onClick={openDeleteAccountModal} className="mt-3 sm:mt-4 text-sm sm:text-base font-sans hover:underline focus:outline-none flex flex-col sm:flex-row items-center">
              회원 탈퇴
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

