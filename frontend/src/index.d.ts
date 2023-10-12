type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  created_at: string;
  updated_at: string;
};

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: 'Todo' | 'InPending' | 'Done';
  created_at: string;
  updated_at: string;
};
