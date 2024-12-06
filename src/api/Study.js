import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeader = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('로그인된 사용자가 아닙니다. 액세스 토큰이 없습니다.');
  }
  return { Authorization: `Bearer ${accessToken}` };
};

export const fetchSchedule = async (id, date) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/group/${id}/study/${date}`, {
        headers: getAuthHeader(), // authorazation 전달
      });
      if (!data.success || !data.data) {
        return { success: false, data: { time: '', location: '' } };
      }
      return data;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      return { success: false, data: { time: '', location: '' } };
    }
  };

  export const createSchedule = async (id, ScheduleData) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/group/${id}/study`, ScheduleData, {
        headers: getAuthHeader(), // Authorization 헤더 추가
      });
      return data; // 서버 응답 데이터 반환
    } catch (error) {
      console.error('Error creating Schedule:', error);
      throw error; // 에러를 상위 호출로 전달
    }
  };

export const editSchedule = async (id, studyId, updatedSchedule) => {
  try {
    const { data } = await axios.patch(
      `${API_BASE_URL}/group/${id}/study/${studyId}`,
      updatedSchedule, {
        headers: getAuthHeader(), // Authorization 헤더 추가
      }
    );

    if (!data.success) {
      throw new Error('스터디 일정 수정에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error('Error editing schedule:', error);
    throw error; // 에러를 상위로 전달
  }
};

export const deleteSchedule = async (id, studyId, updatedSchedule) => {
  try {
    const { data } = await axios.delete(
      `${API_BASE_URL}/group/${id}/study/${studyId}`, {
        headers: getAuthHeader(), // Authorization 헤더 추가
      }
    );

    if (!data.success) {
      throw new Error('스터디 일정 삭제에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error; // 에러를 상위로 전달
  }
};

  export const getMemNum = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/group/${id}/getMem`, {
      headers: getAuthHeader(), // Authorization 헤더 추가
    });
    return response.data.data;
  };

  export const fetchGroupUsers = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user-group/${id}/users`);
      return response.data;

    } catch (error) {
      console.error('API 호출 오류:', error);
      throw error;
    }
  };

  export const updateAttendStatus = async (id, studyId) => {
    try {
      const { data } = await axios.patch(
        `${API_BASE_URL}/group/${id}/study/${studyId}/attend`,
        {},
        {
          headers: getAuthHeader(), // Authorization 헤더 추가
        }
      );
  
      // 정상적인 응답인 경우
      if (data.success) {
        return {
          success: true,
          message: `출석 완료되었습니다!`,
          data: data.data,
        };
      }
  
      // 이미 출석한 경우 처리
      if (data.status === 404) {
        return {
          success: false,
          message: "이미 출석하셨습니다.",
        };
      }
  
      // 그 외의 실패 처리
      return {
        success: false,
        message: '출석 상태 변경 실패',
      };
    } catch (error) {
      console.error('Error updating attend status:', error);
      return {
        success: false,
        message: '이미 출석하셨습니다.',
      };
    }
  };