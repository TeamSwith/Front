import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // 백엔드 API URL

// 1. 스터디 생성 API 호출
export const createStudy = async (studyData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/group/create`, studyData);

    // 응답 데이터가 예상한 형식인지 확인
    if (!response || !response.data) { throw new Error("응답 데이터가 유효하지 않습니다."); }

    console.log('API 응답 데이터:', response.data);  // 응답 데이터 출력

    return response.data; // API 응답 데이터 반환
  } catch (error) {
    console.error("스터디 생성 실패:", error);
    throw error; // 오류 발생 시 에러를 던져서 호출한 곳에서 처리할 수 있게 함
  }
};

// 2. 스터디 ID 가져오기 API 호출
export const getStudyId = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/group/${id}/group_insert_id`);
      
      // 응답 데이터가 예상한 형식인지 확인
      if (!response || !response.data) { throw new Error("응답 데이터가 유효하지 않습니다."); }
  
      console.log('스터디 ID 가져오기 응답:', response.data);  // 응답 데이터 출력
  
      return response.data; // 응답으로 받은 groupInsertId 반환
    } catch (error) {
      console.error("스터디 ID 가져오기 실패:", error);
      throw error; // 오류 발생 시 에러를 던져서 호출한 곳에서 처리할 수 있게 함
    }
};

// 3. 스터디 세부 정보 입력해서 업데이트하는 API
export const updateStudyDetails = async (id, studyData) => {
    try {
      console.log('Request Data:', studyData);  // 요청 데이터 확인
      console.log('Request URL:', `${API_BASE_URL}/group/${id}/details`);
    
      const response = await axios.patch(`${API_BASE_URL}/group/${id}/details`, studyData);
      
      // 응답이 성공적인 경우, 응답 데이터 반환
      if (response.data.success) {
        return response.data; // 성공 시 응답 데이터 반환
      } else {
        throw new Error('스터디 정보 업데이트 실패');
      }
    } catch (error) {
      console.error('스터디 정보 업데이트 실패:', error);
      throw error;  // 오류 발생 시, 호출한 곳에서 처리하도록 에러 던짐
    }
};

// 4. 스터디 세부 정보를 조회하는 API
export const getStudyDetails = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/group/${id}/details`);
      if (response.data.success) {
        return response.data;  // 성공적으로 데이터를 반환
      } else {
        throw new Error('스터디 정보를 가져오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('스터디 세부 정보 요청 실패:', error);
      throw error;
    }
};