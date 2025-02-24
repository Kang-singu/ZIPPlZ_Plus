// export const BASE_URL: string = 'http://localhost:5000/';
export const BASE_URL: string = 'https://zipplz.site/api/';

export const END_POINT = {
  //로그인 회원가입
  USERS: 'users',
  LOGIN: 'users/login',
  SIGNUP: 'users/join',
  //기타
  DEFAULT: 'default',
  SIDO: 'default/sido',
  GUGUN: (sidocode: number) => `default/sido/${sidocode}`,

  //스케줄러
  PLAN: 'schedule/plans',
  PLAN_SERIAL: (planSerial: number) => `schedule/plans/${planSerial}`,
  WORK: (planSerial: number) => `schedule/plans/${planSerial}/works`,
  WORK_SERIAL: (planSerial: number, workSerial: number) =>
    `schedule/plans/${planSerial}/works/${workSerial}`,
  WORKS_USERS: 'schedule/users/works',
  WORKER_LIST: 'workerlist/portfolios',
  WORKER_LIST_SEARCH: (name: string) => `workerlist/portfolios/${name}`,

  FIND_WORKER_LIST: 'board/findworker',
  FIND_WORKER_BOARD: (boardSerial: number) =>
    `board/findworker/list/${boardSerial}`,

  PORTFOLIO: (serial: number) => `portfolio/${serial}`,
  PORTFOLIO_LIST: (serial: number) => `portfolio/list/${serial}`,
  PORTFOLIO_SERIAL: (portfolioSerial: number) => `portfolio/${portfolioSerial}`,
  PORTFOLIO_SCHEDULE: (workerSerial: number) =>
    `portfolio/schedule/${workerSerial}`,
  PORTFOLIO_REVIEW: (serial: number) => `portfolio/review/${serial}`,

  //자랑글
  HOUSEPOST: 'board/showoff',
  HOUSEPOST_LIST: 'board/showoff/list',

  COMMENT: 'comment',

  WISH: 'wish',
  MATERIAL: 'materials?category=',
  CONTRACT: 'contract',
  AFTERSERVICE: 'afterservice',
  NOTIFICATION: 'notification',
} as const;

export const HTTP_STATUS_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONTENT_TOO_LARGE: 413,
  INTERNAL_SERVER_ERROR: 500,
} as const;
