import { Outlet, createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/home.page';
import LoginPage from './pages/login.page';
import SignUp from './pages/signup.page';
import NotFoundPage from './pages/not-found.page';
import WithGuard from './components/with-guard';
import ProfilePage from './pages/profile.page';
import TaskPage from './pages/task.page';
import Layout from './components/layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    children: [
      {
        path: '/',
        element: (
          <WithGuard
            children={
              <Layout>
                <Outlet />
              </Layout>
            }
            guard="private"
          />
        ),
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/task', element: <TaskPage /> },
        ],
      },
      { path: '/login', element: <WithGuard children={<LoginPage />} guard="guest" /> },
      { path: '/signup', element: <WithGuard children={<SignUp />} guard="guest" /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export default router;
