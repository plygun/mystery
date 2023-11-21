'use client';

import { TEInput, TERipple } from 'tw-elements-react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { object, string } from 'yup';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { selectIsAuthenticated, setToken } from '@/_features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { TOKEN_STORAGE_KEY, useLoginMutation } from '@/_services/auth';
import { Loading } from '@/_features/misc/Loading';
import { notify } from '@/_services/helpers';
import { ILoginResponse } from '@/_features/abstracts/requests';

type FormInputs = {
  username: string;
  password: string;
};

const initialState: FormInputs = {
  username: '',
  password: '',
};

const schema = object().shape({
  username: string().required('Username is required'),
  password: string().required('Password is required'),
});

export default function Login() {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    mode: 'onSubmit',
    defaultValues: initialState,
    resolver: yupResolver(schema),
  });
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const router = useRouter();
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (isLoading) {
      return;
    }

    try {
      const tokenResponse: ILoginResponse = await login(data).unwrap();

      if (!tokenResponse.token) {
        notify('Invalid response from server', 'error');
        return;
      }

      // Save token to local storage
      localStorage.setItem(TOKEN_STORAGE_KEY, tokenResponse.token);

      notify('Login successful');
      dispatch(setToken({ token: tokenResponse.token }));
    } catch (err) {
      notify(err.data.message, 'error');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className='mb-4'>Please login to your account</p>

      {/* <!--Username input--> */}
      <TEInput
        type='text'
        label='Username'
        name='username'
        id='username'
        className={errors.username ? 'mb-1' : 'mb-4'}
        {...register<any, FormInputs>('username')}
      >
        {' '}
      </TEInput>
      <ErrorMessage
        errors={errors}
        name='username'
        render={({ message }) => (
          <span className='mb-3 ml-1 flex items-center text-xs font-medium tracking-wide text-red-500'>
            {message}
          </span>
        )}
      />

      {/* <!--Password input--> */}
      <TEInput
        type='password'
        label='Password'
        className={errors.password ? 'mb-1' : 'mb-4'}
        {...register<any, FormInputs>('password')}
      >
        {' '}
      </TEInput>
      <ErrorMessage
        errors={errors}
        name='password'
        render={({ message }) => (
          <span className='mb-3 ml-1 flex items-center text-xs font-medium tracking-wide text-red-500'>
            {message}
          </span>
        )}
      />

      {/* <!--Submit button--> */}
      <div className='mb-12 pb-1 pt-1 text-center'>
        <TERipple rippleColor='light' className='w-full'>
          <button
            className='mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]'
            type='submit'
            style={{
              background:
                'linear-gradient(to right, rgb(171 169 167), rgb(91 87 87), rgb(33 28 30), rgb(24 3 18))',
            }}
          >
            Log in
          </button>
        </TERipple>

        {/* <!--Forgot password link--> */}
        <a href='#!'>Forgot password?</a>
      </div>

      {/* <!--Register button--> */}
      <div className='flex items-center justify-between pb-6'>
        <p className='mb-0 mr-2'>Don&apos;t have an account?</p>
        <Link href={'/register'}>
          <TERipple rippleColor='light'>
            <button
              type='button'
              className='inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10'
            >
              Register
            </button>
          </TERipple>
        </Link>
      </div>

      {isLoading && <Loading />}
    </form>
  );
}
