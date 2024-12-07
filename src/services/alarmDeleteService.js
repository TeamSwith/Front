import React, { useState, useEffect } from 'react';

// 알림을 삭제하는 훅
const useDeleteAlarm = () => {
    const [token, setToken] = useState(localStorage.getItem('accessToken'));
  
    const deleteAlarm = async (alarmId) => {
      if (!token) {
        console.log('Access token is missing!');
        return;
      }
  
      try {
        const response = await fetch(`https://swithweb.com/api/alarm/${alarmId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        console.log('Alarm deleted:', data);
        return data; // 삭제된 알림 정보 반환
      } catch (error) {
        console.error('Error deleting alarm:', error);
        return null; // 오류 발생 시 null 반환
      }
    };
  
    return deleteAlarm; // deleteAlarm 함수를 반환
  };
  
  export default useDeleteAlarm; // 두 훅을 함께 내보냄