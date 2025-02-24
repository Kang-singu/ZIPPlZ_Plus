import { Navigate, Outlet } from 'react-router-dom';

import { useLoginUserStore } from '@stores/loginUserStore';

export default function GuardRoute() {
  const { isLogin } = useLoginUserStore();

  return isLogin ? <Outlet /> : <Navigate to="/member/login" />;
}
