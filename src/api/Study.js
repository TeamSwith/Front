import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchSchedule = async (id, date) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/group/${id}/study/${date}`);
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
      const { data } = await axios.post(`${API_BASE_URL}/group/${id}/study`, ScheduleData);
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
      updatedSchedule
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

  export const getMemNum = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/group/${id}/getMem`);
    return response.data;
  };

