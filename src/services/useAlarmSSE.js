import React, { useState, useEffect } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill'; // polyfill import

// alarmSSE.js
function useAlarmSSE () {
  const [alerts, setAlerts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  useEffect(() => {
    if (!token) {
      console.log('Access token is missing!');
      return;
    }

    // console.log("SSE 연결 시작");
    // console.log('token:',token);
    
    const EventSource = EventSourcePolyfill;
    
    // EventSource 설정
    const eventSource = new EventSource('https://swithweb.com/api/alarm', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    console.log('EventSource initialized:', eventSource);

    eventSource.onopen = () => { console.log('SSE 연결 성공!'); };

    // eventSource.onmessage = function(event) {
    //   try {
    //     console.log('Event received:', event);
    //     const newEvent = JSON.parse(event.data);
    //     setAlerts(prevAlerts => [...prevAlerts, newEvent]); // 이벤트 배열 업데이트
    //   } catch (err) {
    //     console.error('Error parsing event data:', err);
    //   }
    // };

    // 커스텀 이벤트 핸들러
    eventSource.addEventListener('Alarm', function(event) {
      try {
        const newEvent = JSON.parse(event.data);
        console.log('Alarm event received:', newEvent);
        setAlerts(prevAlerts => [...prevAlerts, newEvent]);
      } catch (err) {
        console.error('Error parsing event data:', err);
      }
    });

    eventSource.onerror = function(err) {
      console.error('EventSource failed:', err);
      // 여기에 서버의 상태나 응답을 로그로 추가하여 어떤 오류인지 파악할 수 있습니다.
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

  return alerts; // 이벤트 배열을 반환
};

export default useAlarmSSE;