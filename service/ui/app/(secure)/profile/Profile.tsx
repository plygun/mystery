'use client';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Profile.css';
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  setInvalidateCredentials,
  setUser,
} from '@/_features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from '@/_features/misc/Loading';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TOKEN_STORAGE_KEY, useMeMutation } from '@/_services/auth';
import { IMeResponse } from '@/_features/abstracts/requests';
import { notify } from '@/_services/helpers';
import { IUser } from '@/_features/abstracts/models';
import { TERipple } from 'tw-elements-react';

export function Profile() {
  const [loggedOut, setLoggedOut] = useState(false);
  const user: IUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const router = useRouter();
  const [getProfileData, { isLoading }] = useMeMutation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setInvalidateCredentials());
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (err) {}
    setLoggedOut(true);
    router.push('/login');
  };

  // Fetch user data
  useEffect(() => {
    if (isLoading || user || loggedOut) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // If user is already set, don't fetch it again
        if (isLoading || user || loggedOut) {
          return;
        }

        const profile: IMeResponse = await getProfileData().unwrap();

        if (!profile.id) {
          notify('Invalid response from server', 'error');
          return;
        }

        dispatch(setUser({ user: profile }));
      } catch (err) {
        notify(err.data.message, 'error');
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAuthenticated || !user || loggedOut) {
    return <Loading />;
  }

  return (
    <>
      <div className='mb-6 w-32 rounded-lg pt-4'>
        <Image
          src={user.avatar}
          loader={({ src }) => src}
          width={200}
          height={200}
          className='mb-2 w-32 rounded-lg'
          alt='Avatar'
        />
        <div className={'text-center'}>
          <h5 className='mb-2 text-xl font-medium leading-tight'>
            {user.fullName}
          </h5>
          <TERipple rippleColor='light'>
            <button
              type='button'
              className='inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10'
              onClick={handleLogout}
            >
              Logout
            </button>
          </TERipple>
        </div>
      </div>
      <div className='text-center'>
        <Carousel autoPlay interval='5000' infiniteLoop='true'>
          {user.photos.map((photo) => (
            <div key={photo.name}>
              <img src={photo.url} alt={photo.name} />
              <p className='legend'>{photo.name}</p>
            </div>
          ))}
        </Carousel>
      </div>
    </>
  );
}
