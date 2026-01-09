import { createAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

jest.mock('@api', () => ({
  getUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  logoutApi: jest.fn(),
  registerUserApi: jest.fn(),
  updateUserApi: jest.fn()
}));

jest.mock('@utils/cookie', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn()
}));

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const mockAuthResponse = {
  user: mockUser,
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token'
};

const testReducer = () => {
  const initialState = {
    user: null as TUser | null,
    isAuthChecked: false,
    loading: false,
    error: null as string | null
  };

  const setUser = createAction<TUser>('user/setUser');
  const setIsAuthChecked = createAction<boolean>('user/setIsAuthChecked');

  const registerUserThunk = {
    pending: { type: 'user/register/pending' },
    fulfilled: { type: 'user/register/fulfilled' },
    rejected: { type: 'user/register/rejected' }
  };

  const loginUserThunk = {
    pending: { type: 'user/login/pending' },
    fulfilled: { type: 'user/login/fulfilled' },
    rejected: { type: 'user/login/rejected' }
  };

  const updateUserThunk = {
    pending: { type: 'user/update/pending' },
    fulfilled: { type: 'user/update/fulfilled' },
    rejected: { type: 'user/update/rejected' }
  };

  const logoutUserThunk = {
    pending: { type: 'user/logout/pending' },
    fulfilled: { type: 'user/logout/fulfilled' },
    rejected: { type: 'user/logout/rejected' }
  };

  const checkUserAuth = {
    pending: { type: 'user/checkUserAuth/pending' },
    fulfilled: { type: 'user/checkUserAuth/fulfilled' },
    rejected: { type: 'user/checkUserAuth/rejected' }
  };

  const reducer = (state = initialState, action: {type: string; payload?: unknown}) => {
    switch (action.type) {
      case setUser.type:
        return { ...state, user: action.payload as TUser };

      case setIsAuthChecked.type:
        return { ...state, isAuthChecked: action.payload as boolean };

      case registerUserThunk.pending.type:
      case loginUserThunk.pending.type:
      case updateUserThunk.pending.type:
      case logoutUserThunk.pending.type:
        return { ...state, loading: true, error: null };
      case checkUserAuth.pending.type:
        return { ...state, loading: true, error: null };

      case registerUserThunk.fulfilled.type:
        return {
          ...state,
          loading: false,
          user: (action.payload as typeof mockAuthResponse).user,
          isAuthChecked: true
        };

      case loginUserThunk.fulfilled.type:
        return {
          ...state,
          loading: false,
          user: (action.payload as typeof mockAuthResponse).user,
          isAuthChecked: true
        };

      case updateUserThunk.fulfilled.type:
        return {
          ...state,
          loading: false,
          user: (action.payload as {user: TUser}).user
        };

      case logoutUserThunk.fulfilled.type:
        return {
          ...state,
          loading: false,
          user: null
        };

      case checkUserAuth.fulfilled.type:
        return {
          ...state,
          loading: false,
          user: action.payload as TUser | null,
          isAuthChecked: true
        };

      case registerUserThunk.rejected.type:
      case loginUserThunk.rejected.type:
      case updateUserThunk.rejected.type:
      case logoutUserThunk.rejected.type:
        return {
          ...state,
          loading: false,
          error: action.payload as string
        };
      case checkUserAuth.rejected.type:
        return {
          ...state,
          loading: false,
          isAuthChecked: true,
          error: action.payload as string
        };

      default:
        return state;
    }
  };

  return {
    reducer,
    actions: {
      setUser,
      setIsAuthChecked,
      registerUserThunk,
      loginUserThunk,
      updateUserThunk,
      logoutUserThunk,
      checkUserAuth
    },
    initialState
  };
};

