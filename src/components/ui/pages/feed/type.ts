import { TOrder } from '@utils-types';

export type FeedUIProps = {
  orders: TOrder[];
  handleGetFeeds: () => void;
  feed: {
    total: number;
    totalToday: number;
  };
};
