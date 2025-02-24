import { useEffect, useRef, useState } from 'react';
import { CiImageOn } from 'react-icons/ci';
import { FaFolderOpen } from 'react-icons/fa';
import { FiTool } from 'react-icons/fi';
import { TbWood } from 'react-icons/tb';

import AfterService from '@components/chat/AfterService';
// import Contract from '@components/chat/Contract';
import Material from '@components/chat/Material';
import FullModal from '@components/common/FullModal';
import { useLoginUserStore } from '@stores/loginUserStore';

interface MenuItem {
  id: number;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  bgColor: string;
  role: string | string[];
  onClick?: () => void;
}

interface ToggleChatMenuProps {
  setImagePreview: React.Dispatch<React.SetStateAction<string | undefined>>;
  chatroomSerial: number;
  name: string | undefined;
  setFileSrc: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function ToggleChatMenu({
  setImagePreview,
  chatroomSerial,
  name,
  setFileSrc,
}: ToggleChatMenuProps) {
  const { loginUser } = useLoginUserStore();
  const userType = loginUser?.role || '';

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [submit, setSubmit] = useState<boolean>(false);
  const [isAfterServiceModalOpen, setIsAfterServiceModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const handleImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageData = reader.result as string;
          setImagePreview(imageData);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const fileData = reader.result as string;
          setFileSrc(fileData);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAfterService = () => {
    setIsAfterServiceModalOpen(true);
  };

  const handleMaterial = () => {
    setIsMaterialModalOpen(true);
  };

  const closeAfterServiceModal = () => {
    setIsAfterServiceModalOpen(false);
    if (submit) {
      setIsConfirmationModalOpen(true);
    }
  };

  const closeMaterialModal = () => {
    setIsMaterialModalOpen(false);
  };

  useEffect(() => {
    if (isConfirmationModalOpen) {
      const timer = setTimeout(() => {
        setIsConfirmationModalOpen(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isConfirmationModalOpen]);

  const menus: MenuItem[] = [
    {
      id: 1,
      icon: CiImageOn,
      label: '이미지',
      bgColor: '#75C734',
      role: ['customer', 'worker'],
      onClick: handleImageUpload,
    },
    {
      id: 2,
      icon: FaFolderOpen,
      label: '파일',
      bgColor: '#0697FF',
      role: ['customer', 'worker'],
      onClick: handleFileUpload,
    },
    // {
    //   id: 3,
    //   icon: FaFileContract,
    //   label: '계약서',
    //   bgColor: '#FF9500',
    //   role: 'worker',
    //   onClick: handleContract,
    // },
    {
      id: 3,
      icon: FiTool,
      label: 'A/S 신청',
      bgColor: '#FC7FF0',
      role: 'customer',
      onClick: handleAfterService,
    },
    {
      id: 4,
      icon: TbWood,
      label: '자재 관리',
      bgColor: '#FF9500',
      role: ['customer', 'worker'],
      onClick: handleMaterial,
    },
  ];

  return (
    <div className="sticky bottom-0 content-center w-full h-24 border bg-zp-white border-zp-sub-color rounded-t-zp-radius-big">
      <ul className="flex items-center w-11/12 h-full m-auto bg-zp-white justify-evenly">
        {menus
          .filter((menu) =>
            Array.isArray(menu.role)
              ? menu.role.includes(userType)
              : menu.role === userType
          )
          .map((menu) => (
            <li
              key={menu.id}
              className="flex flex-col items-center gap-1 cursor-pointer"
              onClick={() => menu.onClick && menu.onClick()}
            >
              <div
                style={{ backgroundColor: menu.bgColor }}
                className="flex items-center justify-center w-11 h-11 aspect-square rounded-zp-radius-full"
              >
                <menu.icon
                  size={26}
                  style={{
                    stroke: menu.id >= 3 ? 'white' : undefined,
                    fill: menu.id < 3 ? 'white' : undefined,
                  }}
                />
              </div>
              <span className="font-bold text-zp-2xs">{menu.label}</span>
            </li>
          ))}
      </ul>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <FullModal
        isOpen={isAfterServiceModalOpen}
        onRequestClose={closeAfterServiceModal}
        height="60%"
        maxWidth="400px"
      >
        <AfterService
          closeAfterServiceModal={closeAfterServiceModal}
          name={name}
          submit={submit}
          setSubmit={setSubmit}
        />
      </FullModal>

      <FullModal
        isOpen={isMaterialModalOpen}
        onRequestClose={closeMaterialModal}
        height="80%"
        maxWidth="400px"
      >
        <Material
          closeMaterialModal={closeMaterialModal}
          chatroomSerial={chatroomSerial}
        />
      </FullModal>

      <FullModal
        isOpen={isConfirmationModalOpen}
        onRequestClose={() => setIsConfirmationModalOpen(false)}
        height="20%"
        maxWidth="300px"
      >
        <div className="flex flex-col items-center justify-center w-full h-full gap-6 p-3">
          <h2 className="font-bold text-center text-zp-2xl">A/S 신청 완료</h2>
          <p className="text-center text-zp-md">A/S 신청이 완료되었습니다.</p>
        </div>
      </FullModal>
    </div>
  );
}
