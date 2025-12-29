import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useState, useEffect, useCallback } from 'react';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/auth-slice';
import { useWebSocket } from '../../hooks/use-websocket';
import { getCookie } from '../../utils/cookie';
import { Preloader } from '@ui';

type TWebSocketMessage = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  message?: string;
};

export const ProfileOrders: FC = () => {
  const user = useSelector(selectUser);
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [wsUrl, setWsUrl] = useState<string>('');

  const handleMessage = useCallback((data: TWebSocketMessage) => {
    const sortedOrders = [...data.orders].sort(
      (a: TOrder, b: TOrder) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setOrders(sortedOrders);
  }, []);

  const handleError = useCallback((error: string) => {
    console.error('WebSocket error:', error);
  }, []);

  const { isConnected, disconnect } = useWebSocket(
    wsUrl,
    handleMessage,
    handleError
  );

  useEffect(() => {
    if (user) {
      const token = getCookie('accessToken');
      if (token) {
        const cleanToken = token.replace('Bearer ', '');
        setWsUrl(`wss://norma.education-services.ru/orders?token=${cleanToken}`);
      }
    }

    return () => {
      disconnect();
    };
  }, [user, disconnect]);

  if (!user) {
    return <Preloader />;
  }

  if (!isConnected && orders.length === 0) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
