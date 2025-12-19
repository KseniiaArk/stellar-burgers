import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { selectUser } from '../../services/slices/auth-slice';
import {
  getUserOrdersThunk,
  selectNewOrder,
  selectUserOrders
} from '../../services/slices/orders-slice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  /** DO: взять переменную из стора */
  const orders: TOrder[] = useSelector(selectUserOrders);
  const user = useSelector(selectUser);
  //const newOrder = useSelector(selectNewOrder);



  useEffect(() => {
    if (user) {
      dispatch(getUserOrdersThunk());
    }
  }, [dispatch, user]);

  return <ProfileOrdersUI orders={orders} />;
};
