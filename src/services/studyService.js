import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // 백엔드 API URL

// 스터디 생성 API 호출
export const createStudy = async (studyData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/group/create`, studyData);

    console.log('API 응답 데이터:', response.data);  // 응답 데이터 출력
    
    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error("스터디 생성 실패:", error);
    throw error; // 오류 발생 시 에러를 던져서 호출한 곳에서 처리할 수 있게 함
  }
};
