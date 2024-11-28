import api from '../api';  // `axios`를 직접 import할 필요 없이, api 인스턴스를 import

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // 백엔드 API URL

// 스터디 가입 여부 확인
export const checkStudyJoin = async (groupInsertId, groupPw) => {
  try {
    const response = await api.post(`${API_BASE_URL}/group/join`, { groupInsertId, groupPw });
    console.log(response); 
  
    // 가입 여부만 체크해서 success 값 반환
    if (response.data.message === "이미 가입되어 있음") {
        return { success: true }; // 이렇게 반환해야 맞게 나감
      } else {
        return { success: false }; // 이렇게 반환해야 맞게 나감
      }
    } catch (error) {
      console.error('스터디 그룹 가입 오류:', error);
      throw error;
    }
};

// // 스터디 가입하기 (groupId와 userId를 매핑테이블에 짝지어 저장)
// export const joinStudy = async (groupId) => {
//     try {
//       const response = await api.post(`${API_BASE_URL}/user-group/create`, { groupId });
//       return response.data;
//     } catch (error) {
//       console.error('스터디 그룹 가입 요청 오류:', error);
//       throw error;
//     }
//   };