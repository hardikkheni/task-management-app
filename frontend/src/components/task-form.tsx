import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import * as Yup from 'yup';
import { Label } from './ui/label';
import { Input } from './ui/input';
import useNotify from '../hooks/notify';
import { useAppDispatch } from '../store';
import { useFormik } from 'formik';
import { insertTask } from '../store/actions/task.action';
import { useState } from 'react';
import { Select } from '@radix-ui/react-select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const status = ['Todo', 'InPending', 'Done'];

const TaskSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().optional(),
  status: Yup.mixed().oneOf(status),
});

type Props = {
  added: () => void;
};

export default function TaskForm({ added }: Props) {
  const [open, setOpen] = useState(false);
  const { notify } = useNotify();
  const dispatch = useAppDispatch();
  const form = useFormik<Pick<Task, 'title' | 'status' | 'description'>>({
    initialValues: {
      title: '',
      description: '',
      status: 'Todo',
    },
    validationSchema: TaskSchema,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSubmit: async ({ ...values }, { setErrors, resetForm, setSubmitting }) => {
      try {
        const { message } = await dispatch(insertTask(values));
        notify(message, 'success');
        resetForm();
        added();
        setOpen(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err.errors) {
          setErrors(err.errors);
        }
        notify(err.message, 'error');
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Add Task</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={form.handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>Create new Task</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label>Title</Label>
                  <Input name="title" placeholder="Title" value={form.values.title} onChange={form.handleChange} />
                  <span className="text-red-500 text-xs">{form.errors.title}</span>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label>Description</Label>
                  <Input name="description" placeholder="Description" value={form.values.description} onChange={form.handleChange} />
                  <span className="text-red-500 text-xs">{form.errors.description}</span>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label>Status</Label>
                  <Select name="status" value={form.values.status} onValueChange={(s) => form.setFieldValue('status', s)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {status.map((s, i) => (
                        <SelectItem value={s} key={i}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-red-500 text-xs">{form.errors.status}</span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2">
            <Button variant={'outline'} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
