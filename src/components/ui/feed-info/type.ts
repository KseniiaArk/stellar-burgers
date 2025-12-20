import { TOrder } from '@utils-types';

export type TFeedData = {
  total: number;
  totalToday: number;
  orders?: TOrder[];
  isLoading?: boolean;
  error?: string | null;
};

export type FeedInfoUIProps = {
  feed: TFeedData;
  readyOrders: number[];
  pendingOrders: number[];
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};
