import { useNavigate } from 'react-router-dom';

import { requestSocialLogin } from '@/apis/member/MemberApi';
import Button from '@/components/common/Button';
import { useLoginUserStore } from '@stores/loginUserStore';
import base64 from 'base-64';

export default function SocialLoginCheck() {
  const { setIsLogin, setLoginUser } = useLoginUserStore();
  const navigate = useNavigate();
  const login = async () => {
    try {
      const response = await requestSocialLogin();
      const authorizationHeader = response.headers.authorization;
      if (authorizationHeader) {
        let token: string = authorizationHeader.split(' ')[1];

        localStorage.setItem('token', token);
        let payload = token.substring(
          token.indexOf('.') + 1,
          token.lastIndexOf('.')
        );
        let dec = base64.decode(payload);
        let decodingInfoJson = JSON.parse(dec);
        setLoginUser({
          userSerial: decodingInfoJson.userSerial,
          userName: decodingInfoJson.userName,
          email: decodingInfoJson.email,
          role: decodingInfoJson.role,
        });
        setIsLogin(true);

        if (response.status === 200) {
          navigate('/');
        } else {
          alert('로그인 실패');
        }
      } else {
        console.error('Authorization header is missing');
        alert('로그인 실패: 서버 응답에 문제가 있습니다.');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="absolute top-0 left-0 flex items-center justify-center w-full min-h-screen bg-zp-light-gray">
        <div className="absolute flex items-center justify-center w-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <div className="w-[80%] p-6 flex bg-zp-white flex-col gap-6  border border-zp-main-color items-center rounded-zp-radius-big">
            <p className="font-bold text-zp-lg">로그인 성공</p>
            <pre className="text-center text-zp-md text-zp-gray">
              로그인에 성공하였습니다.{'\n'}버튼 클릭시 페이지가 이동됩니다.
            </pre>
            <Button
              buttonType="second"
              children="메인페이지로 이동하기"
              width="full"
              height={2}
              fontSize="sm"
              radius="btn"
              onClick={login}
            />
          </div>{' '}
        </div>
      </div>
    </>
  );
}
