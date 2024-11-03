import React, { useState, useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import speakerIcon from "../assets/speaker.png";
import editIcon from "../assets/edit.png";
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
      <div className="w-full bg-[#F2F2F2] text-[#4B4B4B] text-[14px] py-2 mb-4 flex items-center justify-between rounded-2xl overflow-hidden">
        <div className="flex items-center">
          <img src={speakerIcon} alt="Speaker Icon" className="w-6 h-6 mr-3 ml-4" />
          <div className="marquee-container flex-grow mr-4" ref={marqueeContainerRef}>
            <span
              className={`marquee-text ${isOverflowing ? 'animate-marquee' : ''}`}
              ref={marqueeTextRef}
            >
              중요한 공지사항입니다. 중요한 공지사항입니다.중요한 공지사항입니다.중요한 공지사항입니다.중요한 공지사항입니다.
            </span>
          </div>
        </div>
        <img src={editIcon} alt="Edit Icon" className="w-5 h-5 cursor-pointer mr-4 flex-shrink-0" />
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