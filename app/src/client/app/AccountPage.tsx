import { Link } from 'wasp/client/router';
import { type User } from 'wasp/entities';
import { useState } from 'react';
import { updateCurrentUser, createFile } from 'wasp/client/operations';
import { AiOutlineUser, AiOutlineMail, AiOutlineEdit } from 'react-icons/ai';
import { FiUpload, FiInfo } from 'react-icons/fi';
import { useNotification } from '../hooks/useNotification';
import { z } from 'zod';
import { TierIds } from '../../shared/constants';

export default function AccountPage({ user }: { user: User }) {
  const [fullName, setFullName] = useState(user.fullName || '');
  const [userName, setUserName] = useState(user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [about, setAbout] = useState(user.about || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const addNotification = useNotification();

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUpdating(true);
    try {
      await updateCurrentUser({ fullName, email, about, username: userName, avatarUrl });
      addNotification({
        title: 'User information updated successfully!',
        description: 'Your changes have been saved.',
        variant: 'success',
        duration: 5000,
      });
    } catch (error) {
      console.error(error);
      addNotification({
        title: 'Failed to update user information.',
        description: 'An error occurred. Please try again.',
        variant: 'error',
        duration: 5000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { uploadUrl, key } = await createFile({ fileType: file.type, name: file.name });
        await fetch(uploadUrl, { method: 'PUT', body: file });
        const uploadedUrl = uploadUrl.split('?')[0];
        console.log('Uploaded URL:', uploadedUrl); // Debugging output
        setAvatarUrl(uploadedUrl);
        addNotification({
          title: 'Avatar uploaded successfully!',
          description: 'Your avatar has been updated.',
          variant: 'success',
          duration: 5000,
        });
      } catch (error) {
        console.error(error);
        addNotification({
          title: 'Failed to upload avatar.',
          description: 'An error occurred. Please try again.',
          variant: 'error',
          duration: 5000,
        });
      }
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className='mt-10 px-6 h-full py-20'>
      <form onSubmit={handleUpdate}>
        <div className='overflow-hidden border border-gray-900/10 shadow-lg sm:rounded-lg lg:m-8 dark:border-gray-100/10'>
          <div className='flex items-center px-4 py-5 sm:px-6 lg:px-8'>
            <h2 className='text-lg leading-6 font-medium text-gray-900 dark:text-white'>Account Information</h2>
          </div>
          <div className='border-t border-gray-900/10 dark:border-gray-100/10 px-4 py-5 sm:p-0'>
            <dl className='sm:divide-y sm:divide-gray-900/10 sm:dark:divide-gray-100/10'>
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500 dark:text-white'>Email address</dt>
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <AiOutlineMail className='text-gray-500 dark:text-gray-400' />
                    </div>
                    <input
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='w-full pl-10 rounded-md border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white'
                    />
                  </div>
                </dd>
              </div>
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500 dark:text-white'>Username</dt>
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <AiOutlineUser className='text-gray-500 dark:text-gray-400' />
                    </div>
                    <input
                      type='text'
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className='w-full pl-10 rounded-md border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white'
                    />
                  </div>
                </dd>
              </div>
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500 dark:text-white'>Full Name</dt>
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <AiOutlineEdit className='text-gray-500 dark:text-gray-400' />
                    </div>
                    <input
                      type='text'
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className='w-full pl-10 rounded-md border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white'
                    />
                  </div>
                </dd>
              </div>
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500 dark:text-white'>Avatar</dt>
                <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                  <div className='flex items-center gap-4'>
                    {avatarUrl ? (
                      <img src={avatarUrl} alt='Avatar' className='h-12 w-12 rounded-full' />
                    ) : (
                      <div className='h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700'>
                        {getInitials(fullName)}
                      </div>
                    )}
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleFileChange}
                      className='hidden'
                      id='avatar-upload'
                    />
                    <label
                      htmlFor='avatar-upload'
                      className='cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700'
                    >
                      <FiUpload className='mr-2' /> Upload
                    </label>
                  </div>
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
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 bottom-[29px] pl-3 flex items-center pointer-events-none'>
                      <FiInfo className='text-gray-500 dark:text-gray-400' />
                    </div>
                    <textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      className='w-full pl-10 rounded-md border-gray-300 shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white'
                    />
                  </div>
                </dd>
              </div>
            </dl>
          </div>
          <div className='px-4 py-5 sm:px-6 lg:px-8 flex justify-end'>
            <button
              type='submit'
              className='inline-flex justify-center py-2 px-4 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Information'}
            </button>
          </div>
        </div>
      </form>
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
  const addNotification = useNotification();

  const handleClick = () => {
    try {
      const schema = z.string().url();
      const customerPortalUrl = schema.parse(import.meta.env.REACT_APP_STRIPE_CUSTOMER_PORTAL);
      window.open(customerPortalUrl, '_blank');
    } catch (err) {
      console.error(err);
      // Only add notification if there is an actual error in getting the URL
      addNotification({
        title: 'Failed to open customer portal',
        description: 'Invalid URL. Please try again.',
        variant: 'error',
        duration: 5000,
      });
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
