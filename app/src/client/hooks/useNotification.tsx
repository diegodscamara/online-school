import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import { ReactNode, createContext, useContext, useState } from 'react';
import { animated, useTransition } from '@react-spring/web';

interface NotificationProps {
  id?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: 'success' | 'error' | 'info' | 'warning';
  primaryButton?: { text: string; onClick: () => void };
  secondaryButton?: { text: string; onClick: () => void };
  primaryLink?: { text: string; href: string };
  secondaryLink?: { text: string; href: string };
  duration?: number; // in milliseconds
  onClose?: () => void;
}

const variantClasses = {
  success: 'bg-green-50 text-green-800',
  error: 'bg-red-50 text-red-800',
  info: 'bg-blue-50 text-blue-800',
  warning: 'bg-yellow-50 text-yellow-800',
};

const variantIcon = {
  success: <CheckCircleIcon className='h-5 w-5 text-green-400' aria-hidden='true' />,
  error: <XCircleIcon className='h-5 w-5 text-red-400' aria-hidden='true' />,
  info: <InformationCircleIcon className='h-5 w-5 text-blue-400' aria-hidden='true' />,
  warning: <ExclamationTriangleIcon className='h-5 w-5 text-yellow-400' aria-hidden='true' />,
};

const NotificationContext = createContext<any>(null);

export const useNotification = () => {
  return useContext(NotificationContext);
};

/**
 * Provides a notification system for displaying notifications to the user.
 */
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  /**
   * Represents the list of notifications.
   */
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  /**
   * Adds a new notification to the list.
   * @param notification The notification to add.
   */
  const addNotification = (notification: NotificationProps) => {
    const id = notification.id || `${Date.now()}-${Math.random()}`;
    setNotifications([...notifications, { ...notification, id }]);

    if (notification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }
  };

  /**
   * Removes a notification from the list.
   * @param id The ID of the notification to remove.
   */
  const removeNotification = (id: string) => {
    setNotifications((prevNotifications) => prevNotifications.filter((n) => n.id !== id));
  };

  /**
   * Represents the transitions for animating the notifications.
   */
  const transitions = useTransition(notifications, {
    from: { opacity: 0, transform: 'translate3d(100%, 0, 0)' },
    enter: { opacity: 1, transform: 'translate3d(0%, 0, 0)' },
    leave: { opacity: 0, transform: 'translate3d(100%, 0, 0)' },
    keys: (notification) => notification.id?.toString() ?? '',
  });

  return (
    <NotificationContext.Provider value={addNotification}>
      {children}
      <div
        aria-live='assertive'
        className='pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6'
      >
        <div className='flex w-full flex-col items-center space-y-4 sm:items-end'>
          {transitions((style, notification) => (
            <animated.div style={style}>
              <div
                className={`pointer-events-auto w-full min-w-90 max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 ${
                  variantClasses[notification.variant || 'info']
                }`}
              >
                <div className='p-4'>
                  <div className='flex items-start'>
                    <div className='flex-shrink-0'>
                      {notification.icon || variantIcon[notification.variant || 'info']}
                    </div>
                    <div className='ml-3 w-0 flex-1 pt-0.5'>
                      <p className='text-sm font-medium'>{notification.title}</p>
                      {notification.description && <p className='mt-1 text-sm'>{notification.description}</p>}
                      <div className='mt-4 flex'>
                        {notification.primaryButton && (
                          <button
                            onClick={notification.primaryButton.onClick}
                            className='mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          >
                            {notification.primaryButton.text}
                          </button>
                        )}
                        {notification.secondaryButton && (
                          <button
                            onClick={notification.secondaryButton.onClick}
                            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          >
                            {notification.secondaryButton.text}
                          </button>
                        )}
                        {notification.primaryLink && (
                          <a
                            href={notification.primaryLink.href}
                            className='mr-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          >
                            {notification.primaryLink.text}
                          </a>
                        )}
                        {notification.secondaryLink && (
                          <a
                            href={notification.secondaryLink.href}
                            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          >
                            {notification.secondaryLink.text}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className='ml-4 flex flex-shrink-0'>
                      <button
                        type='button'
                        className='inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        onClick={() => removeNotification(notification.id!)}
                      >
                        <span className='sr-only'>Close</span>
                        <XMarkIcon className='h-5 w-5' aria-hidden='true' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </animated.div>
          ))}
        </div>
      </div>
    </NotificationContext.Provider>
  );
};
