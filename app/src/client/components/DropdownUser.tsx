import { type User } from 'wasp/entities';
import { useEffect, useRef, useState, useCallback } from 'react';
import { TfiAngleDown } from 'react-icons/tfi';
import { UserMenuItems } from './UserMenuItems';
import { cn } from '../../shared/utils';

/**
 * Dropdown component for user profile actions.
 * @param {Object} props - Component properties.
 * @param {Partial<User>} props.user - Partial user object.
 * @returns {JSX.Element} The dropdown component.
 */
const DropdownUser = ({ user }: { user: Partial<User> }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Toggles the dropdown menu visibility.
   */
  const toggleDropdown = useCallback(() => setDropdownOpen((prev) => !prev), []);

  /**
   * Handles outside click to close dropdown.
   * @param {MouseEvent} event - Mouse event.
   */
  const handleOutsideClick = useCallback(
    ({ target }: MouseEvent) => {
      if (!dropdownRef.current || !triggerRef.current) return;
      if (
        dropdownOpen &&
        !dropdownRef.current.contains(target as Node) &&
        !triggerRef.current.contains(target as Node)
      ) {
        setDropdownOpen(false);
      }
    },
    [dropdownOpen]
  );

  /**
   * Handles escape key press to close dropdown.
   * @param {KeyboardEvent} event - Keyboard event.
   */
  const handleEscapePress = useCallback(
    ({ key }: KeyboardEvent) => {
      if (dropdownOpen && key === 'Escape') {
        setDropdownOpen(false);
      }
    },
    [dropdownOpen]
  );

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscapePress);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapePress);
    };
  }, [handleOutsideClick, handleEscapePress]);

  /**
   * Generates initials from user's full name.
   * @param {string} name - Full name of the user.
   * @returns {string} Initials of the user.
   */
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n, index, arr) => (index === 0 || index === arr.length - 1 ? n[0].toUpperCase() : ''))
      .join('');
  };

  return (
    <div className='relative'>
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        className='flex items-center gap-4 duration-300 ease-in-out text-gray-900 hover:text-indigo-600'
        aria-expanded={dropdownOpen}
        aria-controls='user-menu'
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt='Avatar' className='h-8 w-8 rounded-full' />
        ) : (
          <div className='h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700'>
            {getInitials(user.fullName ?? '')}
          </div>
        )}
      </button>

      {/* Dropdown */}
      <div
        id='user-menu'
        ref={dropdownRef}
        className={cn(
          'absolute right-0 top-full z-10 mt-3 min-w-70 overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700',
          { hidden: !dropdownOpen }
        )}
      >
        <UserMenuItems user={user} setMobileMenuOpen={toggleDropdown} />
      </div>
    </div>
  );
};

export default DropdownUser;
