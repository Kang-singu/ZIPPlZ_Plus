import Logo from '@assets/logo.svg?react';

export default function Footer() {
  return (
    <footer className="bottom-0 flex justify-center w-full pt-2 pb-3 bg-zp-sub-color max-[460px]:p-0 mb-16">
      <div className="w-full px-16">
        <ul className="flex flex-col pb-2 text-left text-zp-sm gap-y-1">
          <li className="flex items-center -ml-2 text-black-color">
            <Logo width={40} height={40} />
            <a
              target="_blank"
              href="https://hilarious-thrill-0f0.notion.site/a4da3704344f4704a25df7c6ba2100b4?pvs=4"
            >
              <strong className="text-zp-black text-zp-xs max-[460px]:text-zp-2xs">
                개인정보처리방침
              </strong>
            </a>
            &nbsp; &#124; &nbsp;
            <a
              target="_blank"
              href="https://hilarious-thrill-0f0.notion.site/9426295d13804c13989ba95a51397949?pvs=4"
              className="text-zp-black text-zp-xs max-[460px]:text-zp-2xs hover:underline"
            >
              이용약관
            </a>
          </li>
          <li className="mt-1 text-zp-xs text-zp-gray">
            <small className="text-zp-black">(주) </small>
            ZiPPlZ
          </li>
          <li className="font-bold text-zp-2xs max-[460px]:text-zp-3xs text-zp-black">
            대표자: 이가은 &nbsp;|&nbsp; 대표전화:
            <a href="tel:0702-0816" className="hover:underline">
              0702-0816
            </a>
          </li>
          <li className="text-zp-2xs max-[460px]:text-zp-3xs text-zp-gray">
            사업자등록번호:
            <span className="text-zp-2xs max-[460px]:text-zp-3xs text-zp-black">
              317-25-89091
            </span>
          </li>
          <li className="text-zp-2xs max-[460px]:text-zp-3xs text-zp-gray">
            이메일:
            <a
              href="mailto:zipplzService@gmail.com"
              className="hover:underline"
            >
              zipplzService@gmail.com
            </a>
          </li>
          <li className="text-zp-gray text-zp-2xs max-[460px]:text-zp-3xs text-pretty break-keep">
            찾아오시는 길: (06220)
            <a
              target="_blank"
              href="https://map.naver.com/p/search/%EC%84%9C%EC%9A%B8%20%EA%B0%95%EB%82%A8%EA%B5%AC%20%ED%85%8C%ED%97%A4%EB%9E%80%EB%A1%9C%20212/address/14141986.3655684,4509210.2683534,%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EA%B0%95%EB%82%A8%EA%B5%AC%20%ED%85%8C%ED%97%A4%EB%9E%80%EB%A1%9C%20212,new?c=18.00,0,0,0,dh&isCorrectAnswer=true"
              className="hover:underline"
            >
              서울특별시 강남구 언주로 508(역삼동 701번지)
            </a>
          </li>
          <li>
            <p className="text-zp-2xs max-[460px]:text-zp-3xs text-zp-light-gray">
              copyright &copy; 2024 All rights reserved by ZiPPlZ.
            </p>
          </li>
        </ul>
        {/*         <p className="w-full pt-3 text-left text-pretty text-zp-gray text-zp-3xs break-keep">
          ZiPPlZ는 인테리어 시공업자와 고객을 잇는 중개 플랫폼입니다. ZiPPlZ는
          시공업자와 고객 사이에 이루어지는 거래 내지 계약의 당사자가 아닙니다.
          ZiPPlZ 플랫폼을 통하여 계약한 일정, 이에 대한 A/S 등 시공업자의
          서비스에 관한 의무와 책임은 해당 서비스를 제공하는 시공업자에게
          있습니다.
        </p> */}
      </div>
    </footer>
  );
}
