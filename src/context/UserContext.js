import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserId } from '../services/commentService';

// Context 생성
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const updateUserId = await fetchUserId();
        setUserId(updateUserId); 
      } catch (error) {
        console.error('사용자 ID 불러오기 실패:', error);
      }
    };
    loadUserId();
  }, []);

  return (
    <UserContext.Provider value={userId}>
      {children}
    </UserContext.Provider>
  );
};

// Context 값 사용하는 커스텀 훅
export const useUserId = () => {
  return useContext(UserContext);
};