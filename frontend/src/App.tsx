import { MagnifyingGlass, Radio } from 'react-loader-spinner';
import { Navigate, Route, Routes } from 'react-router-dom';

import Layout from '@components/layout/Layout';
import loadable from '@loadable/component';
import GuardRoute from '@router/GuardRoute';

import WatchImage from './pages/common/home/WatchImage';

const Custom404 = loadable(() => import('@pages/common/404'), {
  fallback: <div>Loading...</div>,
});
const ChatRoom = loadable(() => import('@pages/common/chat/ChatRoom'), {
  fallback: <div>Loading chat room...</div>,
});
const Community = loadable(() => import('@pages/common/community/HousePost'), {
  fallback: <div>Loading community...</div>,
});
const Home = loadable(() => import('@pages/common/home/Home'), {
  fallback: <div>Loading home...</div>,
});
const MyInformationModify = loadable(
  () => import('@pages/common/mypage/MyInformationModify'),
  {
    fallback: <div>Loading...</div>,
  }
);
const MyPage = loadable(() => import('@pages/common/mypage/MyPage'), {
  fallback: <div>Loading my page...</div>,
});
const MyPasswordModify = loadable(
  () => import('@pages/common/mypage/MyPasswordModify'),
  {
    fallback: <div>Loading...</div>,
  }
);
const MyScrapList = loadable(() => import('@pages/common/mypage/MyScrapList'), {
  fallback: <div>Loading...</div>,
});
const Policy = loadable(() => import('@pages/common/mypage/Policy'), {
  fallback: <div>Loading policy...</div>,
});
const Version = loadable(() => import('@pages/common/mypage/Version'), {
  fallback: <div>Loading version...</div>,
});
const WishWorkerList = loadable(
  () => import('@pages/common/mypage/WishWorkerList'),
  {
    fallback: <div>Loading wish worker list...</div>,
  }
);
const MyFindWorkerList = loadable(
  () => import('@pages/common/mypage/postpage/MyFindWorkerList'),
  {
    fallback: <div>Loading find worker list...</div>,
  }
);
const BeforeResign = loadable(
  () => import('@pages/common/mypage/resignpage/BeforeResign'),
  {
    fallback: <div>Loading before resign...</div>,
  }
);
const DontUseZIPPLZ = loadable(
  () => import('@pages/common/mypage/resignpage/DontUseZIPPLZ'),
  {
    fallback: <div>Loading...</div>,
  }
);
const Resign = loadable(
  () => import('@pages/common/mypage/resignpage/Resign'),
  {
    fallback: <div>Loading...</div>,
  }
);
const ResignComplete = loadable(
  () => import('@pages/common/mypage/resignpage/ResignComplete'),
  {
    fallback: <div>Loading...</div>,
  }
);
const MyFindWorkerScrapList = loadable(
  () => import('@pages/common/mypage/scrappage/MyFindWorkerScrapList'),
  {
    fallback: <div>Loading...</div>,
  }
);
const FindWorkerDetail = loadable(
  () => import('@pages/common/workerinfo/FindWorkerDetail'),
  {
    fallback: <div>Loading worker details...</div>,
  }
);
const FindWorkerDetailCreate = loadable(
  () => import('@pages/common/workerinfo/FindWorkerDetailCreate'),
  {
    fallback: <div>Loading worker detail creation...</div>,
  }
);
const Schedule = loadable(() => import('@pages/user/Schedule'), {
  fallback: <div>Loading schedule...</div>,
});
const Portfolio = loadable(() => import('@pages/worker/Portfolio'), {
  fallback: <div>Loading portfolio...</div>,
});

