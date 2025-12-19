// src/components/burger-constructor/burger-constructor.tsx
import { FC, useMemo } from 'react';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectUser } from '../../services/slices/auth-slice';
import { useDispatch, useSelector } from '../../services/store';
import { postUserBurderThunk,
  selectNewOrder,
  selectOrderRequest,
  setNewOrder,
  addLocalOrder
 } from '../../services/slices/orders-slice';
import { clearConstructor,
  selectConstructor
} from '../../services/slices/constructor-slice';
import { error } from 'console';

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
      return navigate('/login', {
        replace: true,
        state: {
          from: {
            ...location,
            background: location.state?.background,
            state: null
          }
        }
      });
    } else {
      const from = location.state?.from || { pathname: '/' };
      const backgroundLocation = location.state?.from?.background || null;

      const itemsId = [
        userBurger.bun._id,
        ...userBurger.ingredients.map((ingredient) => ingredient._id),
        userBurger.bun._id
      ];

      const tempOrder: TOrder = {
        _id: `temp_${Date.now()}`,
        status: 'pending',
        name: 'Ваш заказ готовится',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        number: Math.floor(Math.random() * 1000000),
        ingredients: itemsId
      };

      dispatch(addLocalOrder(tempOrder));

      dispatch(postUserBurderThunk(itemsId)).then((result) =>
        {
          dispatch(clearConstructor())
        })
        .catch((error) => {
          console.error('Ошибка при создании заказа', error);
        });

      return navigate(from, {
        replace: true,
        state: { background: backgroundLocation }
      });
    }
  };

  const closeOrderModal = () => {
    dispatch(setNewOrder(false));
  };

  const price = useMemo(
    () =>
      (userBurger.bun ? userBurger.bun.price * 2 : 0) +
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
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
