import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { setCookie, getCookie } from '../../utils/cookie';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';

export interface AuthState {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (newUserData: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(newUserData);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      return response.user;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(
        error.message || 'Ошибка регистрации нового пользователя'
      );
    }
  }
);

export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(loginData);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || 'Ошибка входа (логина)');
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (userPartialData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(userPartialData);
      return response.user;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(
        error.message || 'Ошибка изменения данных пользователя'
      );
    }
  }
);

export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      setCookie('accessToken', '', { expires: -1 });
      localStorage.removeItem('refreshToken');

      return null;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || 'Ошибка выхода из системы');
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { rejectWithValue }) => {
    try {
      if (getCookie('accessToken')) {
        const response = await getUserApi();
        return response.user;
      }
      return null;
    } catch (err) {
      setCookie('accessToken', '', { expires: -1 });
      localStorage.removeItem('refreshToken');

      const error = err as Error;
      return rejectWithValue(error.message || 'Ошибка проверки авторизации');
    }
  }
);

export const setIsAuthChecked = createAction<boolean, 'user/setIsAuthChecked'>(
  'user/setIsAuthChecked'
);

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setIsAuthChecked, (state, action) => {
        state.isAuthChecked = action.payload;
      })

      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(logoutUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(checkUserAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.error = action.payload as string;
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUserLoading: (state) => state.loading,
    selectUserError: (state) => state.error
  }
});

export const {
  selectUser,
  selectIsAuthChecked,
  selectUserLoading,
  selectUserError
} = authSlice.selectors;
export const { setUser } = authSlice.actions;

export const userReducer = authSlice.reducer;
