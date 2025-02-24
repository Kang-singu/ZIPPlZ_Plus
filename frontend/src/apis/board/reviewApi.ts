import { END_POINT } from '../apiConstants';
import { axiosInstance } from '../axiosInstance';

interface Comment {
  board_serial: number;
  comment_content: string;
  parent_comment_serial: number;
  order_number: number;
}
//리뷰 작성
export const writeReview = async (data: Comment) => {
  return await axiosInstance.post(END_POINT.COMMENT + '/add', data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
//리뷰 삭제
export const deleteReview = async (commentSerial: number) => {
  return await axiosInstance.delete(
    END_POINT.COMMENT + '/delete' + `/${commentSerial}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};
