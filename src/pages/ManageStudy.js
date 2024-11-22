import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchSchedule } from '../api/Study';
import { fetchNotice, updateNotice } from '../api/Notice';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import ManageSidebar from "../components/ManageSidebar";
import EditSidebar from "../components/EditSIdebar";
import speakerIcon from "../assets/speaker.png";
import editIcon from "../assets/edit.png";
import checkIcon from "../assets/Check.png"
import personIcon from "../assets/person.png";
import './ManageStudy.css';

const ManageStudy = () => {
  const queryClient = useQueryClient();
  //const [value, onChange] = useState(new Date());
  const marqueeTextRef = useRef(null);
  const marqueeContainerRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');
  const [isEditing, setIsEditing] = useState(false);


// Edit 버튼 클릭 시 편집 모드로 전환
const handleEditClick = () => {
  setIsEditing(true); 
};

  //calander 날짜 선택
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userId, setUserId] = useState(1); //!!동적으로 수정되어야함

  //스터디 일정 데이터 가져오기
  const { data: scheduleData } = useQuery({
    queryKey: ['schedule', userId, selectedDate],
    queryFn: () => fetchSchedule(userId, selectedDate.toISOString().split('T')[0]), // 날짜를 API 형식으로 변환
    enabled: !!selectedDate, // 날짜가 선택되었을 때만 실행
    staleTime: 5 * 60 * 1000, // 캐싱 유효시간 (5분)
  });

  const handleCreateSchedule = () => {
    console.log(`Creating schedule for date: ${selectedDate.toISOString().split('T')[0]}`);
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  //Notice
  const { data: notice } = useQuery({
    queryKey: ['notice'],
    queryFn: fetchNotice,
  });

  useEffect(() => {
    if (marqueeTextRef.current && marqueeContainerRef.current && notice) {
      setIsOverflowing(marqueeTextRef.current.scrollWidth > marqueeContainerRef.current.clientWidth);
    }
  }, [notice, marqueeTextRef, marqueeContainerRef]);

  //update Notice
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [newNotice, setNewNotice] = useState('');

  const { mutate: editNotice } = useMutation({
    mutationFn: updateNotice,
    onSuccess: () => {
      queryClient.invalidateQueries(['notice']);
      setIsEditingNotice(false);
    },
    onError: (error) => {
      console.error('Failed to update notice:', error);
    },
  });

  const handleEditNoticeClick = () => {
    setIsEditingNotice(true);
    setNewNotice(notice?.notice || '');
  };

  const handleSaveNotice = async () => {
    if (newNotice.trim()) {
      editNotice({ notice: newNotice.trim() });
    }
  };

{ /*
  // 날짜가 변경될 때마다 새로운 스케줄 데이터를 불러오기
  useEffect(() => {
    const newScheduleData = fetchScheduleData(selectedDate);
    setScheduleData(newScheduleData);
  }, [selectedDate]);
*/}


  // 과제 관련 상태 관리 (추후 api 호출)
  const [tasks, setTasks] = useState([
    { id: 1, label: '과제 1', checked: false },
    { id: 2, label: '과제 2', checked: false },
    { id: 3, label: '과제 3', checked: false },
    { id: 4, label: '과제 4', checked: false },
  ]);
  // 체크박스 상태 변경 함수
  const handleCheckboxChange = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, checked: !task.checked } : task
      )
    );
  };
  // 체크된 항목의 비율을 계산
  const checkedCount = tasks.filter((task) => task.checked).length;
  const totalTasks = tasks.length;
  const progressPercentage = (checkedCount / totalTasks) * 100;


  useEffect(() => {
    if (notice && marqueeTextRef.current && marqueeContainerRef.current) {
      setIsOverflowing(marqueeTextRef.current.scrollWidth > marqueeContainerRef.current.clientWidth);
    }
  }, [notice, marqueeTextRef, marqueeContainerRef]);
  

  return (
    <div className="xl:pl-[320px] xl:pr-[320px] lg:pl-[150px] lg:pr-[150px] px-[30px] py-[90px]">
      <div className="w-full bg-[#F2F2F2] text-[#4B4B4B] text-[14px] py-2 mb-4 flex items-center justify-between rounded-2xl overflow-hidden position: relative">
        <div className="flex items-center">
          <img src={speakerIcon} alt="Speaker Icon" className="w-6 h-6 mr-3 ml-4" />
          <div className="marquee-container mr-4 " ref={marqueeContainerRef}>

            {isEditingNotice ? (
              <input
                type="text"
                value={newNotice}
                onChange={(e) => setNewNotice(e.target.value)}
              />
            ) : (
              <span
                className={`marquee-text ${isOverflowing ? 'animate-marquee' : ''}`}
                ref={marqueeTextRef}
              >
                {notice?.notice || '공지사항이 없습니다.'}
              </span>
            )}
          </div>
        </div>
        
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        {isEditingNotice ? (
          <img src={checkIcon} alt="Check Icon" className="w-5 h-5 cursor-pointer" 
          onClick={handleSaveNotice}/>
        ) : (
          <img src={editIcon} alt="Edit Icon" className="w-5 h-5 cursor-pointer" 
          onClick={handleEditNoticeClick}/>
        )}
        </div>
      </div>

      <div className="flex flex-col justify-center w-full">
      <div className="flex items-center max-w-md w-full pt-3">
        <img src={personIcon} alt="인원수" className="w-7 h-7 ml-3 mb-4" /> 
          <span className='text-[#5B5B5B] mb-3'>
            6 
            {/*인원수에 따라 조정될 예정 */}
          </span>
          <span className='text-2xl ml-3 mb-3'>
            C++의 황제가 될 거야
          </span>
      </div>

      
      
      <div className="flex flex-wrap flex-row md:flex-row md:space-x-4 w-full">

        <div className="flex flex-col">

          <div className="text-[13px] ml-3 mb-2 text-[#4B4B4B]">
            출석 현황
          </div>

          <div className="bg-[#F7F9F2] w-full max-w-[400px] h-[60px] mb-4 rounded-lg shadow-lg"> </div>
        
          <div className="flex-shrink-0">
            <Calendar 
              onChange={setSelectedDate}
              value={selectedDate}
              className="p-6" 
              formatDay={(locale, date) => date.toLocaleString('en', { day: 'numeric' })}
              view={null}
              minDetail={null}
              next2Label={null}
              prev2Label={null}
            />
          </div>

          <div className="bg-[#8CC29E] w-full max-w-[400px] h-[40px] mt-4 rounded-lg shadow-lg flex items-center justify-center cursor-pointer"> 
            <span className='text-[14px] text-white'>
              출석하기
            </span>
          </div>
        </div>

        <div className="w-full md:w-auto flex justify-center">
        <div className = "w-full max-w-[400px] flex flex-col items-center">
        {isEditing ? (
          <EditSidebar 
          scheduleData={scheduleData}
          tasks={tasks}
          handleCheckboxChange={handleCheckboxChange}
          setIsEditing={setIsEditing}
          /> 
          // 편집 모드일 때 EditSidebar 렌더링
          ) : (
        <ManageSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          progressPercentage={progressPercentage}
          tasks={tasks}
          handleCheckboxChange={handleCheckboxChange}
          selectedDate={selectedDate}
          scheduleData={scheduleData}
          onEditClick={handleEditClick} 
          onCreateClick={handleCreateSchedule}
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