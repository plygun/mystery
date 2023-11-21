'use client';

import { TEInput, TERipple } from 'tw-elements-react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { array, mixed, object, string } from 'yup';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { selectIsAuthenticated } from '@/_features/auth/authSlice';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useRegisterMutation } from '@/_services/auth';
import { Loading } from '@/_features/misc/Loading';
import { notify } from '@/_services/helpers';
import { IRegisterResponse } from '@/_features/abstracts/requests';

type FormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar?: FileList;
  photos?: FileList;
};

const initialState: FormInputs = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

const schema = object().shape({
  firstName: string()
    .required('First Name is required')
    .min(2, 'First Name must be at least 2 characters')
    .max(25, 'First Name must be at most 25 characters'),
  lastName: string()
    .required('Last Name is required')
    .min(2, 'Last Name must be at least 2 characters')
    .max(25, 'Last Name must be at most 25 characters'),
  email: string()
    .required('Email is required')
    .email('Email must be a valid email'),
  password: string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be at most 50 characters')
    .matches(/\d+/, 'Password must contain at least one number'),
  photos: mixed()
    .required('Photos are required')
    .test(
      'amount',
      'You must upload at least 4 photos',
      (value: FileList) => value.length >= 4
    ),
});

export default function Register() {
  const [registerAction, { isLoading }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    setError,
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
      // create payload with text data
      const payloadData = new FormData();
      payloadData.append('firstName', data.firstName);
      payloadData.append('lastName', data.lastName);
      payloadData.append('email', data.email);
      payloadData.append('password', data.password);

      // add optional avatar
      if (data.avatar && data.avatar.length > 0) {
        payloadData.append('avatar', data.avatar[0]);
      }

      // add photos
      for (const [key, value] of Object.entries(data.photos)) {
        payloadData.append(`photos[${key}]`, value);
      }

      const registerResponse: IRegisterResponse =
        await registerAction(payloadData).unwrap();

      if (!registerResponse.success) {
        notify('Invalid response from server', 'error');
        return;
      }

      notify('Registration successful');
      router.push('/login');
    } catch (err) {
      for (const [field, errors] of Object.entries(err.data.errors)) {
        setError(field as keyof FormInputs, {
          type: `manual`,
          message: errors as string,
        });
      }

      notify('Registration failed', 'error');
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
      <p className='mb-4'>Please register an account</p>
      {/* <!--First name input--> */}
      <TEInput
        type='text'
        label='First name'
        className={errors.firstName ? 'mb-1' : 'mb-4'}
        {...register<any, FormInputs>('firstName')}
      >
        {' '}
      </TEInput>
      <ErrorMessage
        errors={errors}
        name='firstName'
        render={({ message }) => (
          <span className='mb-3 ml-1 flex items-center text-xs font-medium tracking-wide text-red-500'>
            {message}
          </span>
        )}
      />

      {/* <!--Last name input--> */}
      <TEInput
        type='text'
        label='Last name'
        className={errors.lastName ? 'mb-1' : 'mb-4'}
        {...register<any, FormInputs>('lastName')}
      >
        {' '}
      </TEInput>
      <ErrorMessage
        errors={errors}
        name='lastName'
        render={({ message }) => (
          <span className='mb-3 ml-1 flex items-center text-xs font-medium tracking-wide text-red-500'>
            {message}
          </span>
        )}
      />

      {/* <!--Email input--> */}
      <TEInput
        type='email'
        label='Email'
        className={errors.email ? 'mb-1' : 'mb-4'}
        {...register<any, FormInputs>('email')}
      >
        {' '}
      </TEInput>
      <ErrorMessage
        errors={errors}
        name='email'
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

      {/* <!--Avatar input--> */}
      <div className='mb-4'>
        <label
          htmlFor='registerFormAvatar'
          className='mb-2 inline-block text-neutral-700 dark:text-neutral-200'
        >
          Avatar
        </label>
        <input
          className='relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary'
          id='registerFormAvatar'
          type='file'
          accept={'.jpeg,.jpg,.png'}
          {...register<any, FormInputs>('avatar')}
        />
        <ErrorMessage
          errors={errors}
          name='avatar'
          render={({ message }) => (
            <span className='mb-3 ml-1 flex items-center text-xs font-medium tracking-wide text-red-500'>
              {message}
            </span>
          )}
        />
      </div>

      {/* <!--Photos input--> */}
      <div className='mb-4'>
        <label
          htmlFor='registerFormPhotos'
          className='mb-2 inline-block text-neutral-700 dark:text-neutral-200'
        >
          Photos
        </label>
        <input
          className='relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary'
          id='registerFormPhotos'
          type='file'
          multiple
          accept={'.jpeg,.jpg,.png'}
          {...register<any, FormInputs>('photos')}
        />

        <ErrorMessage
          errors={errors}
          criteriaMode='all'
          name='photos'
          render={({ message }) => (
            <span className='mb-3 ml-1 flex items-center text-xs font-medium tracking-wide text-red-500'>
              {message}
            </span>
          )}
        />
      </div>

      {/* <!--Submit button--> */}
      <div className='mb-6 pb-1 pt-1 text-center'>
        <TERipple rippleColor='light' className='w-full'>
          <button
            className='mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]'
            type='submit'
            style={{
              background:
                'linear-gradient(to right, rgb(171 169 167), rgb(91 87 87), rgb(33 28 30), rgb(24 3 18))',
            }}
          >
            Sign up
          </button>
        </TERipple>
      </div>

      {/* <!--Register button--> */}
      <div className='flex items-center justify-between pb-6'>
        <p className='mb-0 mr-2'>Have an account?</p>
        <Link href={'/login'}>
          <TERipple rippleColor='light'>
            <button
              type='button'
              className='inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10'
            >
              Login
            </button>
          </TERipple>
        </Link>
      </div>

      {isLoading && <Loading />}
    </form>
  );
}
