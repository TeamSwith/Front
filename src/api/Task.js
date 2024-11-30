import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeader = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('로그인된 사용자가 아닙니다. 액세스 토큰이 없습니다.');
    }
    return { Authorization: `Bearer ${accessToken}` };
  };

// 과제 생성
export const createTask = async (id, studyId, taskMessage) => {
    if (!taskMessage || taskMessage.trim() === "") {
        throw new Error("Task message cannot be empty");
    }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/group/${id}/study/${studyId}/create`,
      { message: taskMessage } ,
      {
        headers: getAuthHeader(), // Authorization 헤더 추가
      }
    );
    if (!response.data.success) {
      throw new Error('과제 생성에 실패했습니다.');
    }
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// 과제 가져오기
export const fetchTasks = async (id, studyId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/group/${id}/study/${studyId}/get`, {
        headers: getAuthHeader(), // Authorization 헤더 추가
      });
    if (!response.data.success) {
      throw new Error('과제 가져오기에 실패했습니다.');
    }
    return response.data.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// 과제 삭제
export const deleteTask = async (id, studyId, taskId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/group/${id}/study/${studyId}/${taskId}`, {
        headers: getAuthHeader(), // Authorization 헤더 추가
      });
    if (!response.data.success) {
      throw new Error('과제 삭제에 실패했습니다.');
    }
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// 과제 상태 업데이트
export const updateTaskStatus = async (taskId, taskStatus) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/usertasks/${taskId}`, {
      taskStatus,
    }, {
        headers: getAuthHeader(), // Authorization 헤더 추가
      });
    if (!response.data.success) {
      throw new Error('과제 상태 업데이트에 실패했습니다.');
    }
    return response.data;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};