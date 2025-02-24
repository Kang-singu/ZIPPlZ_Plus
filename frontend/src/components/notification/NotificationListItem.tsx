import type { NotificationData } from '@/types';
import { formatDateWithTime } from '@utils/formatDateWithTime';

interface NotificationListItemProps {
  notification: NotificationData;
}

export default function NotificationListItem({
  notification,
}: NotificationListItemProps) {
  return (
    <div className="flex items-center justify-between p-3 mb-2 transition-transform duration-300 ease-in-out border select-none border-zp-light-gray bg-zp-light-orange rounded-zp-radius-btn hover:bg-zp-light-yellow hover:scale-[102%] drop-shadow-zp-normal hover:drop-shadow-lg">
      <p className="flex-1 truncate text-zp-xs hover:text-zp-black text-zp-gray">
        {notification.notificationComment}
      </p>
      <span className="ml-4 text-zp-2xs text-zp-light-gray">
        {formatDateWithTime(notification.notificationDate)}
      </span>
    </div>
  );
}
