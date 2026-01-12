import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi, getOrderByNumberApi } from '@api';

export interface OrderState {
  newOrder: {
    order: TOrder | null;
    name: string;
  };
  orderByNumber: TOrder | null;
  orderRequest: boolean;
  loading: boolean;
  error: string | null;
}

export const initialState: OrderState = {
  newOrder: {
    order: null,
    name: ''
  },
  orderByNumber: null,
  orderRequest: false,
  loading: false,
  error: null
};

export const postUserBurgerThunk = createAsyncThunk(
  'order/postUserBurger',
  async (userBurgerIngredients: string[], { rejectWithValue }) => {
    try {
      return await orderBurgerApi(userBurgerIngredients);
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || 'Ошибка отправки заказа');
    }
  }
);

export const getOrderByNumberThunk = createAsyncThunk(
  'feed/fetchByNumber',
  async (orderNumber: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(orderNumber);
      return response.orders[0];
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(
        error.message || 'Ошибка получения заказа по номеру'
      );
    }
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearNewOrder: (state) => {
      state.newOrder = { order: null, name: '' };
    },
    clearOrderByNumber: (state) => {
      state.orderByNumber = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postUserBurgerThunk.pending, (state) => {
        state.loading = true;
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(postUserBurgerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.newOrder = {
          order: action.payload.order,
          name: action.payload.name
        };
      })
      .addCase(postUserBurgerThunk.rejected, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.error = action.payload as string;
      })

      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderByNumber = null;
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orderByNumber = action.payload;
      })
      .addCase(getOrderByNumberThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    selectNewOrder: (state) => state.newOrder,
    selectOrderByNumber: (state) => state.orderByNumber,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrdersLoading: (state) => state.loading
  }
});

export const { clearNewOrder, clearOrderByNumber } = ordersSlice.actions;
export const {
  selectNewOrder,
  selectOrderByNumber,
  selectOrderRequest,
  selectOrdersLoading
} = ordersSlice.selectors;
export const ordersReducer = ordersSlice.reducer;
