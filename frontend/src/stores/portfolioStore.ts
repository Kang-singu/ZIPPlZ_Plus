import { create } from 'zustand';

export interface Portfolio {
  portfolioSerial: number;
  fieldId: {
    fieldCode: number;
    fieldName: string;
  };
}
export interface PortfolioDetail {
  portfolioSerial: number;
  publicRelation: string;
  career: number;
  asPeriod: number;
  workCount: number;
  user: {
    userName: string;
    tel: string;
    email: string;
    birthDate: string;
    fileSerial: number;
  };
  worker: {
    workerSerial: number;
    company: string;
    companyAddress: string;
    businessNumber: string;
    hasAsBadge: number;
    certificatedBadge: number;
  };
  localList: string[];
  userProfile: {
    fileSerial: number;
    saveFolder: string;
    originalFile: string;
    saveFile: string;
  };
  imageList: {
    userSerial: string | null;
    saveFile: string;
    fileSerial: number;
    saveFolder: string;
    originalFile: string;
    portfolioSerial: number;
  }[];
}
export interface WorkerDate {
  workSerial: number;
  workerSerial: number;
  fieldName: string;
  startDate: string;
  endDate: string;
}
interface DateDetail {
  workSerial: number;
  startDate: string;
  endDate: string;
  workPrice: number;
  workContent: string | null;
  planSerial: number;
  address: string;
  sharedContents: string | null;
  planImageList: {
    fileSerial: number;
    saveFolder: string;
    originalFile: string;
    saveFile: string;
  }[];
  customerName: string;
  nickname: string;
  fieldName: string;
}
interface Review {
  customerReviewSerial: number;
  customerNickname: string;
  customerReviewContent: string;
  customerReviewDate: string;
  isVisible: number;
  averageStar: number;
  reviewComment: string | null;
}
interface PortfolioReview {
  workerTemperature: number;
  workerName: string;
  averageCommunicationStar: number;
  averageAttitudeStar: number;
  averageQualityStar: number;
  averageProfessionalStar: number;
  reviewList: Review[];
}
interface GPTReview {
  goodReview: string;
  badReview: string;
}
interface usePortfolioStore {
  portfolioList: Portfolio[];
  portfolioOverview: PortfolioDetail | null;
  dateList: WorkerDate[];
  dateDetail: DateDetail | null;
  portfolioReview: PortfolioReview | null;
  gtpReview: GPTReview | null;
  setPortfolioList: (portfolioList: Portfolio[]) => void;
  setPortfolioOverview: (portfolioOverview: PortfolioDetail | null) => void;
  setDateList: (dateList: WorkerDate[]) => void;
  setDateDetail: (dateDetail: DateDetail) => void;
  setPortfolioReview: (portfolioReview: PortfolioReview) => void;
  setGptReview: (gtpReview: GPTReview) => void;
}
export const usePortfolioStore = create<usePortfolioStore>()((set) => ({
  portfolioList: [],
  portfolioOverview: null,
  dateList: [],
  dateDetail: null,
  portfolioReview: null,
  gtpReview: null,
  setPortfolioList: (portfolioList: Portfolio[]) => set({ portfolioList }),
  setPortfolioOverview: (portfolioOverview: PortfolioDetail | null) =>
    set({ portfolioOverview }),
  setDateList: (dateList: WorkerDate[]) => set({ dateList }),
  setDateDetail: (dateDetail: DateDetail) => set({ dateDetail }),
  setPortfolioReview: (portfolioReview: PortfolioReview) =>
    set({ portfolioReview }),
  setGptReview: (gtpReview: GPTReview) => set({ gtpReview }),
}));
