import type { User } from 'src/auth/types';

import { axios } from './api';

export async function getUserInfo(): Promise<User> {
  const { data } = await axios.get<User>('/user/info');
  return data;
}

export * as UserRequests from './user.requests';
