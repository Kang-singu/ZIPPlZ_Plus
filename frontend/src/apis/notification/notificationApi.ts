import type { NotificationData } from '@/types';
import { END_POINT } from '@apis/apiConstants';
import { axiosInstance } from '@apis/axiosInstance';

export const getNotifications = async (
  user_serial: number
): Promise<NotificationData[] | undefined> => {
  if (!user_serial) {
    throw new Error('user_serial이 필요합니다.');
  }

  try {
    const response = await axiosInstance.post(
      END_POINT.NOTIFICATION + '/list',
      { user_serial },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('알림을 받아오는 중 에러가 발생했습니다.', error);
    throw new Error('알림을 받아오는 중 에러가 발생했습니다.');
  }
};
