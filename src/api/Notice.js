import axios from 'axios';

export const fetchNotice = async (id) => {
  const response = await axios.get(`http://3.36.118.29:8080/api/group/${id}`);
  return response.data;
};

export const updateNotice = async (id, notice) => {
  const response = await axios.patch(
    `http://3.36.118.29:8080/api/group/${id}`,
    { message: notice }
  );
  return response.data;
  };