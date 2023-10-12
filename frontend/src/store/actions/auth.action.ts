import { setAuthState } from '../slices/auth.slice';
import { AppDispatch } from './../store';
import apiService, { tokenKey } from './../../lib/api';

type SignUpPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
type LoginPayload = {
  email: string;
  password: string;
};

export const register = (payload: SignUpPayload) => async (dispatch: AppDispatch) => {
  const data = (await apiService.post('/auth/register', payload)).data;
  localStorage.setItem(tokenKey, data.data.accessToken);
  dispatch(setAuthState([{ key: 'user', value: data.data.user }]));
  return {
    message: data.message,
  };
};

export const login = (payload: LoginPayload) => async (dispatch: AppDispatch) => {
  const data = (await apiService.post('/auth/login', payload)).data;
  localStorage.setItem(tokenKey, data.data.accessToken);
  dispatch(
    setAuthState([
      { key: 'user', value: data.data.user },
      { key: 'loaded', value: true },
    ])
  );
  return {
    message: data.message,
  };
};

export const profile = () => async (dispatch: AppDispatch) => {
  if (!localStorage.getItem(tokenKey)) {
    dispatch(
      setAuthState([
        { key: 'loaded', value: true },
        { key: 'user', value: undefined },
      ])
    );
    return;
  }
  dispatch(setAuthState({ key: 'loaded', value: false }));
  try {
    const data = (await apiService.get('/auth/profile')).data;
    dispatch(
      setAuthState([
        { key: 'user', value: data.data.user },
        { key: 'loaded', value: true },
      ])
    );
  } catch (err) {
    dispatch(setAuthState([{ key: 'loaded', value: true }]));
    throw err;
  }
};
