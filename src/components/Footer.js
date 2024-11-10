import React from 'react';
import logo from '../assets/swithLogo.png';

const Footer = ({ isLoggedIn, openDeleteAccountModal }) => {
  return (
    <footer
      className="bg-[#818E8B] text-white"
      style={{ height: '180px' }} // 푸터 높이 조정
    >
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center h-full p-12">
        <div className="flex items-center mb-3 sm:mb-16"> {/* 왼쪽 마진 및 아래쪽 마진 설정 */}
          <img src={logo} alt="Switch Logo" className="h-12" />
        </div>
        <div className="text-center sm:text-left flex flex-col"> {/* 가운데 정렬 및 세로 방향 정렬 */}
          <div className="flex items-center justify-cente sm:justify-between"> {/* CONTACT US와 이메일 같은 줄에 배치 */}
            <p className="mr-4 sm:mr-20 text-sm sm:text-base font-sans">CONTACT US</p> {/* 글씨 크기 조정 */}
            <p className="text-sm sm:text-base font-sans">SoongsilUni@gmail.com</p> {/* 이메일을 오른쪽에 배치 */}
          </div>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base font-bold font-sans">개인정보 처리 방침</p> {/* 글씨 크기 조정 */}
          {/*<p className="mt-3 sm:mt-4 text-sm sm:text-base font-sans">회원 탈퇴</p> 글씨 크기 조정 */}
          {isLoggedIn && (
            <button
              onClick={openDeleteAccountModal}
              className="mt-3 sm:mt-4 text-sm sm:text-base font-sans hover:underline focus:outline-none flex flex-col sm:flex-row items-center"
            >
              회원 탈퇴
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

