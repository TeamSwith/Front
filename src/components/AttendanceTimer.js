import React, { useState, useEffect } from 'react';

const AttendanceTimer = ({ scheduleTime }) => {
  const [timeLeft, setTimeLeft] = useState(null); // 남은 시간 상태
  const [isTimerActive, setIsTimerActive] = useState(false); // 타이머 활성화 여부

  useEffect(() => {
    const startTime = new Date(scheduleTime); // 일정 시작 시간
    const endTime = new Date(startTime.getTime() +  5 * 60 * 1000); // 5분 후 종료 시간
    const now = new Date();

    if (now >= startTime && now <= endTime) {
      setIsTimerActive(true); // 타이머 활성화
      setTimeLeft(Math.ceil((endTime - now) / 1000)); // 남은 시간(초) 계산
    } else {
      setIsTimerActive(false); // 타이머 비활성화
      setTimeLeft(null);
    }

    const interval = setInterval(() => {
      const currentTime = new Date();
      if (currentTime >= endTime) {
        setIsTimerActive(false); // 타이머 종료
        clearInterval(interval);
      } else {
        setTimeLeft(Math.ceil((endTime - currentTime) / 1000)); // 남은 시간 업데이트
      }
    }, 1000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, [scheduleTime]);

  if (!isTimerActive) return null; // 타이머가 활성화되지 않았을 경우 표시하지 않음

  // 남은 시간 포맷팅 (분:초)
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // 투명 배경
        padding: '10px',
        borderRadius: '10px',
        textAlign: 'center',
        marginTop: '20px', // 캘린더와 타이머 간 여백 추가

      }}
    >
      <span style={{ fontSize: '14px', color: '#555' }}>
        남은 시간: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </span>
    </div>
  );
};

export default AttendanceTimer;