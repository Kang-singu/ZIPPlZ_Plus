import axios from 'axios';
import { create } from 'zustand';

// const BASE_URL: string = 'http://localhost:5000/';
const BASE_URL: string = 'https://zipplz.site/api/';
interface HousePost {
  board_serial: number;
  board_type: number;
  user_serial: number;
  img: string;
  title: string;
  nickname: string;
  user_name: string;
  save_file: string;
  board_date: string;
  hit: number;
  wish_cnt: number;
  comment_cnt: number;
}

interface Comment {
  board_serial: number;
  comment_content: string;
  parent_comment_serial: number;
  order_number: number;
}

interface HousePostDetails {
  title: string;
  userSerial: number;
  boardSerial: number;
  nickname: string;
  userName: string;
  saveFile: string;
  boardContent: string;
  boardDate: string;
  boardType: number;
  images: { saveFile: string }[];
  tags: {
    worker: number;
    career: number;
    portfolio_serial: number;
    temperature: number;
    certificated_badge: number;
    user_name: string;
    field_name: string;
    birth_date: number;
    field_id: number;
  }[];
  comments: {
    parent_comment: {
      userName: string;
      userSerial: number;
      boardSerial: number;
      commentSerial: number;
      parentCommentSerial: number;
      commentContent: string;
      commentDate: string;
      saveFile: string;
      nickName: string;
      orderNumber: number;
      isDeleted: number;
    };
    child_comments: {
      userName: string;
      userSerial: number;
      boardSerial: number;
      commentSerial: number;
      parentCommentSerial: number;
      commentContent: string;
      commentDate: string;
      saveFile: string;
      nickName: string;
      orderNumber: number;
      isDeleted: number;
    }[];
  }[];
}

interface WorkerInfo {
  portfolio_serial: number;
  worker: number;
  user_name: string;
  birth_date: number;
  temperature: number;
  field_id: number;
  field_name: string;
  career: number;
  certificated_badge: number;
  locations: string[];
  img: string | null;
}

interface HousePostState {
  title: string;
  boardContent: string;
  images: File[];
  housePosts: HousePost[];
  postDetails: HousePostDetails | null;
  selectedWorkers: WorkerInfo[];
  setSelectedWorkers: (workers: WorkerInfo[]) => void;
  setTitle: (title: string) => void;
  setBoardContent: (content: string) => void;
  setImages: (images: File[]) => void;
  fetchHousePosts: () => Promise<void>;
  fetchPostDetails: (id: number) => Promise<HousePostDetails | null>;
  createPost: (
    token: string,
    formData: FormData
  ) => Promise<{ code: number; message: string }>;
  updatePost: (
    id: number,
    postData: {
      title: string;
      board_content: string;
      selectedWorkers?: { portfolio_serial: number; worker: number }[];
    }
  ) => Promise<{ code: number; message: string }>;
  deletePost: (
    token: string,
    id: number
  ) => Promise<{ code: number; message: string }>;
  addComment: (
    token: string,
    comment: Comment
  ) => Promise<{ code: number; message: string }>;
  addReply: (
    token: string,
    reply: Comment
  ) => Promise<{ code: number; message: string }>;
  deleteComment: (
    token: string,
    commentSerial: number
  ) => Promise<{ code: number; message: string }>;
  addWish: (
    token: string,
    wish_serial: number,
    wish_type: number
  ) => Promise<{ code: number; message: string }>;
  deleteWish: (
    token: string,
    wish_serial: number
  ) => Promise<{ code: number; message: string }>;
  searchWish: (
    token: string,
    wish_serial: number
  ) => Promise<{ code: number; wish_count: number }>;
  searchWorkers: (searchContent: string) => Promise<WorkerInfo[]>;
}

