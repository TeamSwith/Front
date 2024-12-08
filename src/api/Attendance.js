import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// 출석 상태 조회 API 함수
export const fetchAttendanceStatus = async (groupId, studyId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/group/${groupId}/study/${studyId}/attendStatus`);
    return response.data; // API 응답 데이터를 반환
  } catch (error) {
    console.error('출석 상태 조회 중 오류 발생:', error);
    throw error; // 오류를 호출자에게 전달
  }
};