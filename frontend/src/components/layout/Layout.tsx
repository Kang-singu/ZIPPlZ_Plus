import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import ChatRooms from '@components/chat/ChatRooms';
import FullModal from '@components/common/FullModal';
import ScrollToTopButton from '@components/common/ScrollToTopButton';
import BottomTab from '@components/layout/BottomTab';
import FloatingChatButton from '@components/layout/FloatingChatButton';
import Footer from '@components/layout/Footer';
import Header from '@components/layout/Header';
import { useCurrentModals, useModalActions } from '@stores/modalStore';

export default function Layout() {
  const location = useLocation();
  const path = location.pathname;

  const isChatRoomsPage = path.startsWith('/chatrooms');
  const is404Page = path === '/404';
  const currentModals = useCurrentModals();
  const { closeModal } = useModalActions();
  const isLoginPage = path === '/login';

  return (
    <Suspense>
      <div className="flex flex-col items-center justify-center w-full max-w-[600px] mx-auto ">
        <div className="relative flex flex-col w-full h-full bg-zp-light-beige">
          {!isChatRoomsPage && !is404Page && <Header />}
          <div
            style={{ height: `calc(100% - 64px)` }}
            className="flex-1 w-full justify-self-center"
          >
            <Outlet />
          </div>
          {!isChatRoomsPage && !is404Page && <FloatingChatButton />}
          {!isChatRoomsPage && !is404Page && <BottomTab />}
          {(path === '/' || path === '/mypage') && <Footer />}
        </div>
      </div>
      {currentModals.includes('chatRooms') && (
        <FullModal
          isOpen={currentModals.includes('chatRooms')}
          onRequestClose={() => closeModal('chatRooms')}
        >
          <ChatRooms />
        </FullModal>
      )}
      {!isLoginPage && !isChatRoomsPage && <ScrollToTopButton />}
    </Suspense>
  );
}
