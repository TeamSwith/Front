import React, { useState } from 'react';
import xIcon from "../assets/X.png";
import timeIcon from "../assets/timeEdit.png";
import locationIcon from "../assets/location.png";
import MapDropdown from './MapDropdown';
import { createSchedule } from '../api/Study';

const CreateSidebar = ({ 
    scheduleData = { time: '', location: '' },
    tasks, 
    handleCheckboxChange, 
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


  const handleLocationSelect = (location, placeName, addr) => {
    setSelectedLocation(location);
    setSelectedPlaceName(placeName); 
    setAddress(addr); 
    setIsMapOpen(false); // 지도 드롭다운 닫기
  };

  const handleSave = async () => {
    // 유효성 검사
    if (!time || !address) {
      alert('시간 및 장소를 모두 입력해주세요.');
      return;
    }

// 스터디 생성 데이터
const newScheduleData = {
    date: scheduleData.date, // 선택한 날짜
    time: time, // 입력된 시간
    location: `${address} ${selectedPlaceName}`, // 입력된 장소
  };

  setIsSaving(true); // 저장 중 상태 설정

  try {
    // createSchedule 호출
    const response = await createSchedule(id, newScheduleData);
    console.log('스터디 생성 성공:', response);

    // React Query 캐시 무효화
    queryClient.invalidateQueries(['schedule', id]);

    alert('스터디가 성공적으로 생성되었습니다!');
    setIsCreating(false); // 편집 모드 종료
  } catch (error) {
    console.error('스터디 생성 실패:', error);
    alert('스터디 생성에 실패했습니다. 다시 시도해주세요.');
  } finally {
    setIsSaving(false); // 저장 중 상태 해제
  }
};

  return (
    <div className="relative w-full">
        <div className="flex flex-col w-full flex-grow bg-[#F7F9F2] p-6 rounded-lg shadow-lg mb-4 md:mb-0 mt-4 md:mt-0">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-[#4B4B4B]">
                        {scheduleData.date} Craate Schedule
                    </h2>
                    <img src={xIcon} alt="Back" className="w-6 h-6 cursor-pointer"
                    onClick={() => setIsCreating(false)} />
                </div>
            <hr className="border-t-[2px] border-gray-300 mb-4" />
                <div className="flex justify-between items-center mb-2">
                    <p className="text-[#4B4B4B]">
                        <strong>시간:</strong></p>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="border rounded px-2 py-1"
                            />
                    <img src={timeIcon} alt="time edit" className="w-6 h-6 cursor-pointer" />
                </div>
        <div className="relative mb-2">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-[#4B4B4B] mb-2"><strong>장소:</strong> {address ? `${address} ${selectedPlaceName}` : ""}
                    </p>
                    <img
                        src={locationIcon}
                        alt="location edit"
                        className="w-6 h-6 cursor-pointer"
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
                <div className="flex items-center mb-4 space-x-4">
                <p className="text-lg text-[#4B4B4B] mr-4">과제</p>
                </div>

                <div>
                    {tasks.map((task) => (
                        <div key={task.id} className="flex items-center mb-2.5">
                        <input
                            type="checkbox"
                            checked={task.checked}
                            onChange={() => handleCheckboxChange(task.id)}
                            className="mr-2"
                        />
                        <label className="text-[#4B4B4B]">{task.label}</label>
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