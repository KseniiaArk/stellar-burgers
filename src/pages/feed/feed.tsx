import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  getFeedsThunk,
  selectFeed,
  selectFeedOrders,
  selectOrdersLoading
} from '../../services/slices/orders-slice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeedsThunk());
  }, [dispatch]);

  /** DO: взять переменную из стора */
  const feedOrders: TOrder[] = useSelector(selectFeedOrders);
  const ordersLoading = useSelector(selectOrdersLoading);
  const feed = useSelector(selectFeed);

  if (ordersLoading && !feedOrders.length) {
    return <Preloader />;
  }

  const feedFata = {
    total: feed.total || 0,
    totalToday: feed.totalToday || 0
  };

  return (
    <FeedUI
      orders={feedOrders}
      feed={feedFata}
      handleGetFeeds={() => {
        dispatch(getFeedsThunk());
      }}
    />
  );
};
