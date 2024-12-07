import React, { useState, useEffect } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill'; // polyfill import

// useSubscribeSSE.js
function useSubscribeSSE () {
  const [events, setEvents] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  useEffect(() => {
    if (!token) { console.log('Access token is missing!'); return; }
    
    const EventSource = EventSourcePolyfill;
    
    // EventSource 설정
    const eventSource = new EventSource('https://swithweb.com/api/sse/connect', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      heartbeatTimeout: 30000, // 끊어지도록...
    });

    eventSource.onopen = () => { 
        console.log('SSE 연결 성공!'); 
        // 더미 데이터 전송. 첫 번째 이벤트 응답 없을 경우 방지.
        eventSource.send(JSON.stringify({ message: 'start' }));
    };

    // 'Alarm' 이벤트 핸들러
    eventSource.addEventListener('Alarm', function(event) {
        try {
          const newEvent = JSON.parse(event.data);
          const { id, content, createdAt, groupId } = newEvent; // 데이터 구조에 맞게 수정
          // 데이터를 상태에 추가
          setEvents(prevEvents => [...prevEvents, { id, content, createdAt, groupId }]);
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
          setEvents((prevEvents) => [
            ...prevEvents,
            { attendId, userId, groupId, studyId, attendStatus, createdAt: new Date().toISOString(), type: 'Attend update' },
          ]);
          console.log('출석 상태 업데이트:');
        } catch (err) {
          console.error('Error parsing Attend update event data:', err);
        }
    });
  
    // 'Notice' 이벤트 핸들러
    eventSource.addEventListener('Notice', function (event) {
        try {
          // event.data가 공지 내용
          const content = event.data;
  
          // Notice 데이터를 상태에 추가
          setEvents((prevEvents) => [
            ...prevEvents,
            { content, createdAt: new Date().toISOString(), type: 'Notice' },
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
      eventSource.close();
    };
  }, [token]);

  return events; // 이벤트 배열을 반환 (연결만 관리할거면 null 반환)
};

export default useSubscribeSSE;