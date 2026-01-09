import { FC, useMemo } from 'react';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectUser } from '../../services/slices/auth-slice';
import { useDispatch, useSelector } from '../../services/store';
import {
  postUserBurgerThunk,
  selectNewOrder,
  selectOrderRequest,
  clearNewOrder
} from '../../services/slices/orders-slice';
import {
  clearConstructor,
  selectConstructor
} from '../../services/slices/constructor-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);

  const userBurger = useSelector(selectConstructor);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectNewOrder).order;

  const onOrderClick = () => {
    if (!userBurger.bun || orderRequest) {
      return;
    }

    if (!user) {
      navigate('/login', {
        replace: true,
        state: { from: location }
      });
      return;
    }

    const itemsId = [
      userBurger.bun._id,
      ...userBurger.ingredients.map(
        (ingredient: TConstructorIngredient) => ingredient._id
      ),
      userBurger.bun._id
    ];

    dispatch(postUserBurgerThunk(itemsId))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch((error: Error) => {
        console.error('Ошибка при создании заказа', error);
      });
  };

  const closeOrderModal = () => {
    dispatch(clearNewOrder());
  };

  const price = useMemo(
    () =>
      (userBurger.bun ? userBurger.bun.price : 0) +
      userBurger.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [userBurger]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={userBurger}
      orderModalData={orderModalData as TOrder | null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
