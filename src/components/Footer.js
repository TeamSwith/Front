import React from 'react';
import logo from '../assets/swithLogo.png';

const Footer = () => {
  return (
    <footer
      className="bg-[#818E8B] text-white" 
      style={{ height: '180px' }} // 푸터 높이 조정
    >
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center ml-8 mb-16"> {/* 왼쪽 마진 및 아래쪽 마진 설정 */}
          <img src={logo} alt="Switch Logo" className="h-12" />
        </div>
        <div className="text-left mr-20 flex flex-col"> {/* 왼쪽 정렬 및 세로 방향 정렬 */}
          <div className="flex items-center"> {/* CONTACT US와 이메일 같은 줄에 배치 */}
            <p className="mr-20">CONTACT US</p> {/* 마진 추가 */}
            <p className="text-right">SoongsilUni@gmail.com</p> {/* 이메일을 오른쪽에 배치 */}
          </div>
          <p className="mt-4 font-bold">개인정보 처리 방침</p>
          <p className="mt-4">회원 탈퇴</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;