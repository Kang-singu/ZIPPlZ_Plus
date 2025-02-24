// import { useEffect, useState } from 'react';
// import { IoIosClose } from 'react-icons/io';

// import { getNotifications } from '@/apis/notification/notificationApi';
// import type { NotificationData } from '@/types';
// import NothingIcon from '@assets/nothing-icon.svg?react';
// import SearchInput from '@components/common/SearchInput';
// import NotificationListItem from '@components/notification/NotificationListItem';
// import { useLoginUserStore } from '@stores/loginUserStore';
// import Pagination from '@utils/Pagination';

// import { mockNotifications } from '../../data/notifications';

interface NotificationModalProps {
  handleCloseNotification: () => void;
}

export default function NotificationModal(
  {
    // handleCloseNotification,
  }: NotificationModalProps
) {
  // const [searchQuery, setSearchQuery] = useState('');
  // const [page, setPage] = useState(0);
  // const [perPage, setPerPage] = useState(10);
  // const [notifications, setNotifications] = useState<NotificationData[]>([]);
  // const [filteredNotifications, setFilteredNotifications] = useState<
  //   NotificationData[]
  // >([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const { loginUser } = useLoginUserStore();
  // const userSerial: number | undefined = loginUser?.userSerial;
  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const notifications = await getNotifications(Number(userSerial));
  //       if (notifications) {
  //         setNotifications(notifications);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       setError('Failed to load notifications.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchNotifications();
  // }, []);

  // useEffect(() => {
  //   const filtered = mockNotifications.filter((notification: any) =>
  //     notification.notificationComment.includes(searchQuery)
  //   );
  //   setFilteredNotifications(filtered);
  // }, [searchQuery, notifications]);

  // useEffect(() => {
  //   setPage(1);
  // }, [searchQuery]);

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth < 380) {
  //       setPerPage(10);
  //     }
  //   };

  //   window.addEventListener('resize', handleResize);
  //   handleResize();

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  // const numPages = Math.ceil(filteredNotifications.length / perPage);
  // const offset = (page - 1) * perPage;

  // const handleSearch = (query: string) => {
  //   setSearchQuery(query);
  // };

  // useEffect(() => {
  //   if (page > numPages) {
  //     setPage(numPages);
  //   }
  // }, [numPages]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  return (
    <div className="flex flex-col justify-between w-full py-4">
      {/* <div className="w-full px-4 ">
        <div className="flex justify-between">
          <h2 className="font-bold text-zp-xl font-noto mb-1">알림</h2>
          <span onClick={handleCloseNotification} className="cursor-pointer">
            <IoIosClose size={30} />
          </span>
        </div>
        <SearchInput onSearch={handleSearch} placeholder="알림을 검색하세요." />
        <div className="mt-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications
              .slice(offset, offset + perPage)
              .map((notification, index) => (
                <NotificationListItem
                  // key={notification.notificationSerial}
                  key={index}
                  notification={notification}
                />
              ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <p>해당하는 알림이 없습니다.</p>
              <NothingIcon />
            </div>
          )}
        </div>
      </div>
      {filteredNotifications.length > 0 && (
        <Pagination
          total={filteredNotifications.length}
          limit={perPage}
          page={page}
          setPage={setPage}
        />
      )} */}
    </div>
  );
}
