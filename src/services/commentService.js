import api from '../api';  // `axios`를 직접 import할 필요 없이, api 인스턴스를 import

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // 백엔드 API URL

// 댓글 생성 함수
export const createComment = async (studyId, userId, groupId, content) => {
  try {
    const response = await api.post(`${API_BASE_URL}/comments/${studyId}/${userId}/${groupId}`, {
      content, // 댓글
    });
    return response.data;
  } catch (error) {
    console.error('댓글 생성 실패:', error);
    throw error; // 에러 처리
  }
};

// 댓글 수정 함수
export const updateComment = async (commentId, content) => {
    try {
      const response = await api.put(`${API_BASE_URL}/comments/${commentId}`, {
        content, // 수정할 댓글 내용
      });
      return response.data; // 응답 데이터 반환
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      throw error; // 에러 처리
    }
};

// 댓글 삭제 함수
export const deleteComment = async (commentId) => {
    try {
      const response = await api.delete(`${API_BASE_URL}/comments/${commentId}`);
      return response.data; // 응답 데이터 반환
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      throw error; // 에러 처리
    }
};

// 댓글 조회 함수
export const fetchComments = async (studyId) => {
    try {
      const response = await api.get(`${API_BASE_URL}/comments/${studyId}`);
      return response.data; // 응답 데이터 반환
    } catch (error) {
      // console.error('댓글 조회 실패:', error);
      throw error; // 에러 처리
    }
};

// 사용자 닉네임 조회로 userId 가져오기
export const fetchUserId = async () => {
    try {
      const response = await api.get(`${API_BASE_URL}/users/me/nickname`);
      return response.data.data.userId; // userId만 반환
    } catch (error) {
      console.error('userId 불러오기 실패:', error);
      throw error;
    }
};