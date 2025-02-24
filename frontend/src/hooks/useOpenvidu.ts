import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import {
  Session as OVSession,
  OpenVidu,
  Publisher,
  StreamEvent,
  Subscriber,
} from 'openvidu-browser';

const base_url = 'https://zipplz.site/api/';

export default function useOpenVidu() {
  const { chatroomSerial } = useParams<{ chatroomSerial?: string }>();
  const [session, setSession] = useState<OVSession | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [OV, setOV] = useState<OpenVidu | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // 1-2. 세션 입장 함수
  const joinSession = useCallback(() => {
    console.log('세션 입장 useCallback');
    const OVs = new OpenVidu();
    setOV(OVs);
    setSession(OVs.initSession());
  }, []);

  // 1-1. 세션 입장
  useEffect(() => {
    console.log('세션 입장');
    if (chatroomSerial) {
      setSessionId(String(chatroomSerial));
      joinSession();
    }
  }, [joinSession]);

  // 세션 나가기(종료버튼)
  const leaveSession = useCallback(async () => {
    if (sessionId) {
      await axios.delete(`${base_url}openvidu/api/sessions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ sessionId }),
      });
      setOV(null);
      setSession(null);
      setSessionId('');
      setSubscriber(null);
      setPublisher(null);
      setToken(null);
    }
  }, [sessionId]);

  // 나갈 때마다 실행
  useEffect(() => {
    window.addEventListener('beforeunload', leaveSession);

    return () => {
      window.removeEventListener('beforeunload', leaveSession);
    };
  }, [leaveSession]);

  // 3 - 1. 이벤트 호출 돼서 이 부분이 동작함.
  const handleStreamDestroyed = (event: StreamEvent) => {
    if (subscriber && event.stream.streamId === subscriber.stream.streamId) {
      setSubscriber(null);
    } else if (
      publisher &&
      event.stream.streamId === publisher.stream.streamId
    ) {
      setPublisher(null);
    }
  };

  const handleStreamCreated = (event: StreamEvent) => {
    if (
      session &&
      !subscriber &&
      event.stream.connection.connectionId !==
        publisher?.stream.connection.connectionId
    ) {
      const newSubscriber = session.subscribe(event.stream, '');
      setSubscriber(newSubscriber);
    }
  };

  // 3. 세션 생성 후, 구독/퍼블리싱 로직 실행(이벤트 핸들러)
  useEffect(() => {
    if (!session) return;

    // on
    session.on('streamDestroyed', handleStreamDestroyed);
    session.on('streamCreated', handleStreamCreated);

    // off
    return () => {
      session.off('streamDestroyed', handleStreamDestroyed);
      session.off('streamCreated', handleStreamCreated);
    };
  }, [session, publisher, subscriber]);

  //2-2.세션 생성 시
  const createSession = async (sessionId: string) => {
    try {
      const data = JSON.stringify({
        customSessionId: sessionId,
        mediaMode: 'ROUTED',
        chatroomSerial: Number(chatroomSerial),
      });
      const response = await axios.post(
        `${base_url}openvidu/api/sessions`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        return sessionId;
      } else {
        console.error('세션 생성 실패:', error);
        throw error;
      }
    }
  };

  // 2-3. 토큰 만들기
  const createToken = async (sessionIds: string) => {
    try {
      const data = JSON.stringify({
        role: 'PUBLISHER',
        sessionId: sessionIds,
        chatroomSerial: Number(chatroomSerial),
      });
      const response = await axios.post(
        `${base_url}openvidu/api/sessions/connections`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.proc.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.proc.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios 오류:', error.response?.data || error.message);
      } else {
        console.error('예상치 못한 오류:', error);
      }
      throw new Error('토큰 생성 실패.');
    }
  };

  // 2-1. 세션 입장 후, 토큰이 있으면 그 토큰 반환, 없으면 세션 생성
  const getToken = async (): Promise<string> => {
    if (token) return token;
    try {
      const sessionIds = await createSession(sessionId);
      const token_a = await createToken(sessionIds);
      setToken(token_a);
      return token_a;
    } catch (error) {
      throw new Error('토큰 받기 실패.');
    }
  };

  // 2. 토큰 생성 실행
  useEffect(() => {
    if (!session) return;
    if (token) return;
    getToken()
      .then((token) => {
        // 2-4. 세션, 토큰 만들면 퍼블리싱 구독 로직 시작
        session
          .connect(token)
          .then(() => {
            if (OV) {
              const publisher = OV.initPublisher(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                mirror: true,
              });
              setPublisher(publisher);
              session
                .publish(publisher)
                .catch((error) => console.error('퍼블리싱 오류:', error));
            }
          })
          .catch((error) => console.error('세션 연결 오류:', error));
      })
      .catch((error) => console.error('토큰 받기 오류:', error));
  }, [session, OV, sessionId]);

  const startScreenShare = async () => {
    if (!token) {
      console.warn('Token not available for screen sharing.');
      return;
    }

    try {
      if (!session) return;

      // 기존 퍼블리셔가 있는 경우 종료
      if (publisher) {
        session.unpublish(publisher);
        publisher.stream
          .getMediaStream()
          .getTracks()
          .forEach((track) => track.stop());
        setPublisher(null); // 퍼블리셔 상태 초기화
      }

      if (OV) {
        // 새로운 퍼블리셔 생성
        const newPublisher = OV.initPublisher(undefined, {
          videoSource: 'screen',
          audioSource: 'screen',
        });

        // 화면 공유 승인 처리
        newPublisher.once('accessAllowed', () => {
          newPublisher.stream
            .getMediaStream()
            .getVideoTracks()[0]
            .addEventListener('ended', () => {
              console.log('Screen share ended.');
              // 필요 시 추가 로직 처리
            });

          // 세션에 새로운 퍼블리셔 연결
          session.publish(newPublisher);
          setPublisher(newPublisher); // 새로운 퍼블리셔 상태 업데이트
        });

        // 화면 공유 거부 처리
        newPublisher.once('accessDenied', () => {
          console.warn('ScreenShare: Access Denied');
        });
      }
    } catch (error) {
      console.error('Failed to start screen share:', error);
    }
  };

  // const startScreenShare = async () => {
  //   if (!token) {
  //     console.warn('Token not available for screen sharing.');
  //     return;
  //   }

  //   try {
  //     if (!session) return;

  //     // 기존 세션 종료
  //     await session.disconnect();

  //     if (OV) {
  //       // 새로운 퍼블리셔 생성
  //       const publisher = OV.initPublisher(undefined, {
  //         videoSource: 'screen',
  //         audioSource: 'screen',
  //       });

  //       // 화면 공유 승인 처리
  //       publisher.once('accessAllowed', () => {
  //         publisher.stream
  //           .getMediaStream()
  //           .getVideoTracks()[0]
  //           .addEventListener('ended', () => {
  //             console.log('Screen share ended.');
  //             // 필요 시 추가 로직 처리
  //           });

  //         // 세션에 퍼블리셔 연결
  //         session.publish(publisher);
  //         setPublisher(publisher);
  //       });

  //       // 화면 공유 거부 처리
  //       publisher.once('accessDenied', () => {
  //         console.warn('ScreenShare: Access Denied');
  //       });

  //       // 세션 재연결
  //       await session.connect(token);
  //     }
  //   } catch (error) {
  //     console.error('Failed to start screen share:', error);
  //   }
  // };

  return {
    session,
    publisher,
    subscriber,
    leaveSession,
    startScreenShare,
    joinSession,
    setSubscriber,
    setPublisher,
    OV,
  };
}
