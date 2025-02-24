import type { AfterServiceRequestData } from '@/types';
import { END_POINT } from '@apis/apiConstants';
import { axiosInstance } from '@apis/axiosInstance';

export const postAfterService = async (
  chatroomSerial: number,
  requestData: AfterServiceRequestData
) => {
  if (!chatroomSerial) {
    throw new Error('chatroomSerial이 필요합니다.');
  }
  if (!requestData) {
    throw new Error('requestData가 필요합니다.');
  }

  try {
    const response = await axiosInstance.post(
      END_POINT.AFTERSERVICE + `/${chatroomSerial}`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('A/S 요청서 작성 중 에러가 발생했습니다:', error);
    throw new Error('A/S 요청서 작성에 실패했습니다.');
  }
};
