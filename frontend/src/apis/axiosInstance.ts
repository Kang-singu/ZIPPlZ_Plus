import axios from 'axios';

import { BASE_URL } from './apiConstants';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,

  headers: {
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Credentials': 'true',
  },
  // withCredentials: true, //요청에 쿠키담기
});
