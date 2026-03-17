import { axios } from './api';

export type SignInResponse = {
  accessToken: string;
};

export type SignInParams = {
  email: string;
  password: string;
};

export async function signIn(params: SignInParams): Promise<SignInResponse> {
  const { data } = await axios.post<SignInResponse>('/system/sign-in', params);
  return data;
}

export * as SystemRequests from './system.requests';
