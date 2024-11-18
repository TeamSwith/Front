import axios from 'axios';

export const fetchNotice = async () => {
    try {
        const { data } = await axios.get('http://localhost:8080/api/group/12');
        return data.notice;
      } catch (error) {
        console.error('Error fetching notice:', error);
        throw error;
      }
};

export const updateNotice = async (updatedNotice) => {
    try {
      const { data } = await axios.patch(
        'http://localhost:8080/api/group/12?notice=notice%20change',
        { notice: updatedNotice },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return data.notice;
    } catch (error) {
      console.error('Error updating notice:', error);
      throw error;
    }
  };