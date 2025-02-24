import { ReactNode, createContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { ChatMessageData } from '@/types';
import { Client, IMessage } from '@stomp/stompjs';
import axios from 'axios';

const chat_base_url = 'wss://zipplz.site/api/ws';
const base_url: string = 'https://zipplz.site/api/';

interface WebSocketContextType {
  sendMessage: (
    msg: string,
    userSerial: number,
    file?: File,
    type?: 'TALK' | 'IMAGE' | 'FILE' | 'CONTRACT',
    contract?: boolean,
    contractContent?: {
      requestComment: string;
      startDate: string;
      endDate: string;
      workPrice: number;
      materialList: number[];
      chatroomSerial: number;
    }
  ) => void;
  messages: ChatMessageData[];
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const { chatroomSerial } = useParams<{ chatroomSerial?: string }>();

  useEffect(() => {
    const fetchInitialMessages = async () => {
      if (!chatroomSerial) return;
      try {
        const response = await axios.get<{
          data: { chatMessages: ChatMessageData[] };
        }>(`${base_url}chatroom/${chatroomSerial}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.status === 200) {
          setMessages(response.data.data.chatMessages);
        }
      } catch (error) {
        console.error('Error fetching initial messages:', error);
      }
    };

    fetchInitialMessages();

    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      console.error('Token not found in localStorage.');
      return;
    }

    const stompClient = new Client({
      brokerURL: chat_base_url,
      connectHeaders: {
        'X-AUTH-TOKEN': storedToken,
      },
      debug: (msg) => console.log('STOMP debug:', msg),
      onConnect: (frame) => {
        console.log('STOMP connected:', frame);
        stompClient.subscribe(
          `/sub/chat/room/${chatroomSerial}`,
          (message: IMessage) => {
            if (message.body) {
              try {
                const msg: ChatMessageData = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, msg]);
              } catch (error) {
                console.error('Error parsing message:', error);
              }
            }
          }
        );

        stompClient.publish({
          destination: '/pub/chat/enter',
          headers: { 'X-AUTH-TOKEN': storedToken },
          body: JSON.stringify({ chatroomSerial }),
        });
        console.log('Entered chat room!');
      },
      onDisconnect: () => {
        console.log('STOMP connection disconnected.');
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
      onWebSocketClose: (frame) => {
        console.error('WebSocket closed:', frame);
      },
      onWebSocketError: (frame) => {
        console.error('WebSocket error:', frame);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [chatroomSerial]);

  const sendMessage = (
    msg: string,
    userSerial: number,
    file?: File,
    type: 'TALK' | 'IMAGE' | 'FILE' | 'CONTRACT' = 'TALK',
    contract: boolean = false,
    contractContent?: {
      requestComment: string;
      startDate: string;
      endDate: string;
      workPrice: number;
      materialList: number[];
      chatroomSerial: number;
    }
  ) => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      console.error('Token not found in localStorage.');
      return;
    }

    const messagePayload = {
      type,
      chatroomSerial,
      userSerial,
      chatMessageContent: msg,
      isFile: type === 'IMAGE' || type === 'FILE',
      originalFileName: file?.name,
      contract,
      contractContent,
    };

    function arrayBufferToBase64(buffer: ArrayBuffer): string {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;

      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }

      return btoa(binary);
    }

    if (type === 'IMAGE' && file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        messagePayload.chatMessageContent = base64Data;
        client?.publish({
          destination: '/pub/chat/message',
          headers: { 'X-AUTH-TOKEN': storedToken },
          body: JSON.stringify(messagePayload),
        });
      };
      reader.readAsDataURL(file as Blob);
    } else if (type === 'FILE' && file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const base64String = arrayBufferToBase64(arrayBuffer);
        messagePayload.chatMessageContent = base64String;

        client?.publish({
          destination: '/pub/chat/message',
          headers: { 'X-AUTH-TOKEN': storedToken },
          body: JSON.stringify(messagePayload),
        });
      };
      reader.readAsArrayBuffer(file as Blob);
    } else {
      client?.publish({
        destination: '/pub/chat/message',
        headers: { 'X-AUTH-TOKEN': storedToken },
        body: JSON.stringify(messagePayload),
      });
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketProvider, WebSocketContext };
