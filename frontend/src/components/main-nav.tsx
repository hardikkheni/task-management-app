import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

const links = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Tasks',
    path: '/task',
  },
  {
    name: 'Profile',
    path: '/profile',
  },
];

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const { pathname } = useLocation();
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      {...links.map((li) => (
        <NavLink
          to={li.path}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === li.path && 'text-muted-foreground transition-colors hover:text-primary'
          )}
        >
          {li.name}
        </NavLink>
      ))}
    </nav>
  );
}
