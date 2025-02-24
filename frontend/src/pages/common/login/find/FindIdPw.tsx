import { FaArrowLeft } from 'react-icons/fa6';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import FindId from './FindId';
import FindPw from './FindPw';

export default function FindIdPw() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type');

  return (
    <div className="flex flex-col w-full gap-6 p-6">
      <FaArrowLeft size={16} onClick={() => navigate('/member/login')} />
      <p className="mt-6 font-extrabold text-zp-3xl">FIND ID / PW</p>
      <div className="flex gap-5 mt-3">
        <NavLink
          to="?type=id"
          className={`p-1 ${
            type === 'id' ? 'border-b-8 border-zp-gray ' : ''
          } text-zp-xl font-extrabold cursor-pointer`}
        >
          아이디 찾기
        </NavLink>
        <NavLink
          to="?type=password"
          className={`p-1 ${
            type === 'password' ? 'border-b-8 border-zp-gray' : ''
          } text-zp-xl font-extrabold cursor-pointer`}
        >
          비밀번호 찾기
        </NavLink>
      </div>
      <div className="mt-6">
        {type === 'id' && <FindId />}
        {type === 'password' && <FindPw />}
      </div>
    </div>
  );
}