export const useHousePostStore = create<HousePostState>((set, get) => ({
  title: '',
  boardContent: '',
  images: [],
  housePosts: [],
  postDetails: null,
  selectedWorkers: [],
  setSelectedWorkers: (workers) => set({ selectedWorkers: workers }),

  setTitle: (title) => set({ title }),
  setBoardContent: (boardContent) => set({ boardContent }),
  setImages: (images) => set({ images }),

  fetchHousePosts: async () => {
    try {
      const response = await axios.post(`${BASE_URL}board/showoff/list`);
      set({ housePosts: response.data.data });
    } catch (error) {
      console.error('Failed to fetch house posts:', error);
    }
  },

  fetchPostDetails: async (id: number) => {
    try {
      const response = await axios.post(`${BASE_URL}board/showoff/list/${id}`);

      if (response.data.proc.code === 200) {
        const data = response.data.data;

        const postDetails: HousePostDetails = {
          title: data.board.title,
          userSerial: data.board.userSerial,
          boardSerial: data.board.boardSerial,
          nickname: data.board.nickname,
          userName: data.board.userName,
          saveFile: data.board.saveFile,
          boardContent: data.board.boardContent,
          boardDate: data.board.boardDate,
          boardType: data.board.boardType,
          images: data.board_images.map((img: any) => ({
            saveFile: img.saveFile,
          })),
          tags: data.tags.map((tag: any) => ({
            worker: tag.worker,
            career: tag.career,
            portfolio_serial: tag.portfolio_serial,
            temperature: tag.temperature,
            certificated_badge: tag.certificated_badge,
            user_name: tag.user_name,
            field_name: tag.field_name,
            birth_date: tag.birth_date,
            field_id: tag.field_id,
          })),
          comments: data.comments.map((comment: any) => ({
            parent_comment: {
              userName: comment.parent_comment.userName,
              userSerial: comment.parent_comment.userSerial,
              commentSerial: comment.parent_comment.commentSerial,
              commentContent: comment.parent_comment.commentContent,
              commentDate: comment.parent_comment.commentDate,
              saveFile: comment.parent_comment.saveFile,
              nickName: comment.parent_comment.nickName,
              boardSerial:comment.parent_comment.boardSerial,
              parentCommentSerial:comment.parent_comment.parentCommentSerial,
              orderNumber:comment.parent_comment.orderNumber,
              isDeleted: comment.parent_comment.isDeleted,
              
            },
            child_comments: comment.child_comments.map((child: any) => ({
              userName: child.userName,
              userSerial: child.userSerial,
              commentSerial: child.commentSerial,
              commentContent: child.commentContent,
              commentDate: child.commentDate,
              saveFile: child.saveFile,
              nickName: child.nickName,
            })),
          })),
        };

        set({
          postDetails,
          images: data.board_images.map((img: any) => img.saveFile),
          selectedWorkers: data.tags.map((tag: any) => ({
            portfolio_serial: tag.portfolio_serial,
            worker: tag.worker,
            user_name: tag.user_name,
            birth_date: tag.birth_date,
            temperature: tag.temperature,
            field_id: tag.field_id,
            field_name: tag.field_name,
            career: tag.career,
            certificated_badge: tag.certificated_badge,
            locations: [],
            img: null,
          })),
        });
        return postDetails;
      } else {
        console.error(
          'Failed to fetch post details:',
          response.data.proc.message
        );
        return null;
      }
    } catch (error) {
      console.error('Error fetching post details:', error);
      return null;
    }
  },

  createPost: async (token: string, formData: FormData) => {
    try {
      const hasNullImages = formData.get('images') === 'null';
      if (hasNullImages) {
        formData.delete('images');
        formData.append('images', '');
      }

      const response = await axios.post(
        `${BASE_URL}board/showoff/add`,
        formData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const { code, message } = response.data.proc;
      if (code === 200) {
        await get().fetchHousePosts();
      }
      return { code, message };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to create post:', error);
        console.error('Response data:', error.response?.data);
      }
      return { code: 500, message: '삽입 실패' };
    }
  },

  updatePost: async (
    id: number,
    postData: {
      title: string;
      board_content: string;
    }
  ) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}board/showoff/list/${id}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const { code, message } = response.data.proc;

      if (code === 200) {
        await get().fetchHousePosts();
        return { code, message };
      } else {
        console.error(`Update failed: ${message}`);
        return { code, message };
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to update post:', error);
        console.error('Response data:', error.response?.data);
      }
      return { code: 500, message: '수정 실패' };
    }
  },

  deletePost: async (token: string, id: number) => {
    try {
      const response = await axios.delete(`${BASE_URL}board/delete/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      const { code, message } = response.data.proc;
      if (code === 200) {
        await get().fetchHousePosts();
      }
      return { code, message };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to delete post:', error);
        console.error('Response data:', error.response?.data);
      }
      return { code: 500, message: '삭제 실패' };
    }
  },

  addComment: async (token: string, comment: Comment) => {
    try {
      const response = await axios.post(
        `${BASE_URL}comment/add`,
        { ...comment },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const { code, message } = response.data.proc;
      return { code, message };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to add comment:', error);
        console.error('Response data:', error.response?.data.proc);
      }
      return { code: 500, message: '댓글 삽입 실패' };
    }
  },

  addReply: async (token: string, reply: Comment) => {
    try {
      const response = await axios.post(
        `${BASE_URL}comment/add`,
        { ...reply },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const { code, message } = response.data.proc;
      return { code, message };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to add reply:', error);
        console.error('Response data:', error.response?.data.proc);
      }
      return { code: 500, message: '대댓글 삽입 실패' };
    }
  },

  deleteComment: async (
    token: string,
    commentSerial: number
  ): Promise<{ code: number; message: string }> => {
    try {
      const response = await axios.delete(
        `${BASE_URL}comment/delete/${commentSerial}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const { code, message } = response.data.proc;
      return { code, message };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to delete comment:', error);
        console.error('Response data:', error.response?.data);
      }
      return { code: 500, message: '댓글 삭제 실패' };
    }
  },

  searchWorkers: async (searchContent: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}board/find/findworker/${searchContent}`
      );

      if (response.data.proc.code === 200) {
        return response.data.data;
      } else {
        console.error('Worker search failed:', response.data.proc.message);
        return [];
      }
    } catch (error) {
      console.error('Error searching for workers:', error);
      return [];
    }
  },

  addWish: async (token, wish_serial, wish_type) => {
    try {
      const response = await axios.post(
        `${BASE_URL}wish/addWish`,
        { wish_serial, wish_type },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const { code, message } = response.data.proc;
      return { code, message };
    } catch (error) {
      console.error('Failed to add wish:', error);
      return { code: 500, message: '추가 실패' };
    }
  },

  deleteWish: async (token, wish_serial) => {
    try {
      const response = await axios.delete(`${BASE_URL}wish/deleteWish`, {
        headers: {
          Authorization: token,
        },
        data: { wish_serial },
      });
      const { code, message } = response.data.proc;
      return { code, message };
    } catch (error) {
      console.error('Failed to delete wish:', error);
      return { code: 500, message: '삭제 실패' };
    }
  },

  searchWish: async (token, wish_serial) => {
    try {
      const response = await axios.post(
        `${BASE_URL}wish/searchWish`,
        { wish_serial },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const { code } = response.data.proc;
      const wish_count = response.data.data;
      return { code, wish_count };
    } catch (error) {
      console.error('Failed to search wish:', error);
      return { code: 500, wish_count: 0 };
    }
  },
}));
