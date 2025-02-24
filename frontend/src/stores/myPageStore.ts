import axios from 'axios';
import { create } from 'zustand';

// const BASE_URL: string = 'http://localhost:5000/';
const BASE_URL: string = 'https://zipplz.site/api/';

interface WorkerPost {
  board_serial: number;
  board_type: number;
  user_serial: number;
  title: string;
  board_content: string;
  board_date: string;
  hit: number;
  nickname: string;
  comment_cnt: number;
  wish_cnt: number;
}

interface MyPageState {
  profileImg: string | null;
  name: string;
  nickname: string;
  role: string;
  phoneNumber: string;
  address: string;
  fetchMyPageData: () => Promise<void>;
  updateCustomerInfo: (
    tel: string,
    nickname: string,
    currentAddress: string
  ) => Promise<void>;
  updateWorkerInfo: (
    tel: string,
    locationList: { sidoCode: number; gugunCode: number; localName: string }[]
  ) => Promise<void>;
  uploadProfileImage: (file: File | Blob) => Promise<void>;
  deleteProfileImage: () => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; message?: string }>;
  fetchMyHousePostList: () => Promise<WorkerPost[]>;
  fetchMyQuestionPostList: () => Promise<WorkerPost[]>;
  fetchMyHousePostScrapList: () => Promise<WorkerPost[]>;
  fetchMyQuestionPostScrapList: () => Promise<WorkerPost[]>;
  fetchMyFindWorkerList: () => Promise<WorkerPost[]>;
  fetchMyFindWorkerScrapList: () => Promise<WorkerPost[]>;
}

export const useMyPageStore = create<MyPageState>((set) => ({
  profileImg: null,
  name: '',
  nickname: '',
  role: '',
  phoneNumber: '',
  address: '',
  fetchMyPageData: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${BASE_URL}mypage`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.proc.code === 200) {
        const data = response.data.data;
        set({
          profileImg: data.profileImg?.saveFile || null,
          name: data.name,
          nickname: data.nickname,
          role: data.role,
          phoneNumber: data.tel,
          address: data.currentAddress,
        });
      } else {
        console.error(
          'Failed to fetch MyPage data:',
          response.data.proc.message
        );
      }
    } catch (error) {
      console.error('Error fetching MyPage data:', error);
    }
  },

  updateCustomerInfo: async (
    tel: string,
    nickname: string,
    currentAddress: string
  ) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${BASE_URL}mypage/update-customer`,
        {
          tel,
          nickname,
          currentAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.proc.code === 200) {
        set({ nickname: nickname, phoneNumber: tel, address: currentAddress });
      } else {
        console.error('고객 정보 업데이트 실패:', response.data.proc.message);
      }
    } catch (error) {
      console.error('고객 정보 업데이트 중 오류 발생:', error);
    }
  },

  updateWorkerInfo: async (
    tel: string,
    locationList: { sidoCode: number; gugunCode: number; localName: string }[]
  ) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${BASE_URL}mypage/update-worker`,
        {
          tel,
          locationList,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.proc.code === 200) {
        set({ phoneNumber: tel });
      } else {
        console.error('시공자 정보 업데이트 실패:', response.data.proc.message);
      }
    } catch (error) {
      console.error('시공자 정보 업데이트 중 오류 발생:', error);
    }
  },

  uploadProfileImage: async (file: File | Blob) => {
    let formData = new FormData();

    if (file instanceof Blob) {
      formData.append('image', file);
    } else {
      formData.append('image', file);
    }

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${BASE_URL}mypage/profile-img`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.proc.code === 200) {
        const newProfileImgUrl = response.data.data?.profileImg?.saveFile || '';
        set({ profileImg: newProfileImgUrl });
      } else {
        console.error('프로필 이미지 업로드 실패:', response.data.proc.message);
      }
    } catch (error) {
      console.error('프로필 이미지 업로드 중 오류 발생:', error);
    }
  },

  deleteProfileImage: async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.delete(`${BASE_URL}mypage/profile-img`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.proc.code === 200) {
        set({ profileImg: null });
      } else {
        console.error('프로필 이미지 삭제 실패:', response.data.proc.message);
      }
    } catch (error) {
      console.error('프로필 이미지 삭제 중 오류 발생:', error);
    }
  },

  changePassword: async (newPassword: string) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${BASE_URL}mypage/change-pw`,
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.proc.code === 200) {
        return { success: true };
      } else {
        console.error('비밀번호 변경 실패:', response.data.proc.message);
        return { success: false, message: response.data.proc.message };
      }
    } catch (error) {
      console.error('비밀번호 변경 중 오류 발생:', error);
      return { success: false, message: '비밀번호 변경 중 오류 발생' };
    }
  },

  fetchMyHousePostList: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${BASE_URL}mypage/showboards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.proc.code === 200) {
        return response.data.data;
      } else {
        console.error(
          '내가 쓴 자랑글 목록을 가져오는데 실패했습니다:',
          response.data.proc.message
        );
        return [];
      }
    } catch (error) {
      console.error(
        '내가 쓴 자랑글 목록을 가져오는 중 오류가 발생했습니다:',
        error
      );
      return [];
    }
  },

  fetchMyQuestionPostList: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${BASE_URL}mypage/questions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.proc.code === 200) {
        return response.data.data;
      } else {
        console.error(
          '내가 쓴 질문글 목록을 가져오는데 실패했습니다:',
          response.data.proc.message
        );
        return [];
      }
    } catch (error) {
      console.error(
        '내가 쓴 질문글 목록을 가져오는 중 오류가 발생했습니다:',
        error
      );
      return [];
    }
  },

  fetchMyHousePostScrapList: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${BASE_URL}mypage/wish/showboards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.proc.code === 200) {
        return response.data.data;
      } else {
        console.error(
          '찜한 자랑글 목록을 가져오는데 실패했습니다:',
          response.data.proc.message
        );
        return [];
      }
    } catch (error) {
      console.error(
        '찜한 자랑글 목록을 가져오는 중 오류가 발생했습니다:',
        error
      );
      return [];
    }
  },

  fetchMyQuestionPostScrapList: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${BASE_URL}mypage/wish/questions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.proc.code === 200) {
        return response.data.data;
      } else {
        console.error(
          '찜한 질문글 목록을 가져오는데 실패했습니다:',
          response.data.proc.message
        );
        return [];
      }
    } catch (error) {
      console.error(
        '찜한 질문글 목록을 가져오는 중 오류가 발생했습니다:',
        error
      );
      return [];
    }
  },

  fetchMyFindWorkerList: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${BASE_URL}mypage/findworkers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.proc.code === 200) {
        return response.data.data;
      } else {
        console.error(
          '내가 쓴 구인구직글 목록을 가져오는데 실패했습니다:',
          response.data.proc.message
        );
        return [];
      }
    } catch (error) {
      console.error(
        '내가 쓴 구인구직글 목록을 가져오는 중 오류가 발생했습니다:',
        error
      );
      return [];
    }
  },

  fetchMyFindWorkerScrapList: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${BASE_URL}mypage/wish/findworkers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.proc.code === 200) {
        return response.data.data;
      } else {
        console.error(
          '찜한 구인구직글 목록을 가져오는데 실패했습니다:',
          response.data.proc.message
        );
        return [];
      }
    } catch (error) {
      console.error(
        '찜한 구인구직글 목록을 가져오는 중 오류가 발생했습니다:',
        error
      );
      return [];
    }
  },
}));
