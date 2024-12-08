import { useState, useEffect } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill'; // polyfill import

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const koreanTime = new Date().toLocaleString('ko-KR', {
  timeZone: 'Asia/Seoul',
});

// useSubscribeSSE.js
function useSubscribeSSE (userId) {
const [alarmEvents, setAlarmEvents] = useState([]); // 알림 이벤트
const [attendanceEvents, setAttendanceEvents] = useState([]); // 출석 상태 업데이트 이벤트
const [noticeEvents, setNoticeEvents] = useState([]); // 공지사항 이벤트
const [token, setToken] = useState(localStorage.getItem('accessToken'));

  useEffect(() => {
    console.log('token:', token);
    const EventSource = EventSourcePolyfill;
    
    // EventSource 설정
    const eventSource = new EventSource(`${API_BASE_URL}/sse/connect/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      heartbeatTimeout: 600000, // 끊어지도록...
    });

    eventSource.onopen = () => { 
        console.log('SSE 연결 성공!'); 
        // 더미 데이터 전송. 첫 번째 이벤트 응답 없을 경우 방지.
        //eventSource.send(JSON.stringify({ message: 'start' }));
    };

    // 'Alarm' 이벤트 핸들러
    eventSource.addEventListener('Alarm', function (event) {
      try {
        const newEvent = JSON.parse(event.data);
        const { id, content, createdAt, groupId } = newEvent;
        // 알림 이벤트 상태에 추가
        setAlarmEvents((prevEvents) => [...prevEvents, { id, content, createdAt, groupId }]);
        console.log('새로운 일정 알림:', content);
      } catch (err) {
        console.error('Error parsing event data:', err);
      }
    });

    // 'Attend update' 이벤트 핸들러
    eventSource.addEventListener('Attend update', function (event) {
      try {
        const newEvent = JSON.parse(event.data);
        const { attendId, userId, groupId, studyId, attendStatus } = newEvent;
        setAttendanceEvents((prevEvents) => [
          ...prevEvents,
          { attendId, userId, groupId, studyId, attendStatus, createdAt: koreanTime, type: 'Attend update' },
        ]);
        console.log('출석 상태 업데이트:');
      } catch (err) {
        console.error('Error parsing Attend update event data:', err);
      }
    });

    // 'Notice' 이벤트 핸들러
    eventSource.addEventListener('Notice', function (event) {
      try {
        const content = event.data;
        setNoticeEvents((prevEvents) => [
          ...prevEvents,
          { content, createdAt: koreanTime, type: 'Notice' },
        ]);
        console.log('새로운 공지 등록');
      } catch (err) {
        console.error('Error handling Notice event:', err);
      }
    });


    eventSource.onerror = function(err) {
      console.error('EventSource failed:', err);
      if (err.target.readyState === EventSource.CLOSED) {
        console.log("EventSource connection was closed.");
      }
      console.log('error. SSE 연결 종료');
      eventSource.close();
    };

    // SSE 연결 종료는 컴포넌트가 언마운트되거나 로그인 상태가 바뀔 때 처리
    return () => {
      console.log('SSE 연결 종료');

      console.log('my user id:', userId);

      fetch(`${API_BASE_URL}/sse/cleanUserEmitter/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.text())  // 응답을 text로 처리
      .then((data) => {
        console.log(data);
      })
        .catch((err) => console.error('Emitter 삭제 실패:', err));

      eventSource.close();
    };
  }, []);

  return { alarmEvents, attendanceEvents, noticeEvents }; // 이벤트 배열을 반환 (연결만 관리할거면 null 반환)
};

export default useSubscribeSSE;