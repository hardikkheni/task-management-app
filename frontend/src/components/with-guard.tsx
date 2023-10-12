import { ReactNode, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store';

interface Props {
  children?: ReactNode;
  guard: 'private' | 'guest' | 'all';
}

export default function WithGuard({ children, guard = 'all' }: Props) {
  const { user, loaded } = useAppSelector((state) => state.auth);
  if (!loaded) {
    return <div className="d-flex align-items-center justify-content-center">loading</div>;
  }
  if (loaded && guard === 'private' && !user) {
    return <Navigate to={'/login'} />;
  }
  if (loaded && guard === 'guest' && user) {
    return <Navigate to={'/'} />;
  }
  return <Suspense>{children}</Suspense>;
}
