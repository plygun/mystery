import { ReactNode } from 'react';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <section className='w-full bg-neutral-200 dark:bg-neutral-700'>
      <div className='container mx-auto'>
        <div className='w-full'>
          <div className='h-ful block rounded-lg bg-white shadow-lg dark:bg-neutral-800'>
            <div className=''>
              {/* <!-- Left column container--> */}
              <div className='lg:w-12/12 px-4 md:px-0'>
                <div className='md:mx-12'>{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
