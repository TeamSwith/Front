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
    });

    eventSource.onopen = () => { 
        console.log('SSE 연결 성공!'); 
        // 구독 요청을 서버에 전송 (예: 특정 이벤트 타입)
    };

    // 커스텀 이벤트 핸들러
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

    eventSource.onerror = function(err) {
      console.error('EventSource failed:', err);
      if (err.target.readyState === EventSource.CLOSED) {
        console.log("EventSource connection was closed.");
      }
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