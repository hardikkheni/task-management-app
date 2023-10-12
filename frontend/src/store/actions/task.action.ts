import apiService from '../../lib/api';
import { setTaskState } from '../slices/task.slice';
import { AppDispatch, RootState } from '../store';

export const listOfTask = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const { search, status } = state.task.list;
  dispatch(
    setTaskState([
      { key: 'list.tasks', value: [] },
      { key: 'list.loading', value: true },
    ])
  );
  try {
    const data = (await apiService.get(`/task`, { params: { search, status } })).data;
    dispatch(
      setTaskState([
        { key: 'list.tasks', value: data.data },
        { key: 'list.loading', value: false },
      ])
    );
  } catch (err) {
    dispatch(
      setTaskState([
        { key: 'list.tasks', value: [] },
        { key: 'list.loading', value: false },
      ])
    );
    throw err;
  }
};

export const insertTask = (payload: Pick<Task, 'title' | 'status' | 'description'>) => async (dispatch: AppDispatch) => {
  dispatch(
    setTaskState([
      { key: 'list.tasks', value: [] },
      { key: 'list.loading', value: true },
    ])
  );
  const data = (await apiService.post('/task', payload)).data;
  return {
    message: data.message,
  };
};

export const deleteById = (id: string) => async () => {
  const data = (await apiService.delete(`/task/${id}`)).data;
  return {
    message: data.message,
  };
};

export const updateById = (id: string, status: string) => async () => {
  const data = (await apiService.put(`/task/${id}`, { status })).data;
  return {
    message: data.message,
  };
};
