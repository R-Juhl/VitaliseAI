// useUserData.js
import { useQuery } from 'react-query';
import axios from 'axios';

const fetchUserData = async (userId) => {
  const { data } = await axios.get(`your-api-endpoint/user/${userId}`);
  return data;
};

export const useUserData = (userId) => {
  return useQuery(['userData', userId], () => fetchUserData(userId));
};
