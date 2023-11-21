import { ReactNode } from 'react';
import Image from 'next/image';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <section className='h-full w-full bg-neutral-200 dark:bg-neutral-700'>
      <div className='container mx-auto h-full'>
        <div className='h-full w-full'>
          <div className='block h-full rounded-lg bg-white shadow-lg dark:bg-neutral-800'>
            <div className='g-0 h-full lg:flex lg:flex-wrap'>
              {/* <!-- Left column container--> */}
              <div className='px-4 md:px-0 lg:w-6/12'>
                <div className='md:mx-6'>
                  {/* <!--Logo--> */}
                  <div className='w-50 mx-auto text-center'>
                    <Image
                      className='mx-auto w-48'
                      width={150}
                      height={150}
                      src='/img/logo.png'
                      alt='logo'
                      priority={true}
                    />
                    <h4 className='mb-6 mt-1 pb-1 text-xl font-semibold'>
                      We are The Mystery Team
                    </h4>
                  </div>

                  {children}
                </div>
              </div>

              {/* <!-- Right column container with background and description--> */}
              <div
                className='flex items-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg lg:rounded-bl-none'
                style={{
                  background:
                    'linear-gradient(to right, rgb(171 169 167), rgb(91 87 87), rgb(33 28 30), rgb(24 3 18))',
                }}
              >
                <div className='px-4 py-6 text-white md:mx-6 md:p-12'>
                  <h4 className='mb-6 text-xl font-semibold'>
                    We are more than just a company
                  </h4>
                  <p className='text-sm'>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
