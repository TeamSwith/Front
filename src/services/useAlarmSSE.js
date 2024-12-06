import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const alarmSSE = (token, onNewAlert) => {
  if (!token) return; // 토큰이 없으면 SSE 연결을 하지 않음

  const EventSource = EventSourcePolyfill || NativeEventSource;

  const eventSource = new EventSource(`${API_BASE_URL}/alarm`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  eventSource.onopen = () => {
  console.log("SSE 연결 성공");
};

  eventSource.onmessage = (event) => {
    const newAlert = JSON.parse(event.data); // 서버에서 온 데이터를 파싱
    onNewAlert(newAlert); // 새로운 알림이 오면 처리
  };

  eventSource.onerror = (error) => {
    console.error('SSE 오류:', error);
  };

  // 연결 종료는 직접 호출하는 방식으로 처리
  return eventSource;
};

export default alarmSSE;