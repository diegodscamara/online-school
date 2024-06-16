import { ChevronRightIcon } from '@heroicons/react/20/solid';
import openSaasBanner from '../static/open-saas-banner.png';

const DOCS_URL = '#'; // Replace with your actual documentation URL

export default function Hero() {
  return (
    <div className='bg-white dark:bg-boxdark-2'>
      <div className='relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20'>
        <div className='pb-24 pt-10 sm:pb-32 lg:grid items-center lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40'>
          <div className='px-6 lg:px-0 lg:pt-4'>
            <div>
              <div>
                <div className='mt-24 sm:mt-32 lg:mt-16'>
                  <a href='#' className='inline-flex space-x-6'>
                    <span className='rounded-full bg-indigo-600/10 dark:bg-indigo3-300/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-300 ring-1 ring-inset ring-indigo-600/10 dark:ring-indigo-300/10'>
                      What's new
                    </span>
                    <span className='inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600 dark:text-gray-300'>
                      <span>Just shipped v0.1.0</span>
                      <ChevronRightIcon className='h-5 w-5 text-gray-400 dark:text-gray-200' aria-hidden='true' />
                    </span>
                  </a>
                </div>
                <h1 className='mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white'>
                  Supercharge your web applications
                </h1>
                <p className='mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400'>
                  Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt
                  amet fugiat veniam occaecat fugiat aliqua.
                </p>
                <div className='mt-10 flex items-center gap-x-6'>
                  <a
                    href={DOCS_URL}
                    className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  >
                    Get started
                  </a>
                  <a href='#' className='text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50'>
                    View on GitHub <span aria-hidden='true'>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen'>
            <div
              className='absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white dark:bg-boxdark-2 shadow-xl shadow-indigo-600/10 dark-shadow-indigo-200/10 ring-1 ring-indigo-50 dark:ring-indigo-900 md:-mr-20 lg:-mr-36'
              aria-hidden='true'
            />
            <div className='shadow-lg md:rounded-3xl'>
              <div className='bg-indigo-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]'>
                <div
                  className='absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-indigo-100 dark:bg-indigo-800 opacity-20 ring-1 ring-inset ring-white dark:ring-boxdark-2 md:ml-20 lg:ml-36'
                  aria-hidden='true'
                />
                <div className='relative px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0'>
                  <div className='mx-auto max-w-2xl md:mx-0 md:max-w-none'>
                    <img
                      src={openSaasBanner}
                      alt='App screenshot'
                      width={2432}
                      height={1442}
                      className='rounded-md shadow-2xl ring-1 ring-gray-900/10 dark:ring-gray-50/10'
                    />{' '}
                  </div>
                  <div
                    className='pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 md:rounded-3xl'
                    aria-hidden='true'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white dark:from-boxdark-2 sm:h-32' />
      </div>
    </div>
  );
}
