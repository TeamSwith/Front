import React from 'react';
import xIcon from "../assets/X.png";
import timeIcon from "../assets/timeEdit.png";
import locationIcon from "../assets/location.png";

const EditSidebar = ({ scheduleData, tasks, handleCheckboxChange, setIsEditing }) => {
  return (
    <div className="w-full">
        <div className="flex flex-col w-full flex-grow bg-[#F7F9F2] p-6 rounded-lg shadow-lg mb-4 md:mb-0 mt-4 md:mt-0">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-[#4B4B4B]">
                        {scheduleData.date} Edit Schedule
                    </h2>
                    <img src={xIcon} alt="Back" className="w-6 h-6 cursor-pointer"
                    onClick={() => setIsEditing(false)} />
                </div>
            <hr className="border-t-[2px] border-gray-300 mb-4" />
                <div className="flex justify-between items-center mb-2">
                    <p className="text-[#4B4B4B]">
                        <strong>시간:</strong> {scheduleData.time}</p>
                    <img src={timeIcon} ali="time edit" className="w-6 h-6 cursor-pointer" />
                </div>
                <div className="flex justify-between items-center mb-2">
                    <p className="text-[#4B4B4B] mb-2"><strong>장소:</strong> {scheduleData.location}</p>
                    <img src={locationIcon} ali="location edit" className="w-6 h-6 cursor-pointer" />
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
        <button type="submit" className="bg-[#8CC29E] text-white px-4 py-2 rounded-lg mt-3 ml-auto">
            저장
        </button>
    </div>
    </div>

  );
};

export default EditSidebar;