// 상세 응답 메시지
export interface ChatMessageData {
  userSerial: number;
  userName: string;
  chatMessageContent: string;
  createdAt: string;
  fileType:
    | 'IMAGE'
    | 'TALK'
    | 'FILE'
    | 'CONTRACT_ACCEPTED'
    | 'CONTRACT_REJECTED';
  file: {
    fileSerial: number;
    saveFolder: string;
    originalFile: string;
    saveFile: string;
    fileName: string;
  } | null;
  contract: boolean;
}

// 파일(type이 IMAGE 혹은 FILE 일 경우) 관련 데이터
export interface File {
  fileSerial: number;
  saveFolder: string;
  originalFile: string;
  saveFile: string;
  fileName: string;
}

// 채팅방 상대 정보
export interface OtherUser {
  name: string;
  location: string;
  fieldName: string;
  certificated: boolean;
  image: {
    fileSerial: number;
    saveFolder: string;
    originalFile: string;
    saveFile: string;
    fileName: string;
  } | null;
}

// 채팅방 목록 조회
export interface ChatRoom {
  chatroomSerial: string;
  lastMessage: string;
  fieldName: string;
  workerName: string;
  customerName: string;
  temperature: number;
  createdAt: string;
  unreadCount: number;
  certificated: boolean;
  file: {
    fileSerial: number;
    saveFolder: string;
    originalFile: string;
    saveFile: string;
    fileName: string;
  } | null;
}

// 채팅방 상세보기
export interface ChatRoomDetails {
  otherUser: {
    name: string;
    location: string;
    fieldName: string;
    certificated: boolean;
    userSerial: number;
    image: {
      fileSerial: number;
      saveFolder: string;
      originalFile: string;
      saveFile: string;
      fileName: string;
    } | null;
  };
  chatMessages: {
    userSerial: number;
    userName: string;
    chatMessageContent: string;
    createdAt: string;
    fileType:
      | 'IMAGE'
      | 'TALK'
      | 'FILE'
      | 'CONTRACT_ACCEPTED'
      | 'CONTRACT_REJECTED';
    file: {
      fileSerial: number;
      saveFolder: string;
      originalFile: string;
      saveFile: string | null;
      fileName: string;
    } | null;
  }[];
}

// 메시지 전송
export interface SendMessageReq {
  type: 'IMAGE' | 'TALK' | 'FILE' | 'CONTRACT';
  chatroomSerial: number;
  userSerial: number;
  chatMessageContent: string;
  isFile: boolean;
  originalFileName?: string;
  contract?: boolean;
}

// 자재 전체목록 조회
export interface Material {
  materialSerial: number;
  materialName: string;
  majorCategory: number;
  description: string;
  materialPrice: number;
  img: {
    fileSerial: number;
    saveFolder: string;
    originalFile: string;
    saveFile: string;
    fileName: string;
  };
  wished: boolean;
}

// 계약서 초안 생성 응답
export interface ContractPostRes {
  requestSerial: number;
  requestDate: string;
  requestType: 'add';
  senderName: string;
  receiverName: string;
  requestStatus: 'pending';
  requestComment: '계약서 초안 작성해서 보냅니다.';
}

// A/S 요청
export interface AfterServiceRequestData {
  requestContent: string;
}

// 알림 조회
export interface NotificationData {
  notificationSerial: number;
  userSerial: {
    userSerial: number;
    fileSerial: {
      fileSerial: number;
      saveFolder: null;
      originalFile: string;
      saveFile: string;
      fileName: string;
    };
    email: string;
    password: string;
    userName: string;
    birthDate: string;
    tel: string;
    delYN: number;
    role: string;
  };
  notificationComment: string;
  notificationDate: string;
  isChecked: number;
}
[];

export interface data {
  publicRelation: string;
  career: number;
  asPeriod: number;
  company: string;
  companyAddress: string;
  businessNumber: string;
}

export interface Plan {
  planSerial: number;
  planName: string;
  status: number;
}

export interface Field {
  fieldCode: number;
  fieldName: string;
}

export interface Work {
  workSerial?: number;
  startDate: string;
  endDate: string;
  field: string;
}
export interface TodayWork {
  workSerial: number;
  startDate: string;
  endDate: string;
  field: string;
  address: string;
  workerProfile: {
    fileSerial: number;
    saveFolder: string;
    originalFile: string;
    saveFile: string;
    fileName: string;
  };
  customerProfile: string;
  customer: {
    customerSerial: number;
    userSerial: {
      userSerial: number;
      fileSerial: number;
      email: string;
      password: string;
      userName: string;
      birthDate: string;
      tel: string;
      delYN: number;
      role: string;
    };
    nickname: string;
    currentAddress: string | null;
  };
  worker: {
    workerSerial: number;
    userSerial: {
      userSerial: number;
      fileSerial: {
        fileSerial: number;
        saveFolder: string;
        originalFile: string;
        saveFile: string;
        fileName: string | null;
      };
      email: string;
      password: string;
      userName: string;
      birthDate: string;
      tel: string;
      delYN: number;
      role: string;
    };
    company: string;
    companyAddress: string;
    businessNumber: string;
    hasAsBadge: number;
    certificatedBadge: number;
  };
}

export interface HotWorker {
  name: string;
  region: string;
  field: string;
  temp: string;
}

export interface WorkerInfo {
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
  portfolio_serial: number;
  name: string;
  birth_date: number;
  temp: number;
  field_id: number;
  field_name: string;
  career: number;
  certificated_badge: number;
  locations: string[];
  img: string;
  user_name: string;
}

export interface Reply {
  id: number;
  profilePic: string;
  name: string;
  date: string;
  content: string;
}

export interface Comment {
  id: number;
  profilePic: string;
  name: string;
  rating: number;
  date: string;
  content: string;
  replies: {
    id: number;
    profilePic: string;
    name: string;
    date: string;
    content: string;
  }[];
}

export interface Review {
  reviewContent: string;
  communicationStar: number;
  attitudeStar: number;
  qualityStar: number;
  professionalStar: number;
  isVisible: number;
}

export interface HousePost {
  post_serial: number;
  post_image: string | null;
  title: string;
  profile_image: string | null;
  nickname: string;
  upload_date: Date;
  view_cnt: number;
  bookmark_cnt: number;
  comment_cnt: number;
}

export interface ReviewComment {
  userName: string;
  userSerial: number;
  boardSerial: number;
  commentSerial: number;
  parentCommentSerial: number;
  commentContent: string;
  commentDate: string;
  orderNumber: number;
  isDeleted: number;
  nickName?: string | null;
  saveFile: string;
}

export interface Event {
  title: string;
  start: Date;
  end: Date;
  workSerial?: number;
}

export interface Contract {
  workerName: string;
  company: string;
  businessNumber: string;
  workerTel: string;
  customerName: string;
  customerTel: string;
  address: string;
  startDate: string;
  endDate: string;
  workPrice: number;
  fieldName: string;
  asPeriod: number;
  materialList: string[];
}
