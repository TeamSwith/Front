import React, { useState, useEffect } from 'react';

// alarmService.js
function useGetAlarm () {
  const [alerts, setAlerts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  useEffect(() => {
    
    const fetchAlerts = async () => {
      if (!token) {
        console.log('Access token is missing!');
        return;
      }

      try {
        const response = await fetch('https://swithweb.com/api/alarm', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include', // withCredentials 대체
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Alerts fetched:', data);

        // data가 배열인지 확인
        if (data.success && Array.isArray(data.data)) {
          // 기존 알림 목록에 새로 받은 알림을 추가
          setAlerts((prevAlerts) => [...prevAlerts, ...data.data]);
        } else {
          console.error('Fetched data is not an array:', data);
        }

      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts(); // 처음 API 호출

  }, [token]);

  return alerts; // 이벤트 배열을 반환
};

export default useGetAlarm;