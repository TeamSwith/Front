import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchNotice = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/group/${id}`);
  return response.data;
};

export const updateNotice = async (id, notice) => {
  const response = await axios.patch(
    `${API_BASE_URL}/group/${id}`,
    { message: notice }
  );
  return response.data;
  };