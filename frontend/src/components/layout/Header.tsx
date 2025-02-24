import { useState } from 'react';
import { FaRegBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import Logo from '@assets/logo.svg?react';
import Button from '@components/common/Button';
import FullModal from '@components/common/FullModal';
import NotificationModal from '@components/notification/NotificationModal';

export default function Header() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenNotification = () => {
    setIsNotificationOpen(true);
  };

  const handleCloseNotification = () => {
    setIsNotificationOpen(false);
  };

  return (
    <div className="fixed flex items-center justify-between h-14 bg-zp-light-beige px-7 max-w-[600px] w-full z-30">
      <div className="flex items-center">
        <Logo width={30} height={30} className="-mr-1" />
        <Button
          children="iPPlZ"
          buttonType="light"
          fontSize="2xl"
          type="button"
          onClick={() => navigate('/')}
          fontFamily="metamorphous"
          radius="none"
        />
      </div>
      <button onClick={handleOpenNotification}>
        <FaRegBell size={24} />
      </button>
      <FullModal
        isOpen={isNotificationOpen}
        onRequestClose={handleCloseNotification}
      >
        <NotificationModal handleCloseNotification={handleCloseNotification} />
      </FullModal>
    </div>
  );
}
