import { LoginForm, useAuth } from 'wasp/client/auth';
import { useHistory, useLocation } from 'react-router-dom';

import { AuthWrapper } from './authWrapper';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

interface LocationState {
  from?: string;
}

export default function Login() {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const { data: user } = useAuth();

  useEffect(() => {
    if (user) {
      const redirectTo = localStorage.getItem('redirectAfterLogin') || '/demo-app';
      localStorage.removeItem('redirectAfterLogin');
      history.push(redirectTo);
    }
  }, [user, history, location]);

  return (
    <AuthWrapper>
      <LoginForm />
      <br />
      <span className='text-sm font-medium text-gray-900 dark:text-gray-900'>
        Don't have an account yet?{' '}
        <Link to='/signup' className='underline'>
          go to signup
        </Link>
        .
      </span>
      <br />
      <span className='text-sm font-medium text-gray-900'>
        Forgot your password?{' '}
        <Link to='/request-password-reset' className='underline'>
          reset it
        </Link>
        .
      </span>
    </AuthWrapper>
  );
}
