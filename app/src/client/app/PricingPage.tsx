import { CheckIcon } from '@heroicons/react/20/solid';
import { TierIds } from '../../shared/constants';
import { stripePayment } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { z } from 'zod';

const tiers = [
  {
    name: 'Basic Plan',
    id: TierIds.BASIC,
    priceMonthly: '$200',
    description: 'Perfect for beginners...',
    features: ['1 class per week', 'Total 4 classes per month'],
    mostPopular: false,
  },
  {
    name: 'Standard Plan',
    id: TierIds.STANDARD,
    priceMonthly: '$400',
    description: 'Ideal for steady progress...',
    features: ['2 classes per week', 'Total 8 classes per month'],
    mostPopular: true,
  },
  {
    name: 'Premium Plan',
    id: TierIds.PREMIUM,
    priceMonthly: '$600',
    description: 'Designed for dedicated learners...',
    features: ['3 classes per week', 'Total 12 classes per month'],
    mostPopular: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const PricingPage = () => {
  const [isStripePaymentLoading, setIsStripePaymentLoading] = useState<boolean | string>(false);
  const { data: user, isLoading: isUserLoading } = useAuth();
  const history = useHistory();

  async function handleBuyNowClick(tierId: string) {
    if (!user) {
      history.push('/login');
      return;
    }
    try {
      setIsStripePaymentLoading(tierId);
      let stripeResults = await stripePayment(tierId);

      if (stripeResults?.sessionUrl) {
        window.open(stripeResults.sessionUrl, '_self');
      }
    } catch (error: any) {
      console.error(error?.message ?? 'Something went wrong.');
    } finally {
      setIsStripePaymentLoading(false);
    }
  }

  const handleCustomerPortalClick = () => {
    if (!user) {
      history.push('/login');
      return;
    }
    try {
      const schema = z.string().url();
      const customerPortalUrl = schema.parse(import.meta.env.REACT_APP_STRIPE_CUSTOMER_PORTAL);
      window.open(customerPortalUrl, '_blank');
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className='bg-white dark:bg-boxdark-2 py-24 sm:py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl text-center'>
          <h2 className='text-base font-semibold leading-7 text-yellow-500'>Pricing</h2>
          <p className='mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl'>
            Pricing plans for teams of&nbsp;all&nbsp;sizes
          </p>
        </div>
        <p className='mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-gray-400'>
          Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et quasi iusto modi velit ut non voluptas in.
          Explicabo id ut laborum.
        </p>
        <div className='isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3'>
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={classNames(
                tier.mostPopular ? 'lg:z-10 lg:rounded-b-none' : 'lg:mt-8',
                tierIdx === 0 ? 'lg:rounded-r-none' : '',
                tierIdx === tiers.length - 1 ? 'lg:rounded-l-none' : '',
                'flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10'
              )}
            >
              <div>
                <div className='flex items-center justify-between gap-x-4'>
                  <h3
                    id={tier.id}
                    className={classNames(
                      tier.mostPopular ? 'text-indigo-600' : 'text-gray-900',
                      'text-lg font-semibold leading-8'
                    )}
                  >
                    {tier.name}
                  </h3>
                  {tier.mostPopular && (
                    <p className='rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600'>
                      Most popular
                    </p>
                  )}
                </div>
                <p className='mt-4 text-sm leading-6 text-gray-600'>{tier.description}</p>
                <p className='mt-6 flex items-baseline gap-x-1'>
                  <span className='text-4xl font-bold tracking-tight text-gray-900'>{tier.priceMonthly}</span>
                  <span className='text-sm font-semibold leading-6 text-gray-600'>/month</span>
                </p>
                <ul role='list' className='mt-8 space-y-3 text-sm leading-6 text-gray-600'>
                  {tier.features.map((feature) => (
                    <li key={feature} className='flex gap-x-3'>
                      <CheckIcon className='h-6 w-5 flex-none text-indigo-600' aria-hidden='true' />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {!!user && !!user.subscriptionStatus ? (
                <button
                  onClick={handleCustomerPortalClick}
                  aria-describedby='manage-subscription'
                  className={classNames(
                    'mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                    tier.mostPopular
                      ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
                      : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300'
                  )}
                >
                  Manage Subscription
                </button>
              ) : (
                <button
                  onClick={() => handleBuyNowClick(tier.id)}
                  aria-describedby={tier.id}
                  className={classNames(
                    'mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                    tier.mostPopular
                      ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
                      : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
                    isStripePaymentLoading && isStripePaymentLoading === tier.id ? 'opacity-50 cursor-not-allowed' : ''
                  )}
                >
                  {!!user ? 'Buy plan' : 'Log in to buy plan'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
