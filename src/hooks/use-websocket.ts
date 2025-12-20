import { useEffect, useRef, useCallback, useState } from 'react';
import { TOrder } from '@utils-types';

type TWebSocketMessage = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  message?: string;
};

export const useWebSocket = (
  url: string,
  onMessage: (data: TWebSocketMessage) => void,
  onError?: (error: string) => void
) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('WebSocket connected:', url);
      setIsConnected(true);
    };

    ws.current.onmessage = (event: MessageEvent) => {
      try {
        const data: TWebSocketMessage = JSON.parse(event.data);
        if (data.success) {
          onMessage(data);
        } else if (onError && data.message) {
          onError(data.message);
        }
      } catch (error) {
        if (onError) {
          onError('Ошибка парсинга данных WebSocket');
        }
      }
    };

    ws.current.onerror = (event: Event) => {
      if (onError) {
        onError('WebSocket error');
      }
      setIsConnected(false);
    };

    ws.current.onclose = (event: CloseEvent) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      setIsConnected(false);
      
      if (event.code !== 1000) {
        setTimeout(() => {
          connect();
        }, 3000);
      }
    };
  }, [url, onMessage, onError]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close(1000, 'Работа завершена');
      ws.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message: Record<string, unknown>) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    if (url) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [url, connect, disconnect]);

  return { 
    isConnected, 
    disconnect, 
    reconnect: connect,
    sendMessage 
  };
};
