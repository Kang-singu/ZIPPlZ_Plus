import { END_POINT } from '@apis/apiConstants';
import { axiosInstance } from '@apis/axiosInstance';

export const getMaterials = async () => {
  return await axiosInstance.get(END_POINT.MATERIAL);
};
