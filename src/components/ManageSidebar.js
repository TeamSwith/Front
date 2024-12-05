import React, { useState, useEffect } from 'react';
import editIcon from "../assets/edit.png";
import trashIcon from "../assets/Trash.png";
import addIcon from "../assets/add.png";
import noSchedule from "../assets/noSchedule.png"
import { updateTaskStatus } from "../api/Task";
import ManageComments from './ManageComments'; //임의의 피드백 데이터

const ManageSidebar = ({ 
    activeTab, 
    setActiveTab,
    id,
    studyId,
    tasks,
    setTasks,
    scheduleData, 
    onAddClick,
    onEditClick,
    onDeleteClick,
    selectedDate,
    studyDetails,
    userInfo,
    onTaskUpdate,
}) => {

    const [progressPercentage, setProgressPercentage] = useState(0);

    // 부모로부터 받은 tasks 동기화
  useEffect(() => {
    // tasks가 배열인지 확인하고 상태를 동기화
    if (Array.isArray(tasks)) {
        setTasks(tasks);
    } else {
        setTasks([]); // tasks가 유효하지 않을 경우 초기화
    }
}, [tasks]);

    const studyTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours}시 ${minutes}분`;
      };

    const studyDate = (date) => {
        if (!date) return '날짜 정보 없음'; // date가 undefined, null, 또는 빈 문자열인 경우 기본 값 반환
        const [year, month, day] = date.split('-');
        return `${year}년 ${month}월 ${day}일`;
      };

     // 체크 상태 업데이트
     const handleCheckboxChange = async (taskId, checked) => {
        try {
            const updatedStatus = checked ? "COMPLETED" : "PENDING";
            console.log("Before update:", tasks);
            const response = await updateTaskStatus(taskId, updatedStatus);
            if (response.success) {
                const updatedTasks = tasks.map((task) =>
                    task.id === taskId ? { ...task, checked } : task
                );
                console.log("Updated tasks:", updatedTasks);
                setTasks(updatedTasks);
                updateProgress(updatedTasks); // 업데이트된 `localTasks`로 프로그레스바 업데이트
                onTaskUpdate(taskId);
            }
        } catch (error) {
            console.error("Failed to update task status:", error);
        }
    };

    // 프로그레스바 업데이트
    const updateProgress = (tasks) => {
        const completedCount = tasks.filter((task) => task.checked).length; // `checked` 상태를 기준으로 완료된 과제 계산
        const totalCount = tasks.length;
        const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
        setProgressPercentage(progress);
      };
    
  return (

    <div className="flex flex-col w-full flex-grow">

        {/* schedule/information 카테고리 */}
        <div className="flex space-x-8 w-fit border-b border-gray-300 mb-4">
            <button
                onClick={() => setActiveTab('schedule')}
                className={`text-lg font-semibold pb-2 ${
                activeTab === 'schedule' ? 'text-[#8CC29E] border-b-2 border-[#8CC29E]' : 'text-gray-500'
                }`} >
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('information')}
              className={`text-lg font-semibold pb-2 ${
              activeTab === 'information' ? 'text-[#8CC29E] border-b-2 border-[#8CC29E]' : 'text-gray-500'
            }`}
            >
              Information
            </button>
        </div>
    

        <div className="bg-[#F7F9F2] flex-grow p-6 rounded-lg shadow-lg mb-4 md:mb-0 mt-4 md:mt-0">

        {activeTab === 'schedule' ? (
            scheduleData.time && scheduleData.location ? (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-[#4B4B4B]">
                        {studyDate(scheduleData.date)} Study Schedule
                        </h2>
                        <div className="flex space-x-3">
                            <img src={editIcon} alt="Edit Icon" className="w-6 h-6 cursor-pointer"
                            onClick={onEditClick} />
                            <img src={trashIcon} alt="Trash Icon" className="w-6 h-6 cursor-pointer"
                            onClick={onDeleteClick} />
                        </div>
                    </div>
                    <hr className="border-t-[2px] border-gray-300 mb-4" />
                    <p className="text-[#4B4B4B] mb-2"><strong>시간:</strong> {studyTime(scheduleData.time)}</p>
                    <p className="text-[#4B4B4B] mb-2"><strong>장소:</strong> {scheduleData.location}</p>
                    
                    <hr className="border-t-[2px] border-gray-300 mb-2" />

                    <div className="p-6">
      {/* 과제 텍스트와 프로그레스바 */}
      <div className="flex items-center mb-4 space-x-4">
        <p className="text-lg text-[#4B4B4B] mr-4">과제</p>
        <div className="w-[200px] h-4 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#8CC29E] rounded-full transition-width duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <span className="text-[#5B5B5B]">{Math.round(progressPercentage)}%</span>
      </div>

      {/* 체크박스 리스트 */}
      <div>
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center mb-2.5 space-x-2">
            <input
              type="checkbox"
              checked={task.checked}
              onChange={(e) => handleCheckboxChange(task.id, e.target.checked)}
              className="mr-2"
            />
            <label className="text-[#4B4B4B]">{task.content || task.label}</label> {/* 텍스트 렌더링 */}
          </div>
        ))}
      </div>
    </div>

                    <hr className="border-t-[2px] border-gray-300 mb-4" />
                    <ManageComments studyDetails={studyDetails} userInfo={userInfo} studyId={studyId} selectedDate={selectedDate} />
                </div>
            ) : (
            <div>
                <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-[#4B4B4B]">
                        {studyDate(scheduleData.date)} Study Schedule
                        </h2>
                        <div className="flex space-x-3">
                            <img src={addIcon} alt="Add Icon" className="w-6 h-6 cursor-pointer"
                            onClick={onAddClick}
                            />
                            
                        </div>
                        
                    </div>
                    <hr className="border-t-[2px] border-gray-300 mb-4" />

                    <div className= "flex flex-col items-center justify-center w-full">
                    <img src={noSchedule} alt="" className="w-[150px] h-[150px] mt-[100px] mb-3" />
                    <p className="text-gray-500 mb-[100px]">예정된 스케줄이 없습니다.</p>
                    </div>
            </div>
            )
            ) : (
            // Information 탭 내용
            <div>
                <h2 className="text-xl text-[#4B4B4B] mb-4">
                    {studyDetails.groupName}
                </h2>
                <hr className="border-t-[2px] border-gray-300 mb-4" />
                <p className="text-[#4B4B4B] mb-5">스터디 아이디 | {studyDetails.groupInsertId}</p>
                <p className="text-[#4B4B4B] mb-5">스터디 기간 | {studyDetails.period}</p>
                <p className="text-[#4B4B4B] mb-5 cursor-pointer">소통 수단 | {studyDetails.communication}</p>
                {/* <p className="text-[#4B4B4B] mb-4">XXXX.XX.XX에 생성된 스터디</p> */}
                <hr className="border-t-[2px] border-gray-300 mb-4" />
                <p className="text-lg text-[#4B4B4B] mb-3">스터디원</p>
                {userInfo &&
                 userInfo.map((user) => (
                    <div key={user.id} className="flex items-center mb-2">
                    <img
                        src={user.image || 'https://via.placeholder.com/40'}
                        alt={user.nickname}
                        className="w-10 h-10 rounded-full mr-4"
                    />
                    <span className="text-[#4B4B4B]">{user.nickname}</span>
                    </div>
                ))}
            </div>
        )}

        </div>

    </div>
        );
    };
    
    export default ManageSidebar;