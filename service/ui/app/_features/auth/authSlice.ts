import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/_redux/store';
import { IUser } from '@/_features/abstracts/models';
import { TOKEN_STORAGE_KEY } from '@/_services/auth';

type AuthState = {
  user: IUser | null;
  token: string | null;
};

let token = null;

try {
  token = localStorage.getItem(TOKEN_STORAGE_KEY);
} catch (e) {}

const INITIAL_STATE: AuthState = {
  user: null,
  token,
};

const slice = createSlice({
  name: 'auth',
  initialState: INITIAL_STATE,
  reducers: {
    setCredentials: (
      state: AuthState,
      {
        payload: { user, token },
      }: PayloadAction<{ user: IUser; token: string }>
    ) => {
      state.user = user;
      state.token = token;
    },
    setToken: (
      state: AuthState,
      { payload: { token } }: PayloadAction<{ token: string }>
    ) => {
      state.token = token;
    },
    setUser: (
      state: AuthState,
      { payload: { user } }: PayloadAction<{ user: IUser }>
    ) => {
      state.user = user;
    },
    setInvalidateCredentials: (state: AuthState) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, setInvalidateCredentials, setToken, setUser } =
  slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;
