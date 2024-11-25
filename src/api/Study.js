import axios from 'axios';

export const fetchSchedule = async (id, studyId) => {
    try {
      const { data } = await axios.get(`http://3.36.118.29:8080/api/group/${id}/study/${studyId}`);
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
      const { data } = await axios.post(`http://3.36.118.29:8080/api/group/${id}/study`, ScheduleData);
      return data; // 서버 응답 데이터 반환
    } catch (error) {
      console.error('Error creating Schedule:', error);
      throw error; // 에러를 상위 호출로 전달
    }
  };

