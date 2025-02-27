import { atom, map } from 'nanostores';
import { pb } from '@/services/backend/pocketbase'
import type { UsersRecord } from '@/services/backend/pbTypes';

export const isLoggedInStore = atom(pb.authStore.isValid);
export const $userDataStore = map<Record<string, UsersRecord>>({})