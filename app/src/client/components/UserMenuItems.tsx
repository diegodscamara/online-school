import { Link } from 'wasp/client/router';
import { type User } from 'wasp/entities';
import { logout } from 'wasp/client/auth';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { TfiDashboard } from 'react-icons/tfi';
import { cn } from '../../shared/utils';
import { AiOutlineBook, AiOutlineLogout, AiOutlineUser } from 'react-icons/ai';

export const UserMenuItems = ({ user, setMobileMenuOpen }: { user?: Partial<User>; setMobileMenuOpen?: any }) => {
  const path = window.location.pathname;

  const handleMobileMenuClick = () => {
    if (setMobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <>
      {path === '/' || path === '/admin' ? (
        <ul
          className={cn(
            'group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50 dark:hover:bg-gray-700',
            {
              'sm:px-6': path !== '/admin',
              'px-6': path === '/admin',
            }
          )}
        >
          <li>
            <Link
              to='/demo-app'
              className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-yellow-500'
            >
              <div className='flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600'>
                <MdOutlineSpaceDashboard className='h-6 w-6 text-gray-600 group-hover:text-indigo-600 dark:text-gray-300 dark:group-hover:text-indigo-400' />
              </div>
              <span className='block font-semibold text-gray-900 dark:text-white'>AI Scheduler (Demo App)</span>
            </Link>
          </li>
        </ul>
      ) : null}
      <ul
        className={cn(
          'group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50 dark:hover:bg-gray-700',
          {
            'sm:px-6': path !== '/admin',
            'px-6': path === '/admin',
          }
        )}
      >
        <li>
          <Link
            to='/account'
            onClick={handleMobileMenuClick}
            className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-yellow-500'
          >
            <div className='flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600'>
              <AiOutlineUser className='h-6 w-6 text-gray-600 group-hover:text-indigo-600 dark:text-gray-300 dark:group-hover:text-indigo-400' />
            </div>
            <span className='block font-semibold text-gray-900 dark:text-white'>Account Settings</span>
          </Link>
        </li>
      </ul>
      <ul
        className={cn(
          'group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50 dark:hover:bg-gray-700',
          {
            'sm:px-6': path !== '/admin',
            'px-6': path === '/admin',
          }
        )}
      >
        <li>
          <Link
            to='/learning-profile'
            onClick={handleMobileMenuClick}
            className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-yellow-500'
          >
            <div className='flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600'>
              <AiOutlineBook className='h-6 w-6 text-gray-600 group-hover:text-indigo-600 dark:text-gray-300 dark:group-hover:text-indigo-400' />
            </div>
            <span className='block font-semibold text-gray-900 dark:text-white'>Learning Profile</span>
          </Link>
        </li>
      </ul>
      {!!user && user.isAdmin && (
        <ul
          className={cn(
            'group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50 dark:hover:bg-gray-700',
            {
              'sm:px-6': path !== '/admin',
              'px-6': path === '/admin',
            }
          )}
        >
          <li className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out'>
            <Link
              to='/admin'
              onClick={handleMobileMenuClick}
              className='flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out'
            >
              <div className='flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600'>
                <TfiDashboard className='h-6 w-6 text-gray-600 group-hover:text-indigo-600 dark:text-gray-300 dark:group-hover:text-indigo-400' />
              </div>
              <span className='block font-semibold text-gray-900 dark:text-white'>Admin Dashboard</span>
            </Link>
          </li>
        </ul>
      )}
      <button
        onClick={() => logout()}
        className={cn(
          'group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50 dark:hover:bg-gray-700 w-full',
          {
            'sm:px-6': path !== '/admin',
            'px-6': path === '/admin',
          }
        )}
      >
        <div className='flex items-center justify-center p-3 text-sm font-semibold rounded-lg  leading-6 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600'>
          <AiOutlineLogout className='h-5 w-5 flex-none text-gray-400 dark:text-gray-300' />
        </div>
        <span className='block font-semibold text-gray-900 dark:text-white'>Log Out</span>
      </button>
    </>
  );
};
