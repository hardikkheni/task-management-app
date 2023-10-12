import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import taskSlice from './slices/task.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
