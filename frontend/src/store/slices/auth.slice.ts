import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { isArray, set } from 'lodash';
import { tokenKey } from '../../lib/api';

interface AuthState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: User;
  loaded: boolean;
}

const initialState: AuthState = {
  loaded: false,
};

type AuthStatePayload = {
  key: keyof AuthState;
  value: AuthState[keyof AuthState];
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<AuthStatePayload[] | AuthStatePayload>) => {
      if (isArray(action.payload)) {
        action.payload.forEach(({ key, value }) => {
          set(state, key, value);
        });
      } else {
        const { key, value } = action.payload;
        set(state, key, value);
      }
    },
    logOut: (state) => {
      state.user = undefined;
      localStorage.removeItem(tokenKey);
    },
  },
});

export const { setAuthState, logOut } = authSlice.actions;

export default authSlice.reducer;
