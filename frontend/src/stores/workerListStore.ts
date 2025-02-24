import { create } from 'zustand';

export interface FindWorker {
  board_serial: number;
  board_type: number;
  user_serial: number;
  title: string;
  board_content: string;
  board_date: string;
  hit: number;
  nickname: string;
  user_name: string;
  comment_cnt: number;
  wish_cnt: number;
}
interface FIndWorker2 {
  title: string;
  userSerial: number;
  boardSerial: number;
  hit: number;
  nickname: string;
  userName: string;
  boardContent: string;
  boardDate: string;
  boardType: number;
}
interface File {
  fileName: string;
  saveFile: string;
  boardSerial: number;
  fileSerial: number;
  saveFolder: string;
  originalFile: string;
}
export interface Comment {
  userName: string;
  userSerial: number;
  boardSerial: number;
  commentSerial: number;
  parentCommentSerial: number;
  commentContent: string;
  commentDate: string;
  orderNumber: number;
  isDeleted: number;
  nickName: string | null;
  saveFile: string;
}
export interface FindWorkerDetail {
  board: FIndWorker2 | null;
  user_address: string;
  field_id: string;
  board_images: File[];
  comments: {
    parent_comment: Comment | null;
    child_comments: Comment[] | null;
  }[];
}
export interface WorkerList {
  portfolio_serial: number;
  worker: number;
  user_serial: number;
  user_name: string;
  birth_date: number;
  temperature: number;
  field_id: number;
  field_name: string;
  career: number;
  certificated_badge: number;
  locations: string[];
  img: string;
}
interface useWokerListStore {
  findWorker: FindWorkerDetail | null;
  findWorkerList: FindWorker[] | null;
  workerList: WorkerList[] | null;
  setFindWorker: (findWorker: FindWorkerDetail | null) => void;
  setFindWorkerList: (findWorkerList: FindWorker[] | null) => void;
  setWorkerList: (workerList: WorkerList[] | null) => void;
}

export const useWorkerListStore = create<useWokerListStore>((set) => ({
  findWorker: null,
  findWorkerList: null,
  workerList: null,
  setFindWorker: (findWorker: FindWorkerDetail | null) => set({ findWorker }),
  setFindWorkerList: (findWorkerList: FindWorker[] | null) =>
    set({ findWorkerList }),
  setWorkerList: (workerList: WorkerList[] | null) => set({ workerList }),
}));
