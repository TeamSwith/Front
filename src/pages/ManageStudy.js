import React, { useState, useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import speakerIcon from "../assets/speaker.png";
import editIcon from "../assets/edit.png";
import personIcon from "../assets/person.png";
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
    <div className="pl-[200px] pr-[200px] py-20">
      <div className="w-full bg-[#F2F2F2] text-[#4B4B4B] text-[14px] py-2 mb-4 flex items-center justify-between rounded-2xl overflow-hidden position: relative">
        <div className="flex items-center">
          <img src={speakerIcon} alt="Speaker Icon" className="w-6 h-6 mr-3 ml-4" />
          <div className="marquee-container overflow-hiddln mr-4 " ref={marqueeContainerRef}>
            <span
              className={`marquee-text ${isOverflowing ? 'animate-marquee' : ''}`}
              ref={marqueeTextRef}
            >
              중요한 공지사항입니다. 중요한 공지사항입니다.중요한 공지........중요한 공지사항입니다. 중요한 공지사항입니다.중요한 공지사항입니다dkggg
            </span>
          </div>
        </div>
        
        <img src={editIcon} alt="Edit Icon" className="w-5 h-5 cursor-pointer mr-4 flex-shrink-0 position: absolute right-1" />
        
      </div>

      <div className="flex items-center">
        <img src={personIcon} alt="인원수" className="w-7 h-7 ml-3 mb-4" /> 
          <span className='text-[#5B5B5B] mb-3'>
            6 
            {/*인원수에 따라 조정될 예정 */}
          </span>
          <span className='text-2xl ml-3 mb-3'>
            C++의 황제가 될 거야
          </span>
      </div>
      

      <Calendar 
        onChange={onChange} 
        value={value}
        className="p-6" 
      />
    </div>
  );
};

export default ManageStudy;