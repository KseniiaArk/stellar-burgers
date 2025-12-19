// src/services/slices/orders-slice.ts
import { createAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi,
  TFeedsResponse
} from '@api';

export interface OrderState {
  feed: TFeedsResponse;
  userOrders: TOrder[];
  orderByNumber: TOrder | null;
  newOrder: {
    order: TOrder | null;
    name: string;
  };
  orderRequest: boolean;
  loading: boolean;
  error: string | null;
  localOrders: TOrder[];
}

const initialState: OrderState = {
  feed: {
    success: false,
    total: 0,
    totalToday: 0,
    orders: []
  },
  userOrders: [],
  orderByNumber: null,
  newOrder: {
    order: null,
    name: ''
  },
  orderRequest: false,
  loading: false,
  error: null,
  localOrders: []
};

export const addLocalOrder = createAction<TOrder, 'orders/addLocalOrder'>('orders/addLocalOrder');

export const getFeedsThunk = createAsyncThunk(
  'feed/fetchInfo',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки ленты заказов');
    }
  }
);

export const getOrderByNumberThunk = createAsyncThunk(
  'feed/fetchByNumber',
  async (orderNumber: number, { rejectWithValue }) => {
    try {
      return await getOrderByNumberApi(orderNumber);
    } catch (err: any) {
      return rejectWithValue(
        err.message || 'Ошибка получения заказа по номеру'
      );
    }
  }
);

export const postUserBurderThunk = createAsyncThunk(
  'order/postUserBurger',
  async (userBurgerIngredients: string[], { rejectWithValue }) => {
    try {
      return await orderBurgerApi(userBurgerIngredients);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка отправки заказа');
    }
  }
);

export const getUserOrdersThunk = createAsyncThunk(
  'order/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка отправки заказа');
    }
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setNewOrder: (state, action) => {
      state.orderRequest = action.payload;
      state.newOrder.order = null;
    },
    addLocalOrder: (state, action: PayloadAction<TOrder>) => {
      state.localOrders.unshift(action.payload);
    },
    clearLocalOrders: (state) => {
      state.localOrders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.feed = action.payload;
      })
      .addCase(getFeedsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderByNumber = null;
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orderByNumber = action.payload.orders[0];
      })
      .addCase(getOrderByNumberThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(postUserBurderThunk.pending, (state) => {
        state.loading = true;
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(postUserBurderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.newOrder = {
          order: action.payload.order,
          name: action.payload.name
        };

        const localOrder: TOrder = {
          ...action.payload.order,
          createdAt: new Date().toISOString()
        };
        state.localOrders.unshift(localOrder);

        state.feed.total += 1;
        state.feed.totalToday +=1;
      })
      .addCase(postUserBurderThunk.rejected, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.error = action.payload as string;
      })

      .addCase(getUserOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;

        state.localOrders = [];
      })
      .addCase(getUserOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(getUserOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    selectFeedOrders: (state) => {
      const allOrders = [...state.localOrders, ...state.feed.orders];
      const uniqueOrders = allOrders.filter((order, index, self) => 
      index === self.findIndex((o) => o._id === order._id));
      return uniqueOrders;
    },
    selectOrdersLoading: (state) => state.loading,
    selectOrderByNumber: (state) => state.orderByNumber,
    selectFeed: (state) => ({
      ...state.feed,
      total: state.feed.total + state.localOrders.length,
      totalToday: state.feed.totalToday + state.localOrders.length
    }),
    selectNewOrder: (state) => state.newOrder,
    selectOrderRequest: (state) => state.orderRequest,
    selectUserOrders: (state) => {
      const allOrders = [...state.localOrders, ...state.userOrders];
      const uniqueOrders = allOrders.filter((order, index, self) => 
      index === self.findIndex((o) => o._id === order._id));

      return uniqueOrders;
    }
  }
});

export const {
  selectFeedOrders,
  selectOrdersLoading,
  selectOrderByNumber,
  selectFeed,
  selectNewOrder,
  selectOrderRequest,
  selectUserOrders
} = ordersSlice.selectors;

export const ordersReducer = ordersSlice.reducer;
export const { setNewOrder } = ordersSlice.actions;
