import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchSchedule, createSchedule } from '../api/Study';
import { fetchNotice, updateNotice } from '../api/Notice';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import ManageSidebar from "../components/ManageSidebar";
import CreateSidebar from "../components/CreateSIdebar";
import EditSidebar from '../components/EditSIdebar';
import speakerIcon from "../assets/speaker.png";
import editIcon from "../assets/edit.png";
import checkIcon from "../assets/Check.png"
import personIcon from "../assets/person.png";
import './ManageStudy.css';

const ManageStudy = () => {
  const queryClient = useQueryClient();
  const marqueeTextRef = useRef(null);
  const marqueeContainerRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  //calander 날짜 선택
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [id] = useState(1);

  //스터디 일정 데이터 가져오기
const { data: scheduleResponse, isLoading, error } = useQuery(
  {
    queryKey: ['schedule', id, selectedDate.toISOString().split('T')[0]],
    queryFn: () => fetchSchedule(id, selectedDate.toISOString().split('T')[0]),
    enabled: !!selectedDate,
    staleTime: 5 * 60 * 1000, // 캐시 유효 시간 (5분)
  }
);

  const scheduleData = scheduleResponse?.success
  ? scheduleResponse.data
  : { time: '', location: ''};

  const handleDateChange = (date) => {
    setSelectedDate(date);
    queryClient.invalidateQueries(['schedule', id, date.toISOString().split('T')[0]]);
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

  //공지사항 애니메이션
  useEffect(() => {
    if (notice && marqueeTextRef.current && marqueeContainerRef.current) {
      setIsOverflowing(marqueeTextRef.current.scrollWidth > marqueeContainerRef.current.clientWidth);
    }
  }, [notice, marqueeTextRef, marqueeContainerRef]);
  

  return (
    <div className="sm:px-20 md:px-28 lg:px-36 xl:px-[300px] px-[30px] py-[90px]">
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

      

      
      
    

        <div className="flex flex-wrap maxlg:flex-col w-full gap-4">

        <div
          className="flex flex-col flex-glow maxlg:items-center">
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

            <div className="flex justify-start text-[13px] ml-3 mb-2 text-[#4B4B4B]">
              출석 현황
            </div>

            <div className="bg-[#F7F9F2] w-full max-w-[320px] h-[60px] mb-4 rounded-lg shadow-lg"> </div>
          
            <div className="flex-shrink-0">
              <Calendar 
                onChange={handleDateChange}
                value={selectedDate}
                className="p-6" 
                formatDay={(locale, date) => date.toLocaleString('en', { day: 'numeric' })}
                view={null}
                minDetail={null}
                next2Label={null}
                prev2Label={null}
              />
            </div>

            <div className="bg-[#8CC29E] w-full max-w-[320px] h-[40px] mt-4 rounded-lg shadow-lg flex items-center justify-center cursor-pointer"> 
              <span className='text-[14px] text-white'>
                출석하기
              </span>
            </div>
          </div>

          {/*sidebar*/}
          <div className="flex-grow maxlg:w-full flex justify-center">
            <div className="w-full flex flex-col items-center">
              {isEditing === 'edit' ? (
                <EditSidebar 
                scheduleData={scheduleResponse?.data || { date: selectedDate.toISOString().split('T')[0] }}
                tasks={tasks}
                handleCheckboxChange={handleCheckboxChange}
                setIsEditing={setIsEditing}
                id={id}
                queryClient={queryClient}
                /> 
                // 편집 모드일 때 EditSidebar 렌더링
                ) : isEditing === 'create' ? (
                  <CreateSidebar
                    scheduleData={{ date: selectedDate.toISOString().split('T')[0], time: '', location: '' }}
                    tasks={tasks}
                    handleCheckboxChange={handleCheckboxChange}
                    setIsCreating={setIsCreating}
                    id={id}
                    queryClient={queryClient}
                  />
                ) : (
              <ManageSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                progressPercentage={progressPercentage}
                tasks={tasks}
                handleCheckboxChange={handleCheckboxChange}
                selectedDate={selectedDate}
                scheduleData={scheduleData}
                onEditClick={() => setIsEditing('edit')}
                onAddClick={() => setIsEditing('create')}
              />
              )}
          </div>
        </div>
      </div>
      
        
    </div>
    

    
  );
};

export default ManageStudy;