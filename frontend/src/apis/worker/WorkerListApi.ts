// 포트폴리오 정보 API
import { END_POINT } from '@apis/apiConstants';
import { axiosInstance } from '@apis/axiosInstance';

interface Board {
  title: string;
  board_content: string;
  user_address: string;
  field_id: string;
}
interface FindWork {
  images: File[];
  title: string;
  board_content: string;
  user_address: string;
  field_id: string;
}

//시공자목록 가져오기
export const getWorkerList = async () => {
  return await axiosInstance.get(END_POINT.WORKER_LIST);
};
//분야별 시공자 목록 가져오기
export const getWorkerListByField = async (field: number) => {
  return await axiosInstance.get(END_POINT.WORKER_LIST + `/field/${field}`);
};
//시공자 검색
export const searchWorkerList = async (data: string) => {
  return await axiosInstance.get(END_POINT.WORKER_LIST + `/name/${data}`);
};
//인기시공자 가져오기
export const getTopWorkerList = async () => {
  return await axiosInstance.get(END_POINT.WORKER_LIST + '/top');
};
//구인구직글 목록 가져오기
export const getFindWorkerList = async () => {
  return await axiosInstance.post(END_POINT.FIND_WORKER_LIST + '/list');
};
//구인구직글 세부
export const getFIndWorkerDetail = async (boardSerial: number) => {
  return await axiosInstance.post(END_POINT.FIND_WORKER_BOARD(boardSerial));
};

//구인구직글 작성
export const writeFindWorker = async (data: FindWork) => {
  const formData = new FormData();
  data.images.forEach((image: File) => {
    formData.append('images', image);
  });
  formData.append('title', data.title);
  formData.append('board_content', data.board_content);
  formData.append('user_address', data.user_address);
  formData.append('field_id', data.field_id);

  return await axiosInstance.post(
    END_POINT.FIND_WORKER_LIST + '/add',
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};

//구인구직글 수정
export const updateFindWorker = async (boardSerial: number, data: Board) => {
  return await axiosInstance.patch(
    END_POINT.FIND_WORKER_BOARD(boardSerial),
    data
  );
};
//구인구직글 삭제
export const deleteFindWorker = async (boardSerial: number) => {
  return axiosInstance.delete(`board/delete/${boardSerial}`);
};
