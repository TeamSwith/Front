import api from '../api';  // `axios`를 직접 import할 필요 없이, api 인스턴스를 import

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // 백엔드 API URL

// 스터디 가입 여부 확인
export const checkStudyJoin = async (groupInsertId, groupPw) => {
  try {
    const response = await api.post(`${API_BASE_URL}/group/join`, { groupInsertId, groupPw });
    console.log(response); 

    return response;

    } catch (error) {
      console.error('스터디 그룹 가입 오류:', error);
      throw error;
    }
};

export const joinStudy = async (groupId) => {
    try {
      const response = await api.post(`${API_BASE_URL}/user-group/create`, { groupId });
      return response; // API 응답을 반환
    } catch (error) {
      throw new Error('스터디 가입에 실패했습니다. 다시 시도해주세요.');
    }
};