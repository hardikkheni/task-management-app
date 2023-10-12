import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { isArray, set } from 'lodash';

interface TaskState {
  list: {
    tasks: Task[];
    search?: string;
    status?: 'Todo' | 'InPending' | 'Done';
    loading: boolean;
  };
}
const initialState: TaskState = {
  list: {
    tasks: [],
    loading: false,
  },
};

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setTaskState: (state, action: PayloadAction<any>) => {
      if (isArray(action.payload)) {
        action.payload.forEach(({ key, value }) => {
          set(state, key, value);
        });
      } else {
        const { key, value } = action.payload;
        set(state, key, value);
      }
    },
  },
});

export const { setTaskState } = taskSlice.actions;

export default taskSlice.reducer;
