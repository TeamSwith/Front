import React, { useState } from 'react';
import { editSchedule } from '../api/Study';
import xIcon from "../assets/X.png";
import locationIcon from "../assets/location.png";
import MapDropdown from './MapDropdown';

const EditSidebar = ({ 
    scheduleData, 
    setScheduleData,
    id,
    studyId,
    tasks = [], 
    handleCheckboxChange, 
    setIsEditing }) => {

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState(scheduleData.location || '');
  const [time, setTime] = useState(scheduleData.time || '');
  const [selectedPlaceName, setSelectedPlaceName] = useState("");
  
    const handleSave = async () => {
      try {
        const updatedSchedule = { time, location: `${address} ${selectedPlaceName}`.trim() };
        const response = await editSchedule(id, studyId, updatedSchedule);
        console.log('스터디 수정 성공:', response);
  
        setScheduleData(response.data); // 수정된 데이터 반영
        alert('스터디 일정이 성공적으로 수정되었습니다.');
        setIsEditing(false); // 수정 모드 종료
      } catch (error) {
        console.error('스터디 일정 수정 실패:', error);
        alert('스터디 일정 수정에 실패했습니다. 다시 시도해주세요.');
      }
    };

  const handleLocationSelect = (location, placeName, addr) => {
    setSelectedLocation(location);
    setSelectedPlaceName(placeName); 
    setAddress(addr); 
    setIsMapOpen(false); // 지도 드롭다운 닫기
  };

  const studyDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${year}년 ${month}월 ${day}일`;
  };

  return (
    <div className="relative w-full">
        <div className="flex flex-col w-full flex-grow bg-[#F7F9F2] p-6 rounded-lg shadow-lg mb-4 md:mb-0 mt-4 md:mt-0">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-[#4B4B4B]">
                        {studyDate(scheduleData.date)} Edit Schedule
                    </h2>
                    <img src={xIcon} alt="Back" className="w-6 h-6 cursor-pointer"
                    onClick={() => setIsEditing(false)} />
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
        <button type="submit" className="bg-[#8CC29E] text-white px-4 py-2 rounded-lg mt-3 ml-auto"
        onClick={handleSave}>
            저장
        </button>
    </div>
    </div>

  );
};

export default EditSidebar;