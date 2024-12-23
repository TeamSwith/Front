import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { fetchSchedule, getMemNum, deleteSchedule, fetchGroupUsers, updateAttendStatus } from '../api/Study';
import { fetchNotice, updateNotice } from '../api/Notice';
import { fetchTasks, deleteTask } from '../api/Task';
import { getStudyDetails } from '../services/studyService';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import ManageSidebar from "../components/ManageSidebar";
import CreateSidebar from "../components/CreateSIdebar";
import EditSidebar from '../components/EditSIdebar';
import speakerIcon from "../assets/speaker.png";
import editIcon from "../assets/edit.png";
import checkIcon from "../assets/Check.png"
import personIcon from "../assets/person.png";
import alarmCheckIcon from "../assets/AlarmCheck.png";
import '../styles/ManageStudy.css';
import useSubscribeSSE from '../services/useSubscribeSSE';
import { useUserId } from '../context/UserContext';
import { fetchAttendanceStatus } from '../api/Attendance'; // 출석 상태 API import
import AttendanceTimer from '../components/AttendanceTimer'; // 파일 경로에 맞게 수정

const ManageStudy = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const location = useLocation();
  const queryClient = useQueryClient();
  const marqueeTextRef = useRef(null);
  const marqueeContainerRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newNotice, setNewNotice] = useState('');
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [datesWithSchedules, setDatesWithSchedules] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const [userInfo, setUserInfo] = useState([]); // 스터디원 정보
  const [studyDetails, setStudyDetails] = useState(null); // 스터디 세부 정보
  const [selectedDate, setSelectedDate] = useState(new Date());  //calander 날짜 선택
  const [scheduleData, setScheduleData] = useState({time: '', location: ''});
  const { id } = location.state || {};
  const [studyId, setStudyId] = useState(null);
  const [activeButton, setActiveButton] = useState(false); // 버튼 활성화 여부
  const [buttonTimer, setButtonTimer] = useState(null); // 버튼 타이머
  //const [groupId, setGroupId] = useState(null); // 그룹 아이디 추가
  const userId = useUserId();
  const [alerts, setAlerts] = useState([]); // SSE 관련 알람 상태
  const prevAlarmEventsRef = useRef([]);
  const [alarmStudyDetails, setAlarmStudyDetails] = useState(null);
  const [newAlarmGroup, setNewAlarmgroup] = useState(null);
  const [newAlarm, setNewAlarm] = useState(null);
  const [attendanceStatusMap, setAttendanceStatusMap] = useState({}); // 출석 상태 저장



  const { alarmEvents, attendanceEvents, noticeEvents } = useSubscribeSSE(userId);

  //console.log('event:', events);

  // 스터디 세부 정보 불러오기
  useEffect(() => {
    if (id) {
      getStudyDetails(id)
        .then((response) => {
          console.log('스터디 정보:', response.data);
          setStudyDetails(response.data); // groupName만 상태에 저장
        })
        .catch((error) => { console.error('스터디 정보 가져오기 실패:', error); });
    }
  }, []);

  // 스터디원 정보 불러오기
  useEffect(() => {
    if (id) {
      fetchGroupUsers(id)
        .then((response) => {
          console.log('스터디원 정보:', response.data);
          setUserInfo(response.data); // groupName만 상태에 저장
        })
        .catch((error) => { console.error('스터디 정보 가져오기 실패:', error); });
    }
  }, []);



  // 출석 상태 조회 함수
  const fetchAttendanceStatus = async (groupId, studyId) => {
    if (!groupId || !studyId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/group/${groupId}/study/${studyId}/attendStatus`);
      const data = await response.json();

      if (data.success) {
        const statusMap = data.data.reduce((map, status) => {
          map[status.userId] = status.attendStatus; // userId를 키로, attendStatus를 값으로 매핑
          return map;
        }, {});
        setAttendanceStatusMap(statusMap); // 상태 업데이트
      } else {
        console.error('출석 상태 조회 실패:', data);
      }
    } catch (error) {
      console.error('출석 상태 조회 중 오류 발생:', error);
    }
  };

  // 캘린더에서 날짜 선택하면 일정을 불러오는 함수
  const handleDateChange = useCallback(
    async (date) => {
      const formattedDate = date.toLocaleDateString('en-CA');
  
      try {
        // 스터디 일정 호출
        const response = await fetchSchedule(id, formattedDate);
  
        if (response.success && response.data?.id) {
          setScheduleData(response.data); 
          const currentStudyId = response.data.id; // 새로운 studyId 설정
          setStudyId(currentStudyId);

          // 출석 상태 호출
          await fetchAttendanceStatus(id, currentStudyId);


          // 과제 호출
          const taskResponse = await fetchTasks(id, currentStudyId);
          setTasks(taskResponse.map(task => ({
          id: task.id,
          label: task.content,
          checked: task.taskStatus === 'COMPLETED', // 상태 기반으로 체크 여부 설정
          
        })));

        setDatesWithSchedules((prevDates) => [...prevDates, formattedDate]);

        } else {
          setScheduleData({ date: formattedDate, time: '', location: '' });
          setStudyId(null);
          setTasks([]);
          setAttendanceStatusMap({}); // 출석 상태 초기화
        }
      } catch (error) {
        console.error('스터디 데이터를 불러오는 중 오류 발생:', error);
      }
    },
    [id] // 의존성 배열에 필요한 값 추가
  );


  // 출석 상태 표시
  const renderAttendanceStatus = () => {
    if (userInfo.length === 0) {
      return <p className="text-[#999] text-[12px]">스터디원이 없습니다.</p>;
    }

    return userInfo.map((user) => (
      <div key={user.id} className="flex-shrink-0 text-center">
        <img
          src={user.image}
          alt={user.nickname}
          className={`w-11 h-11 rounded-full border object-cover ${
            attendanceStatusMap[user.id] === 'ATTEND'
              ? 'border-[#12921E] border-4' // 출석한 사용자
              : 'border-[#ccc]' // 출석하지 않은 사용자
          }`}
        />
      </div>
    ));
  };


  useEffect(() => {
    handleDateChange(selectedDate); // selectedDate가 변경될 때 데이터 업데이트
  }, [selectedDate]);

  // 날짜를 선택할 경우 실행되는 함수
  const onDateChange = (date) => {
    setSelectedDate(date);
    handleDateChange(date); // 날짜 변경 시 스케줄 데이터 업데이트
  };

  // 멤버 수 불러오기
  const { data: MemNumData } = useQuery(
    {
      queryKey: [id, 'MemNum'],
      queryFn: () => getMemNum(id),
      staleTime: 1000 * 60 * 5,
    }
  );

   // 출석 상태 업데이트 함수
   const updateAttendStatusHandler = async () => {
    try {
      const response = await updateAttendStatus(id, studyId);

      if (response.success) {
        alert('출석 완료했습니다!');
        setActiveButton(false); // 5분 후 버튼 비활성화
      } else {
        alert('이미 출석하셨습니다.');
      }
    } catch (error) {
      console.error('출석 상태 업데이트 중 오류 발생:', error);
      alert('이미 출석하셨습니다.');
    }
  };

  // 출석 버튼 활성화 시간 계산
  useEffect(() => {
    const currentTime = new Date();
    const scheduleTime = new Date(scheduleData.date + ' ' + scheduleData.time);

    if (currentTime >= scheduleTime) {
      setActiveButton(true);
      const timer = setTimeout(() => {
        setActiveButton(false);
      }, 5 * 60 * 1000); // 5분 후 비활성화

      setButtonTimer(timer);
    } else {
      setActiveButton(false);
    }

    return () => clearTimeout(buttonTimer); // 컴포넌트 unmount 시 타이머 정리
  }, [scheduleData]);

 // 출석하기 버튼 컴포넌트
 const renderAttendanceButton = () => {
  if (!scheduleData.time || !scheduleData.location) return null; // 일정이 없으면 렌더링하지 않음

  const userAttendStatus = attendanceStatusMap[userId]; // 현재 사용자 출석 상태 확인
  const currentTime = new Date();
  const scheduleTime = new Date(`${scheduleData.date} ${scheduleData.time}`);
  const isWithin5Minutes =
    currentTime >= scheduleTime && currentTime <= new Date(scheduleTime.getTime() + 5 * 60 * 1000); // 시작 시간 후 5분 내

  const isDisabled =
    userAttendStatus === 'ATTEND' || // 이미 출석한 경우
    currentTime < scheduleTime || // 시작 시간 이전인 경우
    !isWithin5Minutes; // 시작 시간 후 5분이 지난 경우

  return (
    <div
      className={`bg-[#8CC29E] w-full max-w-[320px] h-[40px] mt-4 rounded-lg shadow-lg flex items-center justify-center ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={!isDisabled ? updateAttendStatusHandler : undefined} // 비활성화 시 클릭 이벤트 제거
    >
      <span className="text-[14px] text-white">
        {userAttendStatus === 'ATTEND'
          ? '출석 완료'
          : currentTime > scheduleTime && !isWithin5Minutes && userAttendStatus !== 'ATTEND'
          ? '결석'
          : '출석하기'}
      </span>
    </div>
  );
};

// 출석 상태 처리 로직 수정
useEffect(() => {
  if (attendanceEvents.length > 0) {
    attendanceEvents.forEach((event) => {
      const { userId: eventUserId, attendStatus } = event;
      setAttendanceStatusMap((prevMap) => ({
        ...prevMap,
        [eventUserId]: attendStatus,
      }));
    });
  }
}, [attendanceEvents]);

  // 스터디 일정 생성시 data가 바로 업데이트
  const handleCreateScheduleSuccess = (createdData) => {
    setScheduleData(createdData); // 생성된 데이터로 업데이트
    setStudyId(createdData.id); // 생성된 studyId 업데이트
  };

  //스터디 일정 삭제
  const handleDeleteSchedule = async () => {
    if (!id || !studyId) {
      alert('삭제할 스터디 정보가 없습니다.');
      return;
    }

    const confirmDelete = window.confirm('정말 이 스터디 일정을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      // 먼저 과제부터 삭제
      // 해당 스터디 일정에 존재하는 과제들을 가져옴
      const taskResponse = await fetchTasks(id, studyId);
      const tasksToDelete = taskResponse.map(task => task.id);

      // 과제들 삭제
      for (let taskId of tasksToDelete) {
        try {
          await deleteTask(id, studyId, taskId); // 과제 삭제
        } catch (error) {
          console.error(`과제 ${taskId} 삭제 실패:`, error);
        }
      }
      await deleteSchedule(id, studyId); // API 호출
      alert('스터디 일정이 성공적으로 삭제되었습니다.');

      // 삭제 후 상태 초기화 및 React Query 캐시 무효화
      setScheduleData((prevData) => ({
        ...prevData,
        time: '',
        location: '',
      }));
      setStudyId(null);

      const updatedDate = new Date(selectedDate); // 현재 selectedDate 복사
      updatedDate.setDate(updatedDate.getDate()); // 하루를 더하여 날짜 변경
      setSelectedDate(updatedDate); // selectedDate 변경으로 useEffect 재실행

      //queryClient.invalidateQueries(['fetchSchedulesForMonth', selectedYear, selectedMonth]);
      const year = updatedDate.getFullYear();
      const month = updatedDate.getMonth() + 1;
      fetchSchedulesForMonth(year, month);


        queryClient.invalidateQueries(['schedule', id]);
      } catch (error) {
        console.error('스터디 일정 삭제 실패:', error);
        alert('스터디 일정 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    };

    // 스터디 생성 알람
  useEffect(() => {
    if (alarmEvents.length > prevAlarmEventsRef.current.length) {
      const latestAlarm = alarmEvents[alarmEvents.length - 1];
      setNewAlarmgroup(latestAlarm.groupId);
      if (latestAlarm) {
        setShowPopup(true);
        console.log('새로운 알림:', latestAlarm.content);

        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
      }
    }

    // 현재 alarmEvents를 prevAlarmEventsRef에 저장
    prevAlarmEventsRef.current = alarmEvents;

  }, [alarmEvents]);
  //console.log("newAlarmGroup", newAlarmGroup);

  //알람 스터디 이름 가져오기
  useEffect(() => {
    if (newAlarmGroup) {
      getStudyDetails(newAlarmGroup)
        .then((response) => {
          console.log('알람 스터디!:', response.data);
          const groupName = response.data.groupName;
          setNewAlarm(groupName);
          
          console.log("studyDetails", newAlarm);
        })
        .catch((error) => { console.error('스터디 정보 가져오기 실패:', error); });
    }
  }, [newAlarmGroup]);
  //console.log("studyDetails", newAlarm);
  
  useEffect(() => {
    if (newAlarm) {
      //console.log("업데이트된 studyDetails:", newAlarm);
    }
  }, [newAlarm]);

  const fetchSchedulesForMonth = async (year, month) => {
    try {
      // API 호출 후 응답을 JSON으로 변환
      const response = await fetch(`${API_BASE_URL}/group/${id}/study?year=${year}&month=${month}`);
      const data = await response.json(); // 응답을 JSON으로 변환
  
      if (data.success) {
        return data.data.dayList; // dayList만 반환
      } else {
        console.error("일정을 불러오는 데 실패했습니다.");
        return [];
      }
    } catch (error) {
      console.error('일정을 불러오는 중 오류 발생:', error);
      return [];
    }
  };

  const onMonthChange = (date) => {
    setSelectedDate(date); // 새로운 달로 변경
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해줌
    fetchSchedulesForMonth(year, month); // 해당 월의 일정 데이터 불러오기
  };
  
  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해줌
  
    const loadSchedules = async () => {
      const dayList = await fetchSchedulesForMonth(year, month); // API에서 데이터 받아옴
      const formattedDates = dayList.map(day => {
        const date = new Date(year, month - 1, day); // 날짜 객체 생성
        return date.toLocaleDateString('en-CA'); // YYYY-MM-DD 형식으로 변환
      });
      setDatesWithSchedules(formattedDates); // 상태 업데이트
    };
    loadSchedules(); // 일정 데이터 불러오기
  }, [selectedDate]); // selectedDate가 변경될 때마다 실행

  //Notice
  const { data: noticeData, isLoading: isNoticeLoading, isError: isNoticeError } = useQuery(
    {
      queryKey: [id, 'notice'],
      queryFn: () => fetchNotice(id),
      staleTime: 1000 * 60 * 5,
    }
  );

  const [realTimeNotice, setRealTimeNotice] = useState(noticeData?.data?.notice || '');

  //update Notice
  const { mutate: updateNoticeMutation } = useMutation({
    mutationFn: ({ id, notice }) => updateNotice(id, notice), // updateNotice 호출
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [id, 'notice'] }); // 캐시 무효화
    },
  });

  const handleEditNoticeClick = () => {
    setIsEditingNotice(true);
    setNewNotice(noticeData?.data?.content || '');
  };

  const handleSaveNotice = () => {
    updateNoticeMutation({ id, notice: newNotice }); // `id`와 `notice`를 전달
    setIsEditingNotice(false); // 수정 모드 종료
    setRealTimeNotice(newNotice);
  };

  // 공지사항 실시간 업데이트
  useEffect(() => {
    if (noticeEvents.length > 0) {
      const latestNotice = noticeEvents[noticeEvents.length - 1]; // 가장 최근 공지사항
      if (!isEditingNotice) {
        setRealTimeNotice(latestNotice.content); // 실시간 공지사항 업데이트
      }
    }
  }, [noticeEvents, isEditingNotice]);
  
  //공지사항 애니메이션
  useEffect(() => {
    if (marqueeTextRef.current && marqueeContainerRef.current && noticeData?.data) {
      setIsOverflowing(
        marqueeTextRef.current.scrollWidth > marqueeContainerRef.current.clientWidth
      );
    }
  }, [noticeData, marqueeTextRef, marqueeContainerRef]);

  if (isNoticeLoading) return <div>Loading...</div>;
  if (isNoticeError) return <div>공지사항을 불러오는 중 오류가 발생했습니다.</div>;

  if (!studyDetails) { return <div>Loading...</div>; }

  return (
    <div className="overflow-x-auto"> {/* 가로 스크롤 활성화 */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-start justify-center z-50">
        <div className="w-[1000px] p-4 mt-[85px] bg-white bg-opacity-80 shadow-lg flex justify-center rounded-lg border border-gray-100 border-lg">
        <img src={alarmCheckIcon} alt="alarm Icon" className="w-7 h-7 mr-3 ml-4" />
          <p className="mt-1 text-lg text-center text-black">{newAlarm}의 스터디 일정이 생성되었습니다!</p>
        </div>
      </div>
      )}
    <div className="sm:px-12 md:px-20 lg:px-30 xl:px-[300px] px-[30px] py-[90px] pb-[200px]">
      {/*반응형에서 패딩 손봐야함*/}
      <div className="w-full bg-[#F2F2F2] text-[#4B4B4B] text-[14px] py-2 mb-4 flex items-center justify-between rounded-2xl overflow-hidden relative">
        <div className="flex items-center w-full">
          <img src={speakerIcon} alt="Speaker Icon" className="w-8 h-8 mr-3 ml-4" />
          <div className="marquee-container mr-12" ref={marqueeContainerRef}>

            {isEditingNotice ? (
              <textarea
              className="flex item-center bg-transparent border-none rounded w-full h-6 resize-none"
              value={newNotice}
              onChange={(e) => setNewNotice(e.target.value)}
              placeholder="공지사항을 입력하세요"
            />
            ) : (
              <span
                className={`marquee-text ${isOverflowing ? 'animate-marquee' : ''}`}
                ref={marqueeTextRef}
              >
                {realTimeNotice || noticeData?.data?.notice || '공지사항이 없습니다.'}
              </span>
            )}
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {isEditingNotice ? (
              <img src={checkIcon} alt="Check Icon" className="w-5 h-5 cursor-pointer" 
              onClick={handleSaveNotice}/>
            ) : (
              <img src={editIcon} alt="Edit Icon" className="w-5 h-5 cursor-pointer w-[20px]" 
              onClick={handleEditNoticeClick}/>
            )}
          </div>
        </div>
      </div>

        <div className="flex w-full gap-4"> 
        {/*
        <div className="flex flex-wrap maxlg:flex-col w-full gap-4">
        의 경우 반응형.
        */}

        <div
          className="flex flex-col flex-glow item-start">
            <div className="flex items-center max-w-md w-full pt-3">
              <img src={personIcon} alt="인원수" className="w-7 h-7 ml-3 mb-4" /> 
                <span className='text-[#5B5B5B] mb-3'>
                {MemNumData?.mem !== undefined ? MemNumData.mem : ' '} 
                  {/*인원수에 따라 조정될 예정 */}
                </span>
                <span className='text-2xl ml-4 mb-3'>
                  {studyDetails.groupName}
                </span>
            </div>

            {/* <div className="flex justify-start text-[13px] ml-3 mb-2 text-[#4B4B4B]">
              오늘의 출석 현황
            </div> */}
            <div className="flex justify-start text-[13px] ml-3 mb-2 text-[#4B4B4B]">
              {scheduleData.date
                ? `${new Date(scheduleData.date).toLocaleDateString('ko-KR')} 출석 현황`
                : '출석 현황'}
            </div>
            
            {/* 스터디원 프로필 박스 */}
          <div className="bg-[#F7F9F2] w-full max-w-[320px] h-[70px] mb-4 rounded-lg shadow-lg overflow-x-auto flex items-center gap-3 px-4">
            {userInfo.length > 0 ? (
              userInfo.map((user) => (
                
                <div key={user.id} className="flex-shrink-0 text-center">
                  {/* 프로필 이미지 */}
                  <img
                src={user.image}
                alt={user.nickname}
                className={`w-11 h-11 rounded-full border object-cover ${
                  attendanceStatusMap[user.id] === 'ATTEND'
                    ? 'border-[#12921E] border-4' // 출석한 사용자
                    : 'border-[#ccc]' // 출석하지 않은 사용자
                }`}
              />
                </div>
          ))
        ) : (
          <p className="text-[#999] text-[12px]">스터디원이 없습니다.</p>
        )}
      </div>
          
            <div className="flex-shrink-0">
              <Calendar 
                onActiveDateChange={onMonthChange}
                onChange={onDateChange}
                value={selectedDate}
                className="p-6" 
                formatDay={(locale, date) => date.toLocaleString('en', { day: 'numeric' })}
                view={null}
                minDetail={null}
                next2Label={null}
                prev2Label={null}
                onActiveStartDateChange={({ activeStartDate }) => onMonthChange(activeStartDate)}
                tileClassName={({ date }) => {
                  // 현재 달인지 여부 확인
                  const isCurrentMonth = date.getMonth() === new Date().getMonth();
                  {/*
                  // 토요일은 검정색으로
                  if (date.getDay() === 6 && isCurrentMonth) {
                    return 'saturday';
                  }
                  if (!isCurrentMonth) {
                    return 'next-month';
                  }
                    */}
                  
                  const formattedDate = date.toLocaleDateString('en-CA');
                  if (datesWithSchedules.includes(formattedDate)) {
                    return 'study-scheduled'; // 일정이 있는 날짜에 대한 클래스
                  }
          
                  return null;
                }}
              />
            </div>

            {/* 타이머 컴포넌트 */}
            {scheduleData.time && (
              <AttendanceTimer scheduleTime={`${scheduleData.date} ${scheduleData.time}`} />
            )}
            {renderAttendanceButton()}
            {/* <div className="bg-[#F7F9F2] w-full max-w-[320px] h-[70px] mb-4 rounded-lg shadow-lg overflow-x-auto flex items-center gap-3 px-4">
               {renderAttendanceStatus()}
            </div> */}
          </div>

          {/*sidebar*/}
          <div className="flex-grow maxlg:w-full flex justify-center">
            <div className="w-full flex flex-col items-center">
              {isEditing ? (
                <EditSidebar 
                  scheduleData={ scheduleData || { date: selectedDate.toISOString().split('T')[0] }}
                  setScheduleData={setScheduleData}
                  setIsEditing={setIsEditing}
                  tasks={tasks}
                  setTasks={setTasks}
                  id={id}
                  studyId={studyId}
                  queryClient={queryClient}
                /> 
                ) : isCreating ? (
                <CreateSidebar
                  scheduleData={scheduleData || { date: selectedDate.toISOString().split('T')[0] }}
                  setScheduleData={handleCreateScheduleSuccess}
                  tasks={tasks}
                  setTasks={setTasks}
                  setIsCreating={setIsCreating}
                  id={id}
                  queryClient={queryClient}
                  />
                ) : (
                <ManageSidebar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  id={id}
                  studyId={studyId}
                  tasks={tasks}
                  setTasks={setTasks}
                  selectedDate={selectedDate}
                  scheduleData={scheduleData || { date: '', time: '', location: '' }}
                  onEditClick={() => setIsEditing(true)}
                  onAddClick={() => setIsCreating(true)}
                  onDeleteClick={handleDeleteSchedule}
                  studyDetails={studyDetails}
                  userInfo={userInfo}
                />
              )}
          </div>
        </div>
      </div>
      
        
    </div>
    </div>
    

    
  );
};

export default ManageStudy;