import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { fetchSchedule, getMemNum, deleteSchedule, fetchGroupUsers, updateAttendStatus } from '../api/Study';
import { fetchNotice, updateNotice } from '../api/Notice';
import { fetchTasks, deleteTask } from '../api/Task';
import { getStudyDetails } from '../services/studyService';
import { fetchUserId } from '../services/commentService';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import ManageSidebar from "../components/ManageSidebar";
import CreateSidebar from "../components/CreateSIdebar";
import EditSidebar from '../components/EditSIdebar';
import speakerIcon from "../assets/speaker.png";
import editIcon from "../assets/edit.png";
import checkIcon from "../assets/Check.png"
import personIcon from "../assets/person.png";
import '../styles/ManageStudy.css';

const ManageStudy = () => {
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

  const [userInfo, setUserInfo] = useState(null); // 스터디원 정보
  const [studyDetails, setStudyDetails] = useState(null); // 스터디 세부 정보
  const [selectedDate, setSelectedDate] = useState(new Date());  //calander 날짜 선택
  const [scheduleData, setScheduleData] = useState({time: '', location: ''});
  const { id } = location.state || {};
  const [studyId, setStudyId] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState(null); // 출석 상태
  const [activeButton, setActiveButton] = useState(false); // 버튼 활성화 여부
  const [buttonTimer, setButtonTimer] = useState(null); // 버튼 타이머
  //const [groupId, setGroupId] = useState(null); // 그룹 아이디 추가
  const [userId, setUserId] = useState(null); // 유저 아이디 추가

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

          // 과제 호출
          const taskResponse = await fetchTasks(id, currentStudyId);
          setTasks(taskResponse.map(task => ({
          id: task.id,
          label: task.content,
          checked: task.taskStatus === 'COMPLETED', // 상태 기반으로 체크 여부 설정
        })));
        } else {
          setScheduleData({ date: formattedDate, time: '', location: '' });
          setStudyId(null);
          setTasks([]);
        }
      } catch (error) {
        console.error('스터디 데이터를 불러오는 중 오류 발생:', error);
      }
    },
    [id] // 의존성 배열에 필요한 값 추가
  );

  useEffect(() => {
    handleDateChange(selectedDate); // selectedDate가 변경될 때 데이터 업데이트
  }, []);

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

  // 사용자 ID 조회
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const updateUserId = await fetchUserId(); // userInfo.token이 필요
        setUserId(updateUserId);  // userId 상태 설정
      } catch (error) {
        console.error('사용자 ID 불러오기 실패:', error);
      }
    };
    loadUserId();
  }, []);

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
  return (
    <div
      className={`bg-[#8CC29E] w-full max-w-[320px] h-[40px] mt-4 rounded-lg shadow-lg flex items-center justify-center cursor-pointer ${!activeButton ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={updateAttendStatusHandler} // 클릭 시 출석 상태 업데이트
    >
      <span className='text-[14px] text-white'>
        출석하기
      </span>
    </div>
  );
};

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
      queryClient.invalidateQueries(['schedule', id]);
    } catch (error) {
      console.error('스터디 일정 삭제 실패:', error);
      alert('스터디 일정 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  //Notice
  const { data: noticeData, isLoading: isNoticeLoading, isError: isNoticeError } = useQuery(
    {
      queryKey: [id, 'notice'],
      queryFn: () => fetchNotice(id),
      staleTime: 1000 * 60 * 5,
    }
  );

  //update Notice
  const { mutate: updateNoticeMutation } = useMutation({
    mutationFn: ({ id, notice }) => updateNotice(id, notice), // updateNotice 호출
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [id, 'notice'] }); // 캐시 무효화
    },
  });

  const handleEditNoticeClick = () => {
    setIsEditingNotice(true);
    setNewNotice(noticeData?.data?.notice || '');
  };

  const handleSaveNotice = () => {
    updateNoticeMutation({ id, notice: newNotice }); // `id`와 `notice`를 전달
    setIsEditingNotice(false); // 수정 모드 종료
  };

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
                {noticeData?.data?.notice || '공지사항이 없습니다.'}
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

            <div className="flex justify-start text-[13px] ml-3 mb-2 text-[#4B4B4B]">
              출석 현황
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
                    className="w-11 h-11 rounded-full border border-[#ccc] object-cover"
                  />
                </div>
          ))
        ) : (
          <p className="text-[#999] text-[12px]">스터디원이 없습니다.</p>
        )}
      </div>
          
            <div className="flex-shrink-0">
              <Calendar 
                onChange={onDateChange}
                value={selectedDate}
                className="p-6" 
                formatDay={(locale, date) => date.toLocaleString('en', { day: 'numeric' })}
                view={null}
                minDetail={null}
                next2Label={null}
                prev2Label={null}
              />
            </div>

            {renderAttendanceButton()}
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
    

    
  );
};

export default ManageStudy;