const ContractPage = loadable(() => import('./pages/common/ContractPage'), {
  fallback: <div>Loading contract page...</div>,
});
const HousePost = loadable(() => import('./pages/common/community/HousePost'), {
  fallback: <div>Loading house post...</div>,
});
const HousePostCreate = loadable(
  () => import('./pages/common/community/HousePostCreate'),
  {
    fallback: <div>Loading house post creation...</div>,
  }
);
const HousePostDetail = loadable(
  () => import('./pages/common/community/HousePostDetail'),
  {
    fallback: <div>Loading house post details...</div>,
  }
);
const HousePostUpdate = loadable(
  () => import('./pages/common/community/HousePostUpdate'),
  {
    fallback: <div>Loading house post update...</div>,
  }
);
const QuestionPost = loadable(
  () => import('./pages/common/community/QuestionPost'),
  {
    fallback: (
      <div className="flex items-center justify-center">
        <MagnifyingGlass
          visible={true}
          height="80"
          width="80"
          ariaLabel="magnifying-glass-loading"
          wrapperStyle={{}}
          wrapperClass="magnifying-glass-wrapper"
          glassColor="#c0efff"
          color="#e15b64"
        />
      </div>
    ),
  }
);
const QuestionPostCreate = loadable(
  () => import('./pages/common/community/QuestionPostCreate'),
  {
    fallback: (
      <div className="flex items-center justify-center">
        <Radio
          visible={true}
          height="80"
          width="80"
          ariaLabel="radio-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    ),
  }
);
const QuestionPostDetail = loadable(
  () => import('./pages/common/community/QuestionPostDetail'),
  {
    fallback: (
      <div className="flex items-center justify-center">
        <Radio
          visible={true}
          height="80"
          width="80"
          ariaLabel="radio-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    ),
  }
);
const QuestionPostUpdate = loadable(
  () => import('./pages/common/community/QuestionPostUpdate'),
  {
    fallback: (
      <div className="flex items-center justify-center">
        <Radio
          visible={true}
          height="80"
          width="80"
          ariaLabel="radio-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    ),
  }
);
const Login = loadable(() => import('./pages/common/login/LogIn'), {
  fallback: <div>Loading login...</div>,
});
const SocialLoginCheck = loadable(
  () => import('./pages/common/login/SocialLoginCheck'),
  {
    fallback: <div>Loading social login check...</div>,
  }
);
const FindIdPw = loadable(() => import('./pages/common/login/find/FindIdPw'), {
  fallback: <div>Loading find ID/PW...</div>,
});
const WorkerInfoLocationDetail = loadable(
  () => import('./pages/common/mypage/WorkerInfoLocationDetail'),
  {
    fallback: <div>Loading worker info location details...</div>,
  }
);
const MyHousePostList = loadable(
  () => import('./pages/common/mypage/postpage/MyHousePostList'),
  {
    fallback: (
      <div className="flex items-center justify-center">
        <MagnifyingGlass
          visible={true}
          height="80"
          width="80"
          ariaLabel="magnifying-glass-loading"
          wrapperStyle={{}}
          wrapperClass="magnifying-glass-wrapper"
          glassColor="#c0efff"
          color="#e15b64"
        />
      </div>
    ),
  }
);
const MyQuestionPostList = loadable(
  () => import('./pages/common/mypage/postpage/MyQuestionPostList'),
  {
    fallback: (
      <div className="flex items-center justify-center">
        <MagnifyingGlass
          visible={true}
          height="80"
          width="80"
          ariaLabel="magnifying-glass-loading"
          wrapperStyle={{}}
          wrapperClass="magnifying-glass-wrapper"
          glassColor="#c0efff"
          color="#e15b64"
        />
      </div>
    ),
  }
);
const RoughWorker = loadable(
  () => import('./pages/common/mypage/resignpage/RoughWorker'),
  {
    fallback: <div>Loading rough worker...</div>,
  }
);
const MyHousePostScrapList = loadable(
  () => import('./pages/common/mypage/scrappage/MyHousePostScrapList'),
  {
    fallback: (
      <div className="flex items-center justify-center">
        <MagnifyingGlass
          visible={true}
          height="80"
          width="80"
          ariaLabel="magnifying-glass-loading"
          wrapperStyle={{}}
          wrapperClass="magnifying-glass-wrapper"
          glassColor="#c0efff"
          color="#e15b64"
        />
      </div>
    ),
  }
);
const MyQuestionPostScrapList = loadable(
  () => import('./pages/common/mypage/scrappage/MyQuestionPostScrapList'),
  {
    fallback: (
      <div className="flex items-center justify-center">
        <MagnifyingGlass
          visible={true}
          height="80"
          width="80"
          ariaLabel="magnifying-glass-loading"
          wrapperStyle={{}}
          wrapperClass="magnifying-glass-wrapper"
          glassColor="#c0efff"
          color="#e15b64"
        />
      </div>
    ),
  }
);
const SignUp = loadable(() => import('./pages/common/signup/SignUp'), {
  fallback: <div>Loading sign up...</div>,
});
const UpdateFindWorker = loadable(
  () => import('./pages/common/workerinfo/UpdateFindWorker'),
  {
    fallback: <div>Loading update find worker...</div>,
  }
);
const Workers = loadable(() => import('./pages/common/workerinfo/Workers'), {
  fallback: <div>Loading workers...</div>,
});

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="my-change-image/:userSerial" element={<WatchImage />} />
        {/* 스케줄 & 계약서 */}
        <Route element={<GuardRoute />}>
          <Route path="schedule" element={<Schedule />} />
          <Route path="contract/:workserial" element={<ContractPage />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="chatrooms/:chatroomSerial" element={<ChatRoom />} />
          <Route
            path="workers/findworker/write"
            element={<FindWorkerDetailCreate />}
          />
          <Route
            path="workers/findworker/update/:boardSerial"
            element={<UpdateFindWorker />}
          />
        </Route>

        <Route path="community" element={<Community />} />
        <Route path="workers/:category" element={<Workers />} />
        <Route path="workers/findworker/:id" element={<FindWorkerDetail />} />
        <Route path="workers/:id/portfolio" element={<Portfolio />} />
        <Route path="housepost" element={<HousePost />} />
        <Route path="housepost/:id" element={<HousePostDetail />} />
        <Route path="questionpost" element={<QuestionPost />} />
        <Route path="questionpost/:id" element={<QuestionPostDetail />} />
        <Route element={<GuardRoute />}>
          <Route path="housepostcreate" element={<HousePostCreate />} />
          <Route path="housepostupdate/:boardSerial" element={<HousePostUpdate />} />
          <Route path="questionpostupdate" element={<QuestionPostUpdate />} />
          <Route path="questionpostcreate" element={<QuestionPostCreate />} />
          {/* 마이페이지 */}
          <Route
            path="mypage/MyFindWorkerList"
            element={<MyFindWorkerList />}
          />
          <Route path="mypage/myhousepostlist" element={<MyHousePostList />} />
          <Route
            path="mypage/Myquestionpostlist"
            element={<MyQuestionPostList />}
          />
          <Route
            path="mypage/myfindworkerscraplist"
            element={<MyFindWorkerScrapList />}
          />
          <Route
            path="mypage/Myhousepostscraplist"
            element={<MyHousePostScrapList />}
          />
          <Route
            path="mypage/Myquestionpostscraplist"
            element={<MyQuestionPostScrapList />}
          />
          <Route path="mypage/myscraplist" element={<MyScrapList />} />
          <Route
            path="mypage/myinformationmodify"
            element={<MyInformationModify />}
          />
          <Route
            path="mypage/workerinfolocationdetail"
            element={<WorkerInfoLocationDetail />}
          />
          <Route
            path="mypage/mypasswordmodify"
            element={<MyPasswordModify />}
          />
          <Route path="mypage/policy" element={<Policy />} />
          <Route path="mypage/resign" element={<Resign />} />
          <Route path="mypage/version" element={<Version />} />
          <Route path="mypage/resigncomplete" element={<ResignComplete />} />
          <Route path="mypage/beforeresign" element={<BeforeResign />} />
          <Route path="mypage/dontusezipplz" element={<DontUseZIPPLZ />} />
          <Route path="mypage/wishworkerlist" element={<WishWorkerList />} />
          <Route path="mypage/roughworker" element={<RoughWorker />} />
        </Route>
      </Route>
      {/* 로그인 회원가입 */}
      <Route path="/member/join/:type/:order/:phrase" element={<SignUp />} />
      <Route path="/member/login" element={<Login />} />
      <Route path="/member/find" element={<FindIdPw />} />
      <Route path="404" element={<Custom404 />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
      <Route path="success" element={<SocialLoginCheck />} />
    </Routes>
  );
}
