import { ordersReducer } from '../orders-slice';

const initialState = {
  newOrder: {
    order: null,
    name: ''
  },
  orderByNumber: null,
  orderRequest: false,
  loading: false,
  error: null
};

const mockOrder = {
  _id: 'order_id_1',
  ingredients: ['643d69a5c3f7b9001cfa0940', '643d69a5c3f7b9001cfa093d'],
  status: 'done',
  name: 'Био-марсианский метеоритный флюоресцентный люминесцентный бургер',
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  number: 12345
};


const mockNewOrderResponse = {
  success: true,
  name: 'Ваш заказ готовится',
  order: mockOrder
};

describe('Orders slice', () => {
  it('should return initial state', () => {
    const result = ordersReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('getOrderByNumberThunk', () => {
    it('should handle pending state', () => {
      const action = { type: 'feed/fetchByNumber/pending' };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.orderByNumber).toBe(null);
    });

    it('should handle fulfilled state', () => {
      const pendingState = { ...initialState, loading: true };
      const action = {
        type: 'feed/fetchByNumber/fulfilled',
        payload: mockOrder
      };
      const state = ordersReducer(pendingState, action);

      expect(state.loading).toBe(false);
      expect(state.orderByNumber).toEqual(mockOrder);
    });

    it('should handle rejected state', () => {
      const pendingState = { ...initialState, loading: true };
      const action = {
        type: 'feed/fetchByNumber/rejected',
        payload: 'Order not found'
      };
      const state = ordersReducer(pendingState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Order not found');
    });
  });

  describe('postUserBurger', () => {
    it('should handle pending state', () => {
      const action = { type: 'order/postUserBurger/pending' };
      const state = ordersReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.orderRequest).toBe(true);
    });

    it('should handle fulfilled state', () => {
      const pendingState = {
        ...initialState,
        loading: true,
        orderRequest: true
      };
      const action = {
        type: 'order/postUserBurger/fulfilled',
        payload: mockNewOrderResponse
      };
      const state = ordersReducer(pendingState, action);

      expect(state.loading).toBe(false);
      expect(state.orderRequest).toBe(false);
      expect(state.newOrder.order).toEqual(mockOrder);
      expect(state.newOrder.name).toBe('Ваш заказ готовится');
    });

    it('should handle rejected state', () => {
      const pendingState = {
        ...initialState,
        loading: true,
        orderRequest: true
      };
      const action = {
        type: 'order/postUserBurger/rejected',
        payload: 'Send error'
      };
      const state = ordersReducer(pendingState, action);

      expect(state.loading).toBe(false);
      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Send error');
    });
  });

  describe('clearNewOrder action', () => {
    it('should clear newOrder', () => {
      const stateWithOrder = {
        ...initialState,
        newOrder: {
          order: mockOrder,
          name: 'Test Order'
        }
      };

      const action = {
        type: 'orders/clearNewOrder'
      };
      const state = ordersReducer(stateWithOrder, action);

      expect(state.newOrder.order).toBe(null);
      expect(state.newOrder.name).toBe('');
    });
  });
});
