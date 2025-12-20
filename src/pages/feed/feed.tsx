import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useState, useCallback } from 'react';
import { useWebSocket } from '../../hooks/use-websocket';

type TWebSocketMessage = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  message?: string;
};

export const Feed: FC = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [totalToday, setTotalToday] = useState(0);

  const handleMessage = useCallback((data: TWebSocketMessage) => {
    console.log('WebSocket data received:', {
      ordersCount: data.orders.length,
      total: data.total,
      totalToday: data.totalToday,
      doneOrders: data.orders.filter((o: TOrder) => o.status === 'done').length,
      pendingOrders: data.orders.filter((o: TOrder) => o.status === 'pending').length
    });
    
    setOrders(data.orders);
    setTotal(data.total);
    setTotalToday(data.totalToday);
  }, []);

  const handleError = useCallback((error: string) => {
    console.error('WebSocket error:', error);
  }, []);

  const { isConnected, disconnect, reconnect } = useWebSocket(
    'wss://norma.education-services.ru/orders/all',
    handleMessage,
    handleError
  );

  const handleGetFeeds = () => {
    disconnect();
    setTimeout(() => {
      reconnect();
    }, 100);
  };

  const feedData = {
    total,
    totalToday
  };

  if (!isConnected && orders.length === 0) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      feed={feedData}
      handleGetFeeds={handleGetFeeds}
    />
  );
};
