import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeader = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('로그인된 사용자가 아닙니다. 액세스 토큰이 없습니다.');
  }
  return { Authorization: `Bearer ${accessToken}` };
};


export const fetchNotice = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/group/${id}/notice`, {
    headers: getAuthHeader(), // Authorization 헤더 추가
  });
  return response.data;
};

export const updateNotice = async (id, notice) => {
  const response = await axios.patch(
    `${API_BASE_URL}/group/${id}`,
    { message: notice }, {
      headers: getAuthHeader(), // Authorization 헤더 추가
    }
  );
  return response.data;
  };