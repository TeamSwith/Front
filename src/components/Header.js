import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/swithLogo.png';          
import accountIcon from '../assets/account_circle.png'; 
import bellIcon from '../assets/bell.png'; 
import MyPageModal from '../components/MyPageModal';
import AlarmModal from '../components/AlarmModal';
import alarmSSE from '../services/useAlarmSSE';
import { getUserInfo } from '../services/authService';

const Header = ({ 
  isLoggedIn,
  setIsLoggedIn,
  openLoginModal, 
  // openMyPageModal, 
  // isMyPageModalOpen, 
  // closeMyPageModal, 
  openCreateStudyModal, 
  openStudyManagementModal,
}) => {
  const navigate = useNavigate();

  const [isMyPageModalOpen, setIsMyPageModalOpen] = useState(false);  // 마이페이지 모달 상태
  const [userNickname, setUserNickname] = useState(null);  // 사용자 닉네임 상태
  const [userImage, setUserImage] = useState(null);  // 사용자 이미지 상태

  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false); // 알람 모달 상태
  const [alerts, setAlerts] = useState([]); // SSE 관련 알람 상태

  // 알람이 새로 들어오면 alerts 상태를 업데이트하는 함수
  const handleNewAlert = (newAlert) => {
    console.log('새로운 알람:', newAlert);  // 콘솔에 알림 출력
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
  };

  // 로그인된 상태일 때만 알람 SSE 연결
  useEffect(() => {
    if (!isLoggedIn) return;

    const token = localStorage.getItem('access_token');
    if (token) {
      const eventSource = alarmSSE(token, handleNewAlert);

      // 컴포넌트 언마운트 시 eventSource 닫기
      return () => {
        eventSource.close();
      };
    }
  }, [isLoggedIn]);

  // 로그인한 사용자 정보 가져오기
  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem('access_token');
      getUserInfo(token)  // getUserInfo API 호출
        .then(userData => {
          setUserNickname(userData.nickname);  // 사용자 닉네임
          setUserImage(userData.image);  // 사용자 이미지
        })
        .catch(error => {
          console.error('사용자 정보 가져오기 실패:', error);
        });
    }
  }, [isLoggedIn]);

  // 마이페이지 모달 열기
  const openMyPageModal = () => {
    setIsMyPageModalOpen(true);
  };

  // 마이페이지 모달 닫기
  const closeMyPageModal = () => {
    setIsMyPageModalOpen(false);
  };

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

  // 알람 모달 열기
  const openAlarmModal = () => {
    setIsAlarmModalOpen(true);
  };

  // 알람 모달 닫기
  const closeAlarmModal = () => {
    setIsAlarmModalOpen(false);
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

      <button onClick={openAlarmModal} className="flex items-center"> {/* 오른쪽: 알람 */}
        <img src={bellIcon} alt="알람" className="w-6 h-6" />
      </button>

      <MyPageModal isOpen={isMyPageModalOpen} onClose={closeMyPageModal} isLoggedIn={isLoggedIn} userNickname={userNickname} userImage={userImage} onLogout={() => setIsLoggedIn(false)} />
      <AlarmModal isOpen={isAlarmModalOpen} onClose={closeAlarmModal} isLoggedIn={isLoggedIn} alerts={alerts} />
      </div>
      </header>
  );
};
  
export default Header;