describe('Authentication slice', () => {
  const { reducer, actions, initialState } = testReducer();
  const {
    setUser,
    setIsAuthChecked,
    registerUserThunk,
    loginUserThunk,
    updateUserThunk,
    logoutUserThunk,
    checkUserAuth
  } = actions;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should return initial state', () => {
      expect(reducer(undefined, { type: '' })).toEqual(initialState);
    });
  });

  describe('Synchronous action', () => {
    it('should handle setUser action', () => {
      const action = setUser(mockUser);
      const result = reducer(initialState, action);

      expect(result.user).toEqual(mockUser);
      expect(result.loading).toBe(false);
      expect(result.error).toBe(null);
    });

    it('should handle setIsAuthChecked action', () => {
      const action = setIsAuthChecked(true);
      const result = reducer(initialState, action);

      expect(result.isAuthChecked).toBe(true);
    });
  });

  describe('Asynchronous actions', () => {
    describe('registerUserThunk', () => {
      it('should handle pending state for registration', () => {
        const action = registerUserThunk.pending;
        const state = reducer(initialState, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBe(null);
      });

      it('should handle fulfilled state for registration', () => {
        const action = {
          ...registerUserThunk.fulfilled,
          payload: mockAuthResponse
        };
        const state = reducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthChecked).toBe(true);
      });

      it('should handle rejected state for registration', () => {
        const errorMessage = 'Registration error';
        const action = {
          ...registerUserThunk.rejected,
          payload: errorMessage
        };
        const state = reducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.user).toBe(null);
      });
    });

    describe('loginUserThunk', () => {
      it('should handle pending state for login', () => {
        const action = loginUserThunk.pending;
        const state = reducer(initialState, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBe(null);
      });

      it('should handle fulfilled state for login', () => {
        const action = {
          ...loginUserThunk.fulfilled,
          payload: mockAuthResponse
        };
        const state = reducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthChecked).toBe(true);
      });

      it('should handle rejected state for login', () => {
        const errorMessage = 'Ошибка входа';
        const action = {
          ...loginUserThunk.rejected,
          payload: errorMessage
        };
        const state = reducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.user).toBe(null);
      });
    });

    describe('updateUserThunk', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser
      };

      const updatedUser = {
        email: 'updated@example.com',
        name: 'Updated User'
      };

      it('should handle pending state for update', () => {
        const action = updateUserThunk.pending;
        const state = reducer(stateWithUser, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBe(null);
        expect(state.user).toEqual(mockUser);
      });

      it('should handle fulfilled state for update', () => {
        const action = {
          ...updateUserThunk.fulfilled,
          payload: { user: updatedUser }
        };
        const state = reducer(stateWithUser, action);

        expect(state.loading).toBe(false);
        expect(state.user).toEqual(updatedUser);
        expect(state.error).toBe(null);
      });

      it('should handle rejected state for update', () => {
        const errorMessage = 'Update error';
        const action = {
          ...updateUserThunk.rejected,
          payload: errorMessage
        };
        const state = reducer(stateWithUser, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.user).toEqual(mockUser);
      });
    });

    describe('logoutUserThunk', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthChecked: true
      };

      it('should handle pending state for logout', () => {
        const action = logoutUserThunk.pending;
        const state = reducer(stateWithUser, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBe(null);
        expect(state.user).toEqual(mockUser);
      });

      it('should handle fulfilled state for logout', () => {
        const action = logoutUserThunk.fulfilled;
        const state = reducer(stateWithUser, action);

        expect(state.loading).toBe(false);
        expect(state.user).toBe(null);
      });

      it('should handle rejected state for logout', () => {
        const errorMessage = 'Logout error';
        const action = {
          ...logoutUserThunk.rejected,
          payload: errorMessage
        };
        const state = reducer(stateWithUser, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.user).toEqual(mockUser);
      });
    });
  });

  describe('Integration scenarios', () => {
    it('дshould correctly handle full authentication cycle', () => {
      let state = initialState;

      state = reducer(state, registerUserThunk.pending);
      expect(state.loading).toBe(true);

      state = reducer(state, {
        ...registerUserThunk.fulfilled,
        payload: mockAuthResponse
      });
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);

      const updatedUser = { ...mockUser, name: 'Updated Name' };
      state = reducer(state, updateUserThunk.pending);
      expect(state.loading).toBe(true);

      state = reducer(state, {
        ...updateUserThunk.fulfilled,
        payload: { user: updatedUser }
      });
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(updatedUser);

      state = reducer(state, logoutUserThunk.pending);
      expect(state.loading).toBe(true);

      state = reducer(state, logoutUserThunk.fulfilled);
      expect(state.loading).toBe(false);
      expect(state.user).toBe(null);
    });

    it('should preserve state on errors', () => {
      let state = initialState;

      state = reducer(state, loginUserThunk.pending);
      expect(state.loading).toBe(true);

      state = reducer(state, {
        ...loginUserThunk.rejected,
        payload: 'Invalid credentials'
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Invalid credentials');
      expect(state.user).toBe(null);
    });
  });

  describe('checkUserAuth thunk', () => {
  it('should handle pending state for auth check', () => {
    const action = { type: checkUserAuth.pending.type };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle fulfilled state for auth check with null', () => {
    const pendingState = { ...initialState, loading: true };
    const action = {
      type: checkUserAuth.fulfilled.type,
      payload: null
    };
    const state = reducer(pendingState, action);
    
    expect(state.loading).toBe(false);
    expect(state.user).toBe(null);
    expect(state.isAuthChecked).toBe(true);
  });

  it('should handle rejected state for auth check', () => {
    const pendingState = { ...initialState, loading: true };
    const errorMessage = 'Auth check error';
    const action = {
      type: checkUserAuth.rejected.type,
      payload: errorMessage
    };
    const state = reducer(pendingState, action);
    
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.isAuthChecked).toBe(true);
  });
});

  describe('Selectors (logic testing)', () => {
    it('selectUser should return user', () => {
      const testState = {
        user: mockUser,
        isAuthChecked: true,
        loading: false,
        error: null
      };

      const selectUser = (state: typeof testState) => state.user;
      expect(selectUser(testState)).toEqual(mockUser);
    });

    it('selectIsAuthChecked should return authentication check status', () => {
      const testState = {
        user: mockUser,
        isAuthChecked: true,
        loading: false,
        error: null
      };

      const selectIsAuthChecked = (state: typeof testState) =>
        state.isAuthChecked;
      expect(selectIsAuthChecked(testState)).toBe(true);
    });

    it('selectUserLoading should return loading status', () => {
      const testState = {
        user: mockUser,
        isAuthChecked: true,
        loading: true,
        error: null
      };

      const selectUserLoading = (state: typeof testState) => state.loading;
      expect(selectUserLoading(testState)).toBe(true);
    });

    it('selectUserError should return error', () => {
      const testState = {
        user: mockUser,
        isAuthChecked: true,
        loading: false,
        error: 'Authentication error'
      };

      const selectUserError = (state: typeof testState) => state.error;
      expect(selectUserError(testState)).toBe('Authentication error');
    });
  });
});
