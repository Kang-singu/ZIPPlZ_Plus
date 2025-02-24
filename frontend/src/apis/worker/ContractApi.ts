import { END_POINT } from '@apis/apiConstants';
import { axiosInstance } from '@apis/axiosInstance';

export interface ContractRequestData {
  requestComment: string;
  startDate: string;
  endDate: string;
  workPrice: number;
  materialList: number[];
  chatroomSerial: number;
}

export const postContract = async (
  chatroomSerial: number,
  requestData: ContractRequestData
) => {
  if (!chatroomSerial) {
    throw new Error('chatroomSerial이 필요합니다.');
  }
  if (!requestData) {
    throw new Error('requestData가 필요합니다.');
  }

  try {
    const response = await axiosInstance.post(
      END_POINT.CONTRACT + `/draft/${chatroomSerial}`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('계약서 작성 중 에러가 발생했습니다:', error);
    throw new Error('계약서 초안 작성에 실패했습니다.');
  }
};

export const acceptContract = async (sender: number, receiver: number) => {
  try {
    const response = await axiosInstance.patch(
      END_POINT.CONTRACT + '/accept',
      {
        sender,
        receiver,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('계약수락 중 에러가 발생했습니다:', error);
    throw new Error('계약 수락에 실패했습니다.');
  }
};

export const rejectContract = async (sender: number, receiver: number) => {
  try {
    const response = await axiosInstance.patch(
      END_POINT.CONTRACT + '/reject',
      {
        sender,
        receiver,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('계약거절 중 에러가 발생했습니다:', error);
    throw new Error('계약 거절에 실패했습니다.');
  }
};
