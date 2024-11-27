import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchSchedule, getMemNum } from '../api/Study';
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
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [newNotice, setNewNotice] = useState('');

  //calander 날짜 선택
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState({time: '', location: ''});
  const id = 2; // Group ID 가져올 수 있게되면 수정
  const [studyId, setStudyId] = useState(null);

  const handleDateChange = async (date) => {
    const formattedDate = date.toLocaleDateString('en-CA');


    try {
      // GET API 호출
      const response = await fetchSchedule(id, formattedDate);

      if (response.success && response.data?.id) {
        setScheduleData(response.data); 
        setStudyId(response.data.id); // studyId 업데이트

      } else {
        setScheduleData({ date: formattedDate, time: '', location: '' });
        setStudyId(null);
      }
    } catch (error) {
      console.error('스터디 데이터를 불러오는 중 오류 발생:', error);
      alert('스터디 데이터를 불러오지 못했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    handleDateChange(selectedDate); // selectedDate가 변경될 때 데이터 업데이트
  }, [selectedDate]);

  // 선택된 날짜 변경 핸들러
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

  //const url = `http://3.36.118.29:8080/api/group/${id}`
  //console.log(url);

  const handleEditNoticeClick = () => {
    setIsEditingNotice(true);
    setNewNotice(noticeData?.data || '');
  };

  const handleSaveNotice = () => {
    console.log('Saving notice:', { id, notice: newNotice }); // 디버깅 로그
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

  if (isNoticeLoading) return <div>Loading...</div>;
  if (isNoticeError) return <div>공지사항을 불러오는 중 오류가 발생했습니다.</div>;
  

  return (
    <div className="sm:px-20 md:px-28 lg:px-36 xl:px-[300px] px-[30px] py-[90px]">
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
                {noticeData?.data || '공지사항이 없습니다.'}
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

      

      
      
    

        <div className="flex flex-wrap maxlg:flex-col w-full gap-4">

        <div
          className="flex flex-col flex-glow maxlg:items-center">
            <div className="flex items-center max-w-md w-full pt-3">
              <img src={personIcon} alt="인원수" className="w-7 h-7 ml-3 mb-4" /> 
                <span className='text-[#5B5B5B] mb-3'>
                {MemNumData?.data !== undefined ? MemNumData.data : ' '} 
                  {/*인원수에 따라 조정될 예정 */}
                </span>
                <span className='text-2xl ml-4 mb-3'>
                  C++의 황제가 될 거야
                </span>
            </div>

            <div className="flex justify-start text-[13px] ml-3 mb-2 text-[#4B4B4B]">
              출석 현황
            </div>

            <div className="bg-[#F7F9F2] w-full max-w-[320px] h-[60px] mb-4 rounded-lg shadow-lg"> </div>
          
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

            <div className="bg-[#8CC29E] w-full max-w-[320px] h-[40px] mt-4 rounded-lg shadow-lg flex items-center justify-center cursor-pointer"> 
              <span className='text-[14px] text-white'>
                출석하기
              </span>
            </div>
          </div>

          {/*sidebar*/}
          <div className="flex-grow maxlg:w-full flex justify-center">
            <div className="w-full flex flex-col items-center">
              {isEditing ? (
                <EditSidebar 
                scheduleData={ scheduleData || { date: selectedDate.toISOString().split('T')[0] }}
                setScheduleData={setScheduleData}
                tasks={tasks}
                handleCheckboxChange={handleCheckboxChange}
                setIsEditing={setIsEditing}
                id={id}
                studyId={studyId}
                queryClient={queryClient}
                /> 
                // 편집 모드일 때 EditSidebar 렌더링
                ) : isCreating ? (
                  <CreateSidebar
                    scheduleData={scheduleData || { date: selectedDate.toISOString().split('T')[0] }}
                    setScheduleData={setScheduleData}
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
                onEditClick={() => setIsEditing(true)}
                onAddClick={() => setIsCreating(true)}
              />
              )}
          </div>
        </div>
      </div>
      
        
    </div>
    

    
  );
};

export default ManageStudy;