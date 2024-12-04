import React, { useState } from 'react';
import xIcon from "../assets/X.png";
import addIcon from "../assets/add.png";
import deleteIcon from "../assets/delete.png";
import locationIcon from "../assets/location.png";
import MapDropdown from './MapDropdown';
import { createSchedule } from '../api/Study';
import { createTask } from '../api/Task';

const CreateSidebar = ({ 
    scheduleData = { time: '', location: '' },
    setScheduleData,
    tasks, 
    setTasks,
    setIsCreating, 
    id,
    queryClient 
}) => {

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [time, setTime] = useState(scheduleData.time || '');
  const [address, setAddress] = useState('');
  const [selectedPlaceName, setSelectedPlaceName] = useState("");
  const [isSaving, setIsSaving] = useState(false); // 저장 중 상태 관리

  const studyDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${year}년 ${month}월 ${day}일`;
  };

  const handleLocationSelect = (location, placeName, addr) => {
    setSelectedLocation(location);
    setSelectedPlaceName(placeName); 
    setAddress(addr); 
    setIsMapOpen(false); // 지도 드롭다운 닫기
  };

  // 과제 추가
  const handleAddTask = () => {
    setTasks((prevTasks) => [
      ...prevTasks,
      { id: Date.now(), content: '', checked: false, isNew: true } // Temporary task ID
    ]);
  };

  // 과제 지우기
  const handleRemoveTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // 과제 업데이트
  const handleTaskChange = (id, content) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, content } : task
      )
    );
  };

  const handleSave = async () => {
    if (!time || !address) {
      alert('시간 및 장소를 모두 입력해주세요.');
      return;
    }

    // 스터디 생성 데이터
    const newScheduleData = {
        date: scheduleData.date, // 선택한 날짜
        time, // 입력된 시간
        location: `${address} ${selectedPlaceName}`, // 입력된 장소
      };

    setIsSaving(true); // 저장 중 상태 설정

    try {
      // createSchedule 호출
      const response = await createSchedule(id, newScheduleData);
      console.log('스터디 생성:', response);

      setScheduleData(response.data);
      queryClient.invalidateQueries(['schedule', id]); // React Query 캐시 무효화

      const createdStudyId = response.data.id; // 생성된 스터디 ID

      const newTasks = tasks.filter((task) => task.isNew);
        if (!response.data.id) {
          throw new Error("스터디 ID가 생성되지 않았습니다.");
        }
        for (const task of newTasks) {
          await handleSaveTask({ ...task, studyId: createdStudyId });
        } // 생성한 과제 저장

      alert('스터디가 성공적으로 생성되었습니다!');
      setIsCreating(false); // 편집 모드 종료
    } catch (error) {
      console.error('스터디 생성 실패:', error);
      alert('스터디 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false); // 저장 중 상태 해제
    }
};

// 과제 set 핸들러
const handleSaveTask = async (task) => {
  try {
    const response = await createTask(id, task.studyId, task.content);
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === task.id ? { ...task, id: response.data.id, isNew: false } : t
      )
    );
  } catch (error) {
    console.error('Error saving task:', error);
  }
};

  return (
    <div className="relative w-full">
        <div className="flex flex-col w-full flex-grow bg-[#F7F9F2] p-6 rounded-lg shadow-lg mb-4 md:mb-0 mt-4 md:mt-0">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-[#4B4B4B]">
                        {studyDate(scheduleData.date)} Create Schedule
                    </h2>
                    <img src={xIcon} alt="Back" className="w-6 h-6 cursor-pointer"
                    onClick={() => setIsCreating(false)} />
                </div>
            <hr className="border-t-[2px] border-gray-300 mb-4" />

                <div className="flex justify-between item-center mb-2">
                    <p className="text-[#4B4B4B] mr-3 mt-[4.5px] font-semibold w-[50px]">
                        시간:</p>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="bg-transparent border-none text-[#4B4B4B] py-1 appearance-none w-full"
                      lang="en-GB"
                    />
                </div>
            <div className="relative mb-2">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[#4B4B4B] mb-2"><strong>장소:</strong> {address ? `${address} ${selectedPlaceName}` : ""}
                </p>
                <img
                    src={locationIcon}
                    alt="location edit"
                    className="w-5 h-5 cursor-pointer mb-3 mr-[1px]"
                    onClick={() => setIsMapOpen((prev) => !prev)} // 지도 드롭다운 열기/닫기
                />
              </div>
            {/* 지도 드롭다운 */}
            {isMapOpen && (
                <div className="absolute top-full right-0 mt-2 flex justify-end w-full">
                  <MapDropdown onSelectLocation={handleLocationSelect} />
                </div> )}
            </div>


            <hr className="border-t-[2px] border-gray-300 mb-2" />
              <div className="p-6">
                  <div className="flex justify-between items-center mb-2 w-full">
                    <p className="text-lg text-[#4B4B4B] mr-4">과제</p>
                      <img src={addIcon} alt="Add Task" className="relative -top-1 w-5 h-5 cursor-pointer" onClick={handleAddTask} />
                  </div>

                  <div>
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center mb-2.5 space-x-2">
                  <input
                    type="checkbox"
                    checked={task.checked}
                    disabled
                    className="mr-2"
                  />
                  <input
                    type="text"
                    value={task.content} //이 부분 content로 통일
                    onChange={(e) => handleTaskChange(task.id, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded opacity-50"
                    placeholder="과제 내용을 입력하세요"
                  />
                  <img
                    src={deleteIcon}
                    alt="Delete Task"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => handleRemoveTask(task.id)}
                  />
                </div>
              ))}
            </div>
              </div>
            <hr className="border-t-[2px] border-gray-300 mb-4" />
        </div>
      </div>

    <div className="flex justify-end">
        <button onClick={handleSave} disabled={isSaving} type="submit" className="bg-[#8CC29E] text-white px-4 py-2 rounded-lg mt-3 ml-auto">
            저장
        </button>
    </div>
    </div>

  );
};

export default CreateSidebar;