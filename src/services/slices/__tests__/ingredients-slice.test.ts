import { ingredientsReducer } from '../ingredients-slice';

const initialState = {
  ingredients: [],
  loading: false,
  error: null
};

const mockApiResponse = {
  success: true,
  data: [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      __v: 0
    }
  ]
};

describe('Ingredients slice', () => {
  it('should return initial state', () => {
    const result = ingredientsReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should handle pending action', () => {
    const action = { type: 'ingredients/fetchIngredients/pending' };
    const result = ingredientsReducer(initialState, action);

    expect(result.loading).toBe(true);
    expect(result.error).toBe(null);
  });

  it('should handle fulfilled action', () => {
    const pendingState = { ...initialState, loading: true };
    const action = {
      type: 'ingredients/fetchIngredients/fulfilled',
      payload: mockApiResponse
    };
    const result = ingredientsReducer(pendingState, action);

    expect(result.loading).toBe(false);
    expect(result.error).toBe(null);
    expect(result.ingredients).toEqual(mockApiResponse);
  });

  it('should handle rejected action', () => {
    const pendingState = { ...initialState, loading: true };
    const action = {
      type: 'ingredients/fetchIngredients/rejected',
      payload: 'Ошибка'
    };
    const result = ingredientsReducer(pendingState, action);

    expect(result.loading).toBe(false);
    expect(result.error).toBe('Ошибка');
  });
});
