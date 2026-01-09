import { constructorReducer, initialState } from '../constructor-slice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
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
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0940',
  name: 'Говяжий метеорит (отбивная)',
  type: 'main',
  proteins: 800,
  fat: 800,
  carbohydrates: 300,
  calories: 2674,
  price: 3000,
  image: 'https://code.s3.yandex.net/react/code/meat-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png'
};

const mockSauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

describe('Constructor Slice', () => {
  describe('Initial state', () => {
    it('дshould return initial state', () => {
      const result = constructorReducer(undefined, { type: '' });
      expect(result).toEqual(initialState);
    });
  });

  describe('addIngredient action', () => {
    it('should add bun to burger', () => {
      const action = {
        type: 'someconstructor/addIngredient',
        payload: {
          ...mockBun,
          id: expect.any(String)
        }
      };

      const result = constructorReducer(initialState, action);
      expect(result.burger.bun).toEqual(action.payload);
      expect(result.burger.ingredients).toEqual([]);
      expect(result.burger.bun?._id).toBeDefined();
    });

    it('should add ingredient to burger', () => {
      const action = {
        type: 'someconstructor/addIngredient',
        payload: {
          ...mockIngredient,
          id: expect.any(String)
        }
      };

      const result = constructorReducer(initialState, action);

      expect(result.burger.bun).toBeNull();
      expect(result.burger.ingredients).toHaveLength(1);
      expect(result.burger.ingredients[0]).toEqual(action.payload);
      expect(result.burger.ingredients[0].id).toBeDefined();
    });

    it('should replace bun when adding new bun', () => {
      const firstAction = {
        type: 'someconstructor/addIngredient',
        payload: {
          ...mockBun,
          id: 'first_bun_id'
        }
      };

      const stateWithBun = constructorReducer(initialState, firstAction);

      const secondBun: TIngredient = {
        ...mockBun,
        _id: 'new_bun_id',
        name: 'New space bun',
        price: 1234
      };

      const secondAction = {
        type: 'someconstructor/addIngredient',
        payload: {
          ...secondBun,
          id: 'second_bun_id'
        }
      };

      const result = constructorReducer(stateWithBun, secondAction);

      expect(result.burger.bun).toEqual(secondAction.payload);
      expect(result.burger.bun?._id).toBe('new_bun_id');
      expect(result.burger.bun?.name).toBe('New space bun');
    });

    it('should add multiple ingredients to burger', () => {
      let state = initialState;

      const bunAction = {
        type: 'someconstructor/addIngredient',
        payload: { ...mockBun, id: 'bun_id_1' }
      };
      state = constructorReducer(state, bunAction);

      const firstIngredientAction = {
        type: 'someconstructor/addIngredient',
        payload: { ...mockIngredient, id: 'ingredient_id_1' }
      };
      state = constructorReducer(state, firstIngredientAction);

      const secondIngredientAction = {
        type: 'someconstructor/addIngredient',
        payload: { ...mockSauce, id: 'sauce_id_1' }
      };
      state = constructorReducer(state, secondIngredientAction);

      expect(state.burger.bun).toEqual(bunAction.payload);
      expect(state.burger.ingredients).toHaveLength(2);
      expect(state.burger.ingredients[0]).toEqual(
        firstIngredientAction.payload
      );
      expect(state.burger.ingredients[1]).toEqual(
        secondIngredientAction.payload
      );
    });
  });

  describe('removeIngredients action', () => {
    it('should remove ingredient by id', () => {
      const stateWithIngredients = {
        ...initialState,
        burger: {
          bun: null,
          ingredients: [
            { ...mockIngredient, id: 'id_1' },
            { ...mockSauce, id: 'id_2' },
            { ...mockIngredient, id: 'id_3' }
          ]
        }
      };

      const action = {
        type: 'someconstructor/removeIngredients',
        payload: 'id_2'
      };

      const result = constructorReducer(stateWithIngredients, action);

      expect(result.burger.ingredients).toHaveLength(2);
      expect(result.burger.ingredients[0].id).toBe('id_1');
      expect(result.burger.ingredients[1].id).toBe('id_3');
      expect(result.burger.ingredients).not.toContainEqual(
        expect.objectContaining({ id: 'id_2' })
      );
    });

    it('should not remove anything if id is not found', () => {
      const stateWithIngredients = {
        ...initialState,
        burger: {
          bun: null,
          ingredients: [
            { ...mockIngredient, id: 'id_1' },
            { ...mockSauce, id: 'id_2' }
          ]
        }
      };

      const action = {
        type: 'someconstructor/removeIngredients',
        payload: 'non_existent_id'
      };

      const result = constructorReducer(stateWithIngredients, action);

      expect(result.burger.ingredients).toHaveLength(2);
      expect(result.burger.ingredients).toEqual(
        stateWithIngredients.burger.ingredients
      );
    });

    it('should handle empty ingredients array correctly', () => {
      const action = {
        type: 'someconstructor/removeIngredients',
        payload: 'some_id'
      };

      const result = constructorReducer(initialState, action);

      expect(result.burger.ingredients).toEqual([]);
    });
  });

  describe('changeIngredient action', () => {
    it('should swap ingredients by specified indices', () => {
      const stateWithIngredients = {
        ...initialState,
        burger: {
          bun: null,
          ingredients: [
            { ...mockIngredient, id: 'id_1', name: 'First' },
            { ...mockSauce, id: 'id_2', name: 'Second' },
            { ...mockIngredient, id: 'id_3', name: 'Third' }
          ]
        }
      };

      const action = {
        type: 'someconstructor/changeIngredient',
        payload: {
          first: 0,
          second: 2
        }
      };

      const result = constructorReducer(stateWithIngredients, action);

      expect(result.burger.ingredients[0].id).toBe('id_3');
      expect(result.burger.ingredients[0].name).toBe('Third');
      expect(result.burger.ingredients[1].id).toBe('id_2');
      expect(result.burger.ingredients[1].name).toBe('Second');
      expect(result.burger.ingredients[2].id).toBe('id_1');
      expect(result.burger.ingredients[2].name).toBe('First');
    });

    it('should swap adjacent ingredients', () => {
      const stateWithIngredients = {
        ...initialState,
        burger: {
          bun: null,
          ingredients: [
            { ...mockIngredient, id: 'id_1', name: 'First' },
            { ...mockSauce, id: 'id_2', name: 'Second' },
            { ...mockIngredient, id: 'id_3', name: 'Third' }
          ]
        }
      };

      const action = {
        type: 'someconstructor/changeIngredient',
        payload: {
          first: 0,
          second: 1
        }
      };

      const result = constructorReducer(stateWithIngredients, action);

      expect(result.burger.ingredients[0].id).toBe('id_2');
      expect(result.burger.ingredients[0].name).toBe('Second');
      expect(result.burger.ingredients[1].id).toBe('id_1');
      expect(result.burger.ingredients[1].name).toBe('First');
      expect(result.burger.ingredients[2].id).toBe('id_3');
      expect(result.burger.ingredients[2].name).toBe('Third');
    });

    it('should not change state when swapping same indices', () => {
      const stateWithIngredients = {
        ...initialState,
        burger: {
          bun: null,
          ingredients: [
            { ...mockIngredient, id: 'id_1' },
            { ...mockSauce, id: 'id_2' }
          ]
        }
      };

      const action = {
        type: 'someconstructor/changeIngredient',
        payload: {
          first: 0,
          second: 0
        }
      };

      const result = constructorReducer(stateWithIngredients, action);

      expect(result.burger.ingredients).toEqual(
        stateWithIngredients.burger.ingredients
      );
    });

    it('should handle empty ingredients array correctly', () => {
      const action = {
        type: 'someconstructor/changeIngredient',
        payload: {
          first: 0,
          second: 1
        }
      };

      const result = constructorReducer(initialState, action);

      expect(result.burger.ingredients).toEqual([]);
    });

    it('should handle array with single ingredient correctly', () => {
      const stateWithSingleIngredient = {
        ...initialState,
        burger: {
          bun: null,
          ingredients: [{ ...mockIngredient, id: 'id_1' }]
        }
      };

      const action = {
        type: 'someconstructor/changeIngredient',
        payload: {
          first: 0,
          second: 0
        }
      };

      const result = constructorReducer(stateWithSingleIngredient, action);

      expect(result.burger.ingredients).toEqual(
        stateWithSingleIngredient.burger.ingredients
      );
    });
  });

  describe('clearConstructor action', () => {
    it('should completely clear burger', () => {
      const stateWithBurger = {
        ...initialState,
        burger: {
          bun: { ...mockBun, id: 'bun_id' },
          ingredients: [
            { ...mockIngredient, id: 'id_1' },
            { ...mockSauce, id: 'id_2' }
          ]
        }
      };

      const action = {
        type: 'someconstructor/clearConstructor'
      };

      const result = constructorReducer(stateWithBurger, action);

      expect(result.burger.bun).toBeNull();
      expect(result.burger.ingredients).toEqual([]);
    });

    it('should handle already empty burger correctly', () => {
      const action = {
        type: 'someconstructor/clearConstructor'
      };

      const result = constructorReducer(initialState, action);

      expect(result.burger.bun).toBeNull();
      expect(result.burger.ingredients).toEqual([]);
    });
  });
});
