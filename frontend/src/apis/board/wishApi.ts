import { END_POINT } from '../apiConstants';
import { axiosInstance } from '../axiosInstance';

export const addWish = async (boardSerial: number, type: number) => {
  return await axiosInstance.post(
    END_POINT.WISH + '/addWish',
    { wish_serial: boardSerial, wish_type: type },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};

export const getWish = async (boardSerial: number) => {
  return await axiosInstance.post(
    END_POINT.WISH + '/searchWish',
    { wish_serial: boardSerial },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};
export const cancelWish = async (boardSerial: number, type: number) => {
  return await axiosInstance.delete(END_POINT.WISH + '/deleteWish', {
    data: {
      wish_serial: boardSerial,
      wish_type: type,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
