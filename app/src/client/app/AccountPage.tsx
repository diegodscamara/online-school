import { Link } from 'wasp/client/router';
import { type User } from 'wasp/entities';
import { logout } from 'wasp/client/auth';
import { TierIds } from '../../shared/constants';
import { useState } from 'react';
import { updateCurrentUser } from 'wasp/client/operations';
import { z } from 'zod';

export default function AccountPage({ user }: { user: User }) {
  const [fullName, setFullname] = useState(user.fullName || '');
  const [userName, setUserName] = useState(user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [about, setAbout] = useState(user.about || ''); // New state for about
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await updateCurrentUser({ fullName, email, about, username: userName });
      alert('User information updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update user information.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className='mt-10 px-6'>
      <div className='overflow-hidden border border-gray-900/10 shadow-lg sm:rounded-lg lg:m-8 dark:border-gray-100/10 pt-16'>
        <div className='px-4 py-5 sm:px-6 lg:px-8'>
          <h3 className='text-base font-semibold leading-6 text-gray-900 dark:text-white'>Account Information</h3>
        </div>
        <div className='border-t border-gray-900/10 dark:border-gray-100/10 px-4 py-5 sm:p-0'>
          <dl className='sm:divide-y sm:divide-gray-900/10 sm:dark:divide-gray-100/10'>
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500 dark:text-white'>Email address</dt>
              <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white'
                />
              </dd>
            </div>
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500 dark:text-white'>Username</dt>
              <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                <input
                  type='text'
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className='w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white'
                />
              </dd>
            </div>
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500 dark:text-white'>Full Name</dt>
              <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                <input
                  type='text'
                  value={fullName}
                  onChange={(e) => setFullname(e.target.value)}
                  className='w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white'
                />
              </dd>
            </div>
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500 dark:text-white'>Your Plan</dt>
              {user.subscriptionStatus !== 'past_due' ? (
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-1 sm:mt-0'>
                  {user.subscriptionTier === TierIds.BASIC ? 'Basic' : 'Pro'} Plan
                </dd>
              ) : (
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-1 sm:mt-0'>
                  Your Account is Past Due! Please Update your Payment Information
                </dd>
              )}
              <CustomerPortalButton />
            </div>
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500 dark:text-white'>Hours remaining</dt>
              <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-1 sm:mt-0'>{user.credits}</dd>
              <BuyMoreButton />
            </div>
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500 dark:text-white'>About</dt>
              <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className='w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white'
                />
              </dd>
            </div>
          </dl>
        </div>
        <div className='px-4 py-5 sm:px-6 lg:px-8'>
          <button
            onClick={handleUpdate}
            className='inline-flex justify-center py-2 px-4 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Information'}
          </button>
        </div>
      </div>
      <div className='inline-flex w-full justify-end'>
        <button
          onClick={logout}
          className='inline-flex justify-center mx-8 py-2 px-4 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function BuyMoreButton() {
  return (
    <div className='ml-4 flex-shrink-0 sm:col-span-1 sm:mt-0'>
      <Link to='/pricing' className='font-medium text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500'>
        Buy More/Upgrade
      </Link>
    </div>
  );
}

function CustomerPortalButton() {
  const handleClick = () => {
    try {
      const schema = z.string().url();
      const customerPortalUrl = schema.parse(import.meta.env.REACT_APP_STRIPE_CUSTOMER_PORTAL);
      window.open(customerPortalUrl, '_blank');
      console.log(customerPortalUrl);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='ml-4 flex-shrink-0 sm:col-span-1 sm:mt-0'>
      <button
        onClick={handleClick}
        className='font-medium text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'
      >
        Manage Subscription
      </button>
    </div>
  );
}
