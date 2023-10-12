import { useCallback, useEffect, useState } from 'react';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useAppDispatch, useAppSelector } from '../store';
import { deleteById, listOfTask, updateById } from '../store/actions/task.action';
import TaskForm from '../components/task-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import useNotify from '../hooks/notify';
import { setTaskState } from '../store/slices/task.slice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const statuses = ['Todo', 'InPending', 'Done'];

export default function TaskPage() {
  const dispatch = useAppDispatch();
  const { notify } = useNotify();
  const {
    list: { tasks, loading, search, status },
  } = useAppSelector((state) => state.task);

  const refresh = useCallback(() => {
    dispatch(listOfTask());
  }, [dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Task Management</h2>
          <p className="text-muted-foreground">Here's a list of your tasks for this month!</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 md:flex items-center justify-between">
            <Input
              placeholder="Search task"
              value={search}
              onChange={(e) => {
                dispatch(setTaskState([{ key: 'list.search', value: e.target.value }]));
                refresh();
              }}
            />
            <Select
              name="status"
              value={status}
              onValueChange={(s) => {
                dispatch(setTaskState([{ key: 'list.status', value: s }]));
                refresh();
              }}
            >
              <SelectTrigger className="mt-2 md:mt-0 md:ml-2 md:w-[400px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All</SelectItem>
                {statuses.map((s, i) => (
                  <SelectItem value={s} key={i}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="ml-3">
            <TaskForm
              added={() => {
                refresh();
              }}
            />
          </div>
        </div>

        <Table>
          <TableCaption>A list of your tasks.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>Loading</>
            ) : tasks.length > 0 ? (
              tasks.map((task: Task) => (
                <TableRow key={task._id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {statuses.map((s) => {
                          if (s === task.status) return;
                          return (
                            <DropdownMenuItem
                              onClick={async () => {
                                try {
                                  const { message } = await dispatch(updateById(task._id, s));
                                  notify(message, 'success');
                                  refresh();
                                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                } catch (err: any) {
                                  notify(err.message, 'success');
                                }
                              }}
                            >
                              Mark as {s}
                            </DropdownMenuItem>
                          );
                        })}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={async () => {
                            try {
                              const { message } = await dispatch(deleteById(task._id));
                              notify(message, 'success');
                              refresh();
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            } catch (err: any) {
                              notify(err.message, 'success');
                            }
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="font-medium text-center">
                  No Task found!.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
