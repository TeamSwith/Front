import api from '../api';  // `axios`를 직접 import할 필요 없이, api 인스턴스를 import

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // 백엔드 API URL

// 1. 스터디 생성 API 호출
export const createStudy = async (studyData) => {
  try {
    const response = await api.post(`${API_BASE_URL}/group/create`, studyData);
    console.log('스터디 생성 응답:', response);

    // 응답 데이터가 예상한 형식인지 확인
    if (!response || !response.data) { throw new Error("응답 데이터가 유효하지 않습니다."); }

    console.log('스터디 생성 응답 데이터:', response.data);  // 응답 데이터 출력

    return response.data; // API 응답 데이터 반환
} catch (error) {
    // 에러가 발생하면 세부 정보를 콘솔에 출력
    if (error.response) {
      console.error("API 응답 오류:", error.response);
      // 응답 오류 코드와 메시지
      console.error("응답 코드:", error.response.status);
      console.error("응답 데이터:", error.response.data);
    } else if (error.request) {
      // 요청은 보냈지만 응답이 오지 않은 경우
      console.error("요청 오류:", error.request);
    } else {
      // 다른 종류의 오류
      console.error("일반 오류:", error.message);
    }
    throw error;
  }
};

// 2. 스터디 ID 가져오기 API 호출
export const getStudyId = async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/group/${id}/group_insert_id`);
      
      // 응답 데이터가 예상한 형식인지 확인
      if (!response || !response.data) { throw new Error("응답 데이터가 유효하지 않습니다."); }
  
      console.log('스터디 ID 가져오기 응답:', response.data);  // 응답 데이터 출력
  
      return response.data; // 응답으로 받은 groupInsertId 반환
    } catch (error) {
      console.error("스터디 ID 가져오기 실패:", error);
      throw error;
    }
};

// 3. 스터디 세부 정보 입력해서 업데이트하는 API
export const updateStudyDetails = async (id, studyData) => {
    try {
      console.log('Request Data:', studyData);  // 요청 데이터 확인
      console.log('Request URL:', `${API_BASE_URL}/group/${id}/details`);
    
      const response = await api.patch(`${API_BASE_URL}/group/${id}/details`, studyData);
      
      // 응답이 성공적인 경우, 응답 데이터 반환
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error('스터디 정보 업데이트 실패');
      }
    } catch (error) {
      console.error('스터디 정보 업데이트 실패:', error);
      throw error; 
    }
};

// 4. 스터디 세부 정보를 조회하는 API
export const getStudyDetails = async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/group/${id}/details`);
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error('스터디 정보를 가져오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('스터디 세부 정보 요청 실패:', error);
      throw error;
    }
};