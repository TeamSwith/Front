import React, { useState, useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import ManageSidebar from "../components/ManageSidebar";
import EditSidebar from "../components/EditSIdebar";
import speakerIcon from "../assets/speaker.png";
import editIcon from "../assets/edit.png";
import personIcon from "../assets/person.png";
import './ManageStudy.css';

const ManageStudy = () => {
  const [value, onChange] = useState(new Date());
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
  const [scheduleData, setScheduleData] = useState(null);
  // 추후 API로 대체할 임의 데이터
  const fetchScheduleData = (date) => {
    return {
      date: date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/-/g, '.'),
      time: '오후 2:00 - 오후 4:00',
      location: '온라인 화상회의',
    };
  };
  // 날짜가 변경될 때마다 새로운 스케줄 데이터를 불러오기
  useEffect(() => {
    const newScheduleData = fetchScheduleData(selectedDate);
    setScheduleData(newScheduleData);
  }, [selectedDate]);

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
    if (marqueeTextRef.current && marqueeContainerRef.current) {
      setIsOverflowing(marqueeTextRef.current.scrollWidth > marqueeContainerRef.current.clientWidth);
    }
  }, [marqueeTextRef, marqueeContainerRef]);

  return (
    <div className="xl:pl-[320px] xl:pr-[320px] lg:pl-[150px] lg:pr-[150px] px-[30px] py-[90px]">
      <div className="w-full bg-[#F2F2F2] text-[#4B4B4B] text-[14px] py-2 mb-4 flex items-center justify-between rounded-2xl overflow-hidden position: relative">
        <div className="flex items-center">
          <img src={speakerIcon} alt="Speaker Icon" className="w-6 h-6 mr-3 ml-4" />
          <div className="marquee-container mr-4 " ref={marqueeContainerRef}>
            <span
              className={`marquee-text ${isOverflowing ? 'animate-marquee' : ''}`}
              ref={marqueeTextRef}
            >
              중요한 공지사항입니다. 중요한 공지사항입니다.중요한 공지........
            </span>
          </div>
        </div>
        
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <img src={editIcon} alt="Edit Icon" className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

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

      
      
      <div className="flex flex-row md:flex-row md:space-x-4 w-full">

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
          onEditClick={handleEditClick} // Edit 버튼 클릭 함수 전달
        />
        )}
      </div>
        
    </div>
    

    
  );
};

export default ManageStudy;