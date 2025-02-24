import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import type { Event, Work } from '@/types';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';

import './Calendar.css';

interface Props {
  workList: any | Work[];
  onEventClick?: (workSerial: string) => void;
  loading?: boolean;
}

const predefinedColors = [
  '#fefff4',
  '#f6f8ff',
  '#FFFDF7',
  '#fff5f5',
  '#f8fff5',
  '#fbf7ff',
];

const getRandomColor = (): string => {
  const randomIndex = Math.floor(Math.random() * predefinedColors.length);
  return predefinedColors[randomIndex];
};

const ScheduleCalendar = function ({ workList, onEventClick, loading }: Props) {
  const [eventList, setEventList] = useState<Event[]>([]);

  useEffect(() => {
    if (Array.isArray(workList)) {
      const newEventList: Event[] = workList
        .filter((work: any) => work !== null && work !== undefined)
        .map((work: any) => ({
          title: work.field,
          start: new Date(work.startDate),
          end: new Date(work.endDate),
          workSerial: work.workSerial,
        }));

      setEventList(newEventList);
    }
  }, [workList]);

  return (
    <div className="relative w-full">
      {loading ? (
        <Skeleton height={300} />
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin]}
          timeZone="UTC"
          headerToolbar={{ left: 'prev', center: 'title', right: 'next' }}
          aspectRatio={1.3}
          eventBorderColor="none"
          initialView="dayGridMonth"
          dayMaxEvents={true}
          events={eventList.map((event) => {
            const adjustedEnd = new Date(event.end);
            const adjustedStart = new Date(event.start)
            adjustedEnd.setDate(adjustedEnd.getDate() + 1);
            adjustedStart.setDate(adjustedStart.getDate()+1)

            const randomColor = getRandomColor();

            return {
              title: event.title,
              start: adjustedStart.toISOString(),
              end: adjustedEnd.toISOString(),
              extendedProps: {
                backgroundColor: randomColor,
                workSerial: event.workSerial,
              },
            };
          })}
          eventContent={(eventInfo) => (
            <div
              className="px-2 border-zp-light-gray border-[0.1px] text-zp-gray text-zp-3xs drop-shadow-zp-slight rounded-zp-radius-sm font-noto"
              style={{
                backgroundColor: eventInfo.event.extendedProps.backgroundColor,
              }}
            >
              {eventInfo.event.title}
            </div>
          )}
          eventClick={(event) => {
            if (event.event.extendedProps.workSerial) {
              localStorage.setItem(
                'workSerial',
                event.event.extendedProps.workSerial
              );
              if (onEventClick)
                onEventClick(event.event.extendedProps.workSerial);
            }
          }}
        />
      )}
    </div>
  );
};

export default ScheduleCalendar;
