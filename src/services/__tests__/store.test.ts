import { authSlice } from '../slices/auth-slice';
import { constructorSlice } from '../slices/constructor-slice';
import { ingredientsSlice } from '../slices/ingredients-slice';
import { ordersSlice } from '../slices/orders-slice';
import { rootReducer } from '../store';

describe('rootReducer', () => {
  it('should return initial state for unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const initialState = rootReducer(undefined, unknownAction);

    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('someconstructor');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('orders');

    expect(initialState.ingredients).toEqual(
      ingredientsSlice.getInitialState()
    );
    expect(initialState.someconstructor).toEqual(
      constructorSlice.getInitialState()
    );
    expect(initialState.user).toEqual(authSlice.getInitialState());
    expect(initialState.orders).toEqual(ordersSlice.getInitialState());
  });
});
