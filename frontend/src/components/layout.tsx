import { ReactNode } from 'react';
import UserNav from './user-nav';
import { useAppDispatch, useAppSelector } from '../store';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../store/slices/auth.slice';
import { MainNav } from './main-nav';

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <>
      <div className="flex-col flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div>Task Management</div>
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav
                initials={`${user?.firstName?.[0]}${user?.lastName?.[0]}`}
                url={user?.avatar as string}
                name={user?.firstName + ' ' + user?.lastName}
                email={user?.email as string}
                logOut={() => {
                  dispatch(logOut());
                  navigate('/login');
                }}
                navigate={navigate}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
    </>
  );
}
