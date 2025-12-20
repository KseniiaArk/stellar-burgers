import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useParams } from 'react-router-dom';
import {
  getOrderByNumberThunk,
  selectOrderByNumber,
  clearOrderByNumber
} from '../../services/slices/orders-slice';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredients-slice';

type TIngredientsWithCount = {
  [key: string]: TIngredient & { count: number };
};

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);
  
  const dispatch = useDispatch();
  const orderData = useSelector(selectOrderByNumber);
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  useEffect(() => {
    if (orderNumber) {
      dispatch(getOrderByNumberThunk(orderNumber));
    }
    
    return () => {
      dispatch(clearOrderByNumber());
    };
  }, [dispatch, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, itemId: string) => {
        const ingredient = ingredients.find((ing: TIngredient) => ing._id === itemId);
        
        if (!ingredient) return acc;
        
        if (!acc[itemId]) {
          acc[itemId] = {
            ...ingredient,
            count: 1
          };
        } else {
          acc[itemId].count++;
        }

        return acc;
      },
      {} as TIngredientsWithCount
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: TIngredient & { count: number }) => {
        if (item.type === 'bun') {
          return acc + item.price * 2 * item.count;
        }
        return acc + item.price * item.count;
      },
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
