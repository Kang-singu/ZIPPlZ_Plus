import { axiosInstance } from '../axiosInstance';

//채팅방 생성
export const makeChatRoom = async (serial: number, field: string) => {
  return await axiosInstance.post(
    'chatroom',
    { anotherUserSerial: serial, field: field },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};
//채팅방 조회
export const getChatRooms = async () => {
  return await axiosInstance.get('chatroom', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
