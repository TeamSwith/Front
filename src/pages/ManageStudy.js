import React, { useState, useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import speakerIcon from "../assets/speaker.png";
import editIcon from "../assets/edit.png";
import personIcon from "../assets/person.png";
import trashIcon from "../assets/Trash.png";
import './ManageStudy.css';


const ManageStudy = () => {
  const [value, onChange] = useState(new Date());
  const marqueeTextRef = useRef(null);
  const marqueeContainerRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

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
            onChange={onChange} 
            value={value}
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
    

        <div className="bg-[#F7F9F2] flex-grow p-6 rounded-lg  shadow-lg mb-4 md:mb-0 mt-4 md:mt-0">
          <h2 className="text-lg font-semibold text-[#4B4B4B] mb-4 flex justify-between">
            XXXX.XX.XX Study Schedule
            <div className="flex space-x-3">
              <img src={editIcon} alt="Edit Icon" className="w-6 h-6 cursor-pointer" />
              <img src={trashIcon} alt="Trash Icon" className="w-6 h-6 cursor-pointer" />
            </div>
          </h2>
          <hr className="border-t-[2px] border-gray-300 mb-4" />
          <p className="text-[#4B4B4B] mb-3">
            시간:
          </p>
          <p className="text-[#4B4B4B] mb-4">
            장소:
          </p>
          <hr className="border-t-[2px] border-gray-300 mb-4" />
          <p className="text-[#4B4B4B] mb-4">
            과제
          </p>
        </div>
      </div>
        

    </div>
    

    
  );
};

export default ManageStudy;