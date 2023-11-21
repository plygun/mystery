import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/_redux/store';
import { FetchBaseQueryArgs } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import {
  ILoginRequest,
  ILoginResponse,
  IMeResponse,
  IRegisterRequest,
  IRegisterResponse,
} from '@/_features/abstracts/requests';

export const TOKEN_STORAGE_KEY = 'token';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/users/`,
    prepareHeaders: (headers: Headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  } as FetchBaseQueryArgs),
  endpoints: (builder) => ({
    register: builder.mutation<IRegisterResponse, IRegisterRequest>({
      query: (data) => ({
        url: 'register',
        method: 'POST',
        body: data,
        formData: true,
      }),
    } as any),
    login: builder.mutation<ILoginResponse, ILoginRequest>({
      query: (data) => ({
        url: 'login',
        method: 'POST',
        body: data,
      }),
    } as any),
    me: builder.mutation<IMeResponse, void>({
      query: () => ({
        url: 'me',
        method: 'GET',
      }),
    } as any),
  }),
});

export const { useRegisterMutation, useLoginMutation, useMeMutation } = api;
