import { TIngredient } from '@utils-types';

export type OrderInfoUIProps = {
  orderInfo: TOrderInfo;
};

type TIngredientsWithCount = {
  [key: string]: TIngredient & { count: number };
};

export type TOrderInfo = {
  ingredientsInfo: TIngredientsWithCount;
  date: Date;
  total: number;
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};
