import axios from 'axios';
import { create } from 'zustand';

// const BASE_URL: string = 'http://localhost:5000/';
const BASE_URL: string = 'https://zipplz.site/api/';
interface QuestionPost {
  board_serial: number;
  board_type: number;
  user_serial: number;
  title: string;
  nickname: string;
  board_date: string;
  hit: number;
  wish_cnt: number;
  comment_cnt: number;
  images: string[];
}

interface Comment {
  board_serial: number;
  comment_content: string;
  parent_comment_serial: number;
  order_number: number;
}

interface QuestionPostDetails {
  title: string;
  userSerial: number;
  boardSerial: number;
  nickname: string;
  boardContent: string;
  boardDate: string;
  images: { saveFile: string }[];
  comments: {
    parent_comment: {
      userName: string;
      userSerial: number;
      commentSerial: number;
      commentContent: string;
      commentDate: string;
      saveFile: string;
      nickName: string;
    };
    child_comments: {
      userName: string;
      userSerial: number;
      commentSerial: number;
      commentContent: string;
      commentDate: string;
      saveFile: string;
      nickName: string;
    }[];
  }[];
}

interface QuestionPostState {
  title: string;
  boardContent: string;
  images: File[];
  questionPosts: QuestionPost[];
  postDetails: QuestionPostDetails | null;
  setTitle: (title: string) => void;
  setBoardContent: (content: string) => void;
  setImages: (images: File[]) => void;
  fetchQuestionPosts: () => Promise<void>;
  fetchPostDetails: (id: number) => Promise<QuestionPostDetails | null>;
  createPost: (
    token: string,
    formData: FormData
  ) => Promise<{ code: number; message: string }>;
  updatePost: (
    token: string,
    id: number,
    formData: FormData
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
}

export const useQuestionPostStore = create<QuestionPostState>((set, get) => ({
  title: '',
  boardContent: '',
  images: [],
  questionPosts: [],
  postDetails: null,

  setTitle: (title) => set({ title }),
  setBoardContent: (boardContent) => set({ boardContent }),
  setImages: (images) => set({ images }),

  fetchQuestionPosts: async () => {
    try {
      const response = await axios.post(`${BASE_URL}board/question/list`);
      set({ questionPosts: response.data.data });
    } catch (error) {
      console.error('Failed to fetch question posts:', error);
    }
  },

  fetchPostDetails: async (id: number) => {
    try {
      const response = await axios.post(`${BASE_URL}board/question/list/${id}`);

      if (response.data.proc.code === 200) {
        const data = response.data.data;

        const postDetails: QuestionPostDetails = {
          title: data.board.title,
          userSerial: data.board.userSerial,
          boardSerial: data.board.boardSerial,
          nickname: data.board.nickname,
          boardContent: data.board.boardContent,
          boardDate: data.board.boardDate,
          images: data.board_images.map((img: any) => ({
            saveFile: img.saveFile,
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

        set({ postDetails });
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
        `${BASE_URL}board/question/add`,
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
        await get().fetchQuestionPosts();
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

  updatePost: async (token: string, id: number, formData: FormData) => {
    try {
      const hasNullImages = formData.get('images') === 'null';
      if (hasNullImages) {
        formData.delete('images');
        formData.append('images', '');
      }

      const response = await axios.patch(
        `${BASE_URL}board/question/list/${id}`,
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
        await get().fetchQuestionPosts();
      }
      return { code, message };
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
        await get().fetchQuestionPosts();
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
