import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/BackGround.png';

const MainPage = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
      className="w-full h-full min-h-screen bg-cover bg-center text-white flex flex-col justify-between overflow-hidden "
    >  
    
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

        <Link to="/create-study" className="custom-button bg-white bg-opacity-90 text-black rounded-3xl hover:bg-opacity-100 hover:bg-gray-100 flex items-center justify-center max-w-full max-h-full" style={{
            fontSize: 'clamp(23px, 2vw, 33px)',
            width: 'clamp(200px, 25vw, 400px)', 
            height: 'clamp(90px, 10vw, 110px)',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
  }}>
          스터디 생성하기
        </Link>
        <Link to="/manage-study" className="custom-button bg-white bg-opacity-90 text-black rounded-3xl hover:bg-opacity-100 hover:bg-gray-100 flex items-center justify-center max-w-full max-h-full" style={{
            fontSize: 'clamp(23px, 2vw, 33px)',
            width: 'clamp(200px, 25vw, 400px)', 
            height: 'clamp(90px, 10vw, 110px)',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
  }}>
            스터디 관리하기
        </Link>
      </div>
    </div>
  );
};

export default MainPage;