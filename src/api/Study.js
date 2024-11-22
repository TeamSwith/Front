import axios from 'axios';

export const fetchSchedule = async (id, studyId, date, time, location) => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/group/${id}/study/${studyId}`, {
        params: { id, studyId },
        date,
        time,
        location,
      });
      return data;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  };

export const createSchedule = async ({ id, date, time, location }) => {
  try {
    const { data } = await axios.post(
      'http://localhost:8080/api/group/10/study',
      {
        date,
        time,
        location,
      }
    );
    return data;
  } catch (error) {
    console.error('Error creating study:', error);
    throw error;
  }
};

