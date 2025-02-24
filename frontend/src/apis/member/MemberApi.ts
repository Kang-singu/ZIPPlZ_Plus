import { END_POINT } from '@apis/apiConstants';
import { axiosInstance } from '@apis/axiosInstance';
import axios from 'axios';

export interface User {
  email: string;
  password: string;
  userName: string;
  birthDate: string;
  tel: string;
  del_yn?: number;
  file_serial?: number;
}

export interface Customer {
  userSerial: number;
  nickname: string;
}

interface Location {
  sidoCode: number;
  gugunCode: number;
  localName: string;
}

interface Field {
  fieldCode: number;
  fieldName: string;
}
interface Contract {
  requestComment: string;
  startDate: string;
  endDate: string;
  workPrice: number;
  materialList: number[];
}

export interface Worker {
  userSerial: number;
  locationList: Location[];
  fieldList: Field[];
  businessNumber: string | null;
  company: string;
  companyAddress: string;
}
export interface socialUser {
  userName: string;
  birthDate: string;
  tel: string;
}
//회원가입
export const signUp = async (data: User) => {
  return await axiosInstance.post(END_POINT.SIGNUP, data);
};

export const socialSignUp = async (data: socialUser) => {
  return await axiosInstance.put(END_POINT.SIGNUP + '/social', data, {
    withCredentials: true,
  });
};

export const signUpCustomer = async (data: Customer) => {
  return await axiosInstance.post(END_POINT.SIGNUP + '/customer', data);
};

export const signUpWorker = async (data: Worker) => {
  return await axiosInstance.post(END_POINT.SIGNUP + '/worker', data);
};
//이메일 중복 체크
export const checkEmail = async (data: { email: string }) => {
  return await axiosInstance.post(END_POINT.USERS + '/check-email', data);
};
const businessCheckKey: string =
  'FYe5VJ5eQCYFtTp8mfxpiyh3hycdocxUJ92AoOdMqcJCgoLrIh0WPw4LYUM7ZaCMIerxnC58Lh1DZa7915kXOQ==';
export const checkBusiness = async (data: string) => {
  return await axios.post(
    'https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=' +
      businessCheckKey,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};
//로그인
export const requestLogin = async (email: string, pw: string) => {
  const response = await axiosInstance.post(
    END_POINT.LOGIN,
    {},
    {
      // withCredentials: true,
      headers: {
        email: email,
        password: pw,
      },
    }
  );
  return response;
};
export const requestSocialLogin = async () => {
  return await axiosInstance.get(END_POINT.USERS + '/callback', {
    withCredentials: true,
  });
};
//Default
export const getSido = async () => {
  return await axiosInstance.get(END_POINT.SIDO);
};

export const getGugun = async (sidocode: number) => {
  return await axiosInstance.get(END_POINT.GUGUN(sidocode));
};

export const getFields = async () => {
  return await axiosInstance.get(END_POINT.DEFAULT + '/field');
};
//계약서 조회
export const getContract = async (workSerial: number) => {
  return await axiosInstance.get(`contract/${workSerial}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
//계약서 수정 요청
export const updateContract = async (
  chatRoomSerial: number,
  data: Contract
) => {
  return await axiosInstance.post(
    `contract/${chatRoomSerial}/modifyrequest`,
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
};
// //계약서 수정 메시지 요청

// export const sendUpdateContract = async (
//   chatRoomSerial: number,
//   data: string
// ) => {
//   return await axiosInstance.post(
//     `contract/${chatRoomSerial}/modifiedmessage`,
//     data,
//     {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//     }
//   );
// };
