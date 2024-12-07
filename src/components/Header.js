import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/swithLogo.png';          
import accountIcon from '../assets/account_circle.png'; 
import bellIcon from '../assets/bell.png'; 
import MyPageModal from '../components/MyPageModal';
import LogoutConfirmationModal from '../components/LogoutConfirmationModal';
import { getUserInfo } from '../services/authService';
//mport { fetchUserId } from '../services/commentService';
import AlarmModal from '../components/AlarmModal';
//import useGetAlarm from '../services/alarmService';

const Header = ({ 
  isLoggedIn,
  setIsLoggedIn,
  openLoginModal, 
}) => {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]); // SSE 관련 알람 상태
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false); // 알람 모달 상태

  const [isMyPageModalOpen, setIsMyPageModalOpen] = useState(false);  // 마이페이지 모달 상태
  const [userNickname, setUserNickname] = useState(null);  // 사용자 닉네임 상태
  const [userImage, setUserImage] = useState(null);  // 사용자 이미지 상태
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);  // 로그아웃 확인 모달 상태
  const [userId, setUserId] = useState(null);

  useEffect(() => {  // 컴포넌트가 마운트될 때 액세스 토큰을 확인하여 사용자 정보를 가져옴
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      setIsLoggedIn(true);

      // 사용자 정보를 가져오는 함수 호출
      getUserInfo(accessToken)
        .then((userData) => {
          setUserNickname(userData.nickname); // 사용자 정보 이름 상태 변경
          setUserImage(userData.image); // 사용자 정보 이미지 상태 변경
          // console.log('사용자 이름', userData.nickname);
        })
        .catch(async (error) => {
          console.error('사용자 정보 가져오기 실패:', error)
          setIsLoggedIn(false); // 로그인 상태 false로 설정
        });

    } else {
      setIsLoggedIn(false); // 액세스 토큰 없으면 로그인 상태 false
    }
  }, [isLoggedIn]);  // 로그인 상태가 변경될 때마다 실행되도록 설정

  {/*
  useEffect(() => {
    const fetchAndSetUserId = async () => {
      try {
        const createUserId = await fetchUserId();
        setUserId(createUserId);
        //console.log('my user id:', myUserId);
      } catch (error) {
        console.error('Error fetching userId:', error);
      }
    };
    fetchAndSetUserId();
  }, []);
*/}
  //console.log('my user id Header:', userId);
  
{/*
  useEffect(() => {
    const updatedAlerts = {
      Alarm: [],
      'Attend update': [],
      Notice: [],
    };

    // 이벤트 배열 처리
    if (events.length > 0) {
      events.forEach(event => {
        if (event.type === 'Alarm') {
          console.log('알람:', event.content);
          updatedAlerts.Alarm.push(event);
        } else if (event.type === 'Attend update') {
          console.log('출석 상태:', event.attendStatus);
          updatedAlerts.Notice.push(event);
        } else if (event.type === 'Notice') {
          console.log('공지:', event.content);
          updatedAlerts['Attend update'].push(event);
        }
      });
      setAlerts(updatedAlerts);
    }
  }, [events]); // events 배열이 변경될 때마다 실행
*/}
  //const fetchedAlerts = useGetAlarm(); // 기존 알림 목록을 API로 가져오기
{/*
  // 알람 수신 처리
  useEffect(() => {
    if (isLoggedIn && events.length > 0) {
      console.log('로그인 상태에서 알림 수신 대기 중...');
      events.forEach((event) => {
        const { id, content, createdAt, groupId } = event;
        // 중복 알림 방지
        if (!alerts.some(alert => alert.id === id)) {
          setAlerts(prevAlerts => [...prevAlerts, { id, content, createdAt, groupId }]);
        }
      });
    } else {
      console.log('로그인하지 않음, 알림 수신 중지');
      setAlerts([]); // 로그아웃 시 알람 초기화
    }
  }, [events, isLoggedIn]); // events가 업데이트 될 때마다 실행

  // 기존 알림 목록을 가져오기
  useEffect(() => {
    if (isLoggedIn && fetchedAlerts && fetchedAlerts.length > 0) {
      console.log('기존 알림 목록:', fetchedAlerts);
      setAlerts(fetchedAlerts); // 알림 목록 상태 업데이트
    }
  }, [isLoggedIn, fetchedAlerts]);
*/}

  // 마이페이지 모달 열기
  const openMyPageModal = () => {
    setIsMyPageModalOpen(true);
  };

  // 마이페이지 모달 닫기
  const closeMyPageModal = () => {
    setIsMyPageModalOpen(false);
  };

  // 로그아웃 확인 모달 열고 닫기
  const openLogoutConfirmation = () => setIsLogoutConfirmationOpen(true);
  const closeLogoutConfirmation = () => setIsLogoutConfirmationOpen(false);

  // 로그아웃 후 처리
  const handleLogout = () => {
    setIsLoggedIn(false);
    closeLogoutConfirmation();
    closeMyPageModal();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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

      <MyPageModal isOpen={isMyPageModalOpen} onClose={closeMyPageModal} isLoggedIn={isLoggedIn} userNickname={userNickname} userImage={userImage} onLogout={handleLogout} openLogoutConfirmation={openLogoutConfirmation} />
      <LogoutConfirmationModal isOpen={isLogoutConfirmationOpen} onClose={closeLogoutConfirmation} onLogout={handleLogout} />
      <AlarmModal isOpen={isAlarmModalOpen} onClose={closeAlarmModal} isLoggedIn={isLoggedIn} alerts={alerts} />
      </div>
      </header>
  );
};
  
export default Header;