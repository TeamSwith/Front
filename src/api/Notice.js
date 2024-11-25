import axios from 'axios';

export const fetchNotice = async (id) => {
    try {
        const { data } = await axios.get(`http://3.36.118.29:8080/api/group/${id}`);
        return data;
      } catch (error) {
        console.error('Error fetching notice:', error);
        throw error;
      }
};

export const updateNotice = async (id, updatedNotice) => {
    try {
      const { data } = await axios.patch(
        `http://3.36.118.29:8080/api/group/${id}`,
        { notice: updatedNotice },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return data;
    } catch (error) {
      console.error('Error updating notice:', error);
      throw error;
    }
  };