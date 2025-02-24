import { END_POINT } from '@apis/apiConstants';
import { axiosInstance } from '@apis/axiosInstance';

export interface Plan {
  planName: string;
  address: string;
  sharedContents: string;
}

export interface Work {
  fieldName: string;
  startDate?: string;
  endDate?: string;
  workPrice?: number;
}

export interface Review {
  reviewContent: string;
  communicationStar: number;
  attitudeStar: number;
  qualityStar: number;
  professionalStar: number;
  isVisible: number;
}
//계획 조회
export const getPlans = async () => {
  return await axiosInstance.get(END_POINT.PLAN, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
//계획 상세조회
export const getOnePlan = async (planSerial: number) => {
  return await axiosInstance.get(END_POINT.PLAN_SERIAL(planSerial), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
//계획 추가
export const addPlan = async (data: Plan) => {
  return await axiosInstance.post(END_POINT.PLAN, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

//계획 수정
export const modifyPlan = async (planSerial: number, data: Plan) => {
  return await axiosInstance.patch(END_POINT.PLAN_SERIAL(planSerial), data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

//계획 삭제
export const deletePlan = async (planSerial: number) => {
  return await axiosInstance.delete(END_POINT.PLAN_SERIAL(planSerial), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
//계획 활성화
export const activePlan = async (planSerial: number) => {
  return await axiosInstance.patch(
    END_POINT.PLAN_SERIAL(planSerial) + '/activate',
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};
//공정 목록 조회
export const getWorks = async (
  planSerial: number,
  pgno: number,
  spp: number
) => {
  return await axiosInstance.get(END_POINT.WORK(planSerial), {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    params: {
      pgno: pgno,
      spp: spp,
    },
  });
};

//공정 추가
export const addWork = async (planSerial: number, data: Work) => {
  return await axiosInstance.post(END_POINT.WORK(planSerial), data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

//공정 수정
export const modifyWork = async (
  planSerial: number,
  workSerial: number,
  data: string
) => {
  return await axiosInstance.patch(
    END_POINT.WORK_SERIAL(planSerial, workSerial),
    { workContent: data },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};

//빈 공정 삭제
export const deleteWork = async (planSerial: number, workSerial: number) => {
  return await axiosInstance.delete(
    END_POINT.WORK_SERIAL(planSerial, workSerial),
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};
//총 견적 조회
export const getPrice = async (planSerial: number) => {
  return await axiosInstance.get(END_POINT.PLAN_SERIAL(planSerial) + '/price', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
//리뷰 작성
export const writeReview = async (
  planSerial: number,
  workSerial: number,
  data: Review
) => {
  return await axiosInstance.post(
    END_POINT.WORK_SERIAL(planSerial, workSerial) + '/review',
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};
//공유 이미지 업로드
export const addImg = async (planSerial: number, imageFile: File) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  return await axiosInstance.post(
    END_POINT.PLAN_SERIAL(planSerial) + '/image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};
//공유이미지 삭제
export const deleteImg = async (planSerial: number, fileSerial: number) => {
  return await axiosInstance.delete(
    END_POINT.PLAN_SERIAL(planSerial) + `/image/${fileSerial}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};
//유저별 공종 목록 조회
export const getWorksByUser = async () => {
  return await axiosInstance.get(END_POINT.WORKS_USERS, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
//유저별 시공중인 공종 조회
export const getTodayWork = async () => {
  return await axiosInstance.get('schedule/users/working', